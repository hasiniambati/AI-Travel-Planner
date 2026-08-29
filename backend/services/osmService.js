const NOMINATIM = 'https://nominatim.openstreetmap.org';
const PHOTON = 'https://photon.komoot.io/api';
const OVERPASS_SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter'
];

// Public geocoders require a clearly identifying application header.
// Nominatim is used only as a fallback; Photon is preferred for normal searches.
const headers = {
  'User-Agent': 'AI-Travel-Planner/1.0 (+https://github.com/hasiniambati/AI-Travel-Planner)',
  'Accept-Language': 'en'
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const geocodeCache = new Map();

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });
  if (!response.ok) throw new Error(`External map service returned ${response.status}`);
  return response.json();
}

function normalizePhoton(feature) {
  const p = feature?.properties || {};
  const c = feature?.geometry?.coordinates || [];
  if (c.length < 2) return null;
  const name = p.name || p.city || p.locality || p.state || p.country;
  if (!name) return null;
  const parts = [p.name, p.city, p.state, p.country].filter(Boolean);
  return {
    name: parts.slice(0, 2).join(', '),
    displayName: parts.join(', '),
    latitude: Number(c[1]),
    longitude: Number(c[0]),
    type: p.osm_value || p.type || p.osm_key || 'place',
    osmId: p.osm_id,
    osmType: p.osm_type
  };
}

async function geocodePhoton(value) {
  const url = `${PHOTON}?q=${encodeURIComponent(value)}&limit=5&lang=en`;
  const data = await fetchJson(url);
  const candidates = (data.features || []).map(normalizePhoton).filter(Boolean);
  if (!candidates.length) return null;

  // Prefer city/locality/country results over similarly named businesses.
  const preferred = candidates.find((x) => /city|town|village|municipality|country|state|locality/i.test(x.type));
  return preferred || candidates[0];
}

async function geocodeNominatim(value) {
  // Respect the public Nominatim service's low request rate.
  await sleep(1100);
  const data = await fetchJson(`${NOMINATIM}/search?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(value)}`);
  if (!data.length) return null;
  const item = data[0];
  return {
    name: item.display_name.split(',').slice(0, 2).join(',').trim(),
    displayName: item.display_name,
    latitude: Number(item.lat),
    longitude: Number(item.lon),
    type: item.type,
    osmId: item.osm_id,
    osmType: item.osm_type
  };
}

export async function geocode(query) {
  let value = String(query || '').trim();
  if (!value) throw new Error('Destination is required');

  const queryLower = value.toLowerCase();
  if (queryLower === 'golconda') {
    value = 'Golconda Fort, Hyderabad, India';
  } else if (queryLower === 'charminar') {
    value = 'Charminar, Hyderabad, India';
  } else if (queryLower === 'hampi') {
    value = 'Hampi, Karnataka, India';
  }

  const key = value.toLowerCase();
  if (geocodeCache.has(key)) return geocodeCache.get(key);

  let result = null;
  let photonError = null;
  try {
    result = await geocodePhoton(value);
  } catch (error) {
    photonError = error;
  }

  if (!result) {
    try {
      result = await geocodeNominatim(value);
    } catch (error) {
      const status = error.message || '';
      throw new Error(`Unable to locate "${value}". Geocoding services are temporarily unavailable (${status}).`);
    }
  }

  if (!result || !Number.isFinite(result.latitude) || !Number.isFinite(result.longitude)) {
    throw new Error(`Destination "${value}" could not be found`);
  }
  geocodeCache.set(key, result);
  return result;
}

async function overpass(query) {
  let lastError = null;
  for (const endpoint of OVERPASS_SERVERS) {
    try {
      const body = `data=${encodeURIComponent(query)}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      if (!response.ok) {
        lastError = new Error(`Overpass returned ${response.status}`);
        continue;
      }
      return response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('All map search services are unavailable');
}

function elementToPlace(element) {
  const tags = element.tags || {};
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (!tags.name || lat == null || lon == null) return null;
  return {
    name: tags.name,
    location: tags['addr:city'] || tags['addr:full'] || tags['addr:street'] || '',
    latitude: Number(lat),
    longitude: Number(lon),
    category: tags.tourism || tags.historic || tags.natural || tags.leisure || 'attraction',
    description: tags.description || tags['description:en'] || '',
    website: tags.website || tags['contact:website'] || '',
    phone: tags.phone || tags['contact:phone'] || '',
    osmId: `${element.type}-${element.id}`,
    wikipedia: tags.wikipedia || '',
    wikidata: tags.wikidata || '',
    image: tags.image || ''
  };
}

function uniqueByName(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.name.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function searchPlaces(destination, limit = 30) {
  const geo = await geocode(destination);
  const { latitude: lat, longitude: lon } = geo;
  let radius = 15000; // Reduced from 30000 to prevent Overpass 500 timeouts
  let query = `[out:json][timeout:20];(nwr["tourism"~"attraction|museum|gallery|theme_park|zoo|viewpoint|aquarium|artwork"](around:${radius},${lat},${lon});nwr["historic"](around:${radius},${lat},${lon});nwr["natural"~"beach|waterfall|peak|cave"](around:${radius},${lat},${lon});nwr["leisure"~"nature_reserve|park|garden"](around:${radius},${lat},${lon}););out center tags;`;
  
  let data;
  try {
    data = await overpass(query);
  } catch (error) {
    console.warn(`Overpass 15km places search failed: ${error.message}. Retrying with 8km...`);
    try {
      radius = 8000;
      query = `[out:json][timeout:15];(nwr["tourism"~"attraction|museum|gallery|theme_park|zoo|viewpoint|aquarium|artwork"](around:${radius},${lat},${lon});nwr["historic"](around:${radius},${lat},${lon});nwr["natural"~"beach|waterfall|peak|cave"](around:${radius},${lat},${lon});nwr["leisure"~"nature_reserve|park|garden"](around:${radius},${lat},${lon}););out center tags;`;
      data = await overpass(query);
    } catch (retryError) {
      console.error(`Overpass 8km places fallback search failed: ${retryError.message}`);
      data = { elements: [] }; // Return empty elements rather than failing the whole API request
    }
  }

  const places = uniqueByName(data.elements.map(elementToPlace).filter(Boolean));
  return { destination: geo, places: places.slice(0, limit) };
}

export async function searchHotels(destination, limit = 30) {
  const geo = await geocode(destination);
  const { latitude: lat, longitude: lon } = geo;
  let radius = 15000; // Reduced from 30000 to prevent Overpass 500 timeouts
  let query = `[out:json][timeout:20];nwr["tourism"~"hotel|guest_house|hostel|motel|resort"](around:${radius},${lat},${lon});out center tags;`;
  
  let data;
  try {
    data = await overpass(query);
  } catch (error) {
    console.warn(`Overpass 15km hotels search failed: ${error.message}. Retrying with 8km...`);
    try {
      radius = 8000;
      query = `[out:json][timeout:15];nwr["tourism"~"hotel|guest_house|hostel|motel|resort"](around:${radius},${lat},${lon});out center tags;`;
      data = await overpass(query);
    } catch (retryError) {
      console.error(`Overpass 8km hotels fallback search failed: ${retryError.message}`);
      data = { elements: [] };
    }
  }

  const hotels = uniqueByName(data.elements.map(elementToPlace).filter(Boolean));
  return { destination: geo, hotels: hotels.slice(0, limit) };
}
