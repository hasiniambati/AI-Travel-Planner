const WIKI_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';

function words(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
}

function relevant(title, name) {
  const a = words(title);
  const b = words(name);
  if (!a.length || !b.length) return false;
  const matches = b.filter((word) => a.includes(word));
  if (b.length >= 2) return matches.length >= 2 || matches.some((w) => w.length >= 7);
  return matches.length > 0;
}

// Fetch helper with timeout to avoid blocking requests indefinitely
async function fetchWithTimeout(url, options = {}, timeout = 1000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function getWikipediaSummary(name, wikipedia = '') {
  const result = { image: null, description: null };
  
  // 1. If we have a wikipedia link, query that article first
  try {
    if (wikipedia) {
      const title = wikipedia.split(':').slice(1).join(':') || wikipedia;
      const data = await fetchWithTimeout(`${WIKI_API}${encodeURIComponent(title.replace(/ /g, '_'))}`, { headers: { 'User-Agent': 'AI-Travel-Planner/1.0 (+https://github.com/hasiniambati/AI-Travel-Planner)' } })
        .then((r) => r.ok ? r.json() : null);
      if (data) {
        result.image = data.thumbnail?.source || data.originalimage?.source || null;
        result.description = data.extract || data.description || null;
      }
    }
  } catch {}

  // 2. If description is still missing and we have a name, search Wikipedia for a matching article summary
  if (!result.description && name) {
    try {
      const data = await fetchWithTimeout(`${WIKI_API}${encodeURIComponent(name.replace(/ /g, '_'))}`, { headers: { 'User-Agent': 'AI-Travel-Planner/1.0 (+https://github.com/hasiniambati/AI-Travel-Planner)' } })
        .then((r) => r.ok ? r.json() : null);
      if (data && (data.extract || data.description)) {
        if (!result.image) result.image = data.thumbnail?.source || data.originalimage?.source || null;
        result.description = data.extract || data.description || null;
      }
    } catch {}
  }

  return result;
}

export async function findPlaceImage(name, wikipedia = '') {
  // Backwards compatibility helper
  const summary = await getWikipediaSummary(name, wikipedia);
  if (summary.image) return summary.image;

  try {
    const params = new URLSearchParams({ action: 'query', generator: 'search', gsrsearch: name, gsrnamespace: '6', gsrlimit: '8', prop: 'imageinfo', iiprop: 'url', iiurlwidth: '900', format: 'json', origin: '*' });
    const data = await fetchWithTimeout(`${COMMONS_API}?${params}`, { headers: { 'User-Agent': 'AI-Travel-Planner/1.0 (+https://github.com/hasiniambati/AI-Travel-Planner)' } })
      .then((r) => r.ok ? r.json() : null);
    const pages = Object.values(data?.query?.pages || {});
    const match = pages.find((p) => relevant(p.title, name) && p.imageinfo?.[0]?.thumburl);
    return match?.imageinfo?.[0]?.thumburl || null;
  } catch {
    return null;
  }
}
