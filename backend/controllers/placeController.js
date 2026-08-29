import Place from '../models/Place.js';
import { searchPlaces } from '../services/osmService.js';
import { getWikipediaSummary } from '../services/imageService.js';

export const getPlaces = async (req, res) => {
  try {
    const search = (req.query.search || '').trim();
    if (!search) return res.json({ success: true, source: 'database', destination: null, count: 0, places: [] });
    const result = await searchPlaces(search, 30);
    
    // Concurrently fetch summaries and save places in database
    const places = await Promise.all(result.places.map(async (raw) => {
      let doc = await Place.findOne({ osmId: raw.osmId });
      
      const wiki = await getWikipediaSummary(raw.name, raw.wikipedia);
      const image = raw.image || wiki.image;
      const description = raw.description || wiki.description || "Explore beautiful attractions and historical landmarks at this travel destination.";
      
      const payload = {
        ...raw,
        image: image || (doc && doc.image ? doc.image : ''),
        description: description || (doc && doc.description ? doc.description : 'Explore beautiful attractions and historical landmarks at this travel destination.'),
        destination: result.destination.displayName
      };
      
      if (doc) {
        Object.assign(doc, payload);
      } else {
        doc = new Place(payload);
      }
      await doc.save();
      return doc;
    }));
    
    res.json({ success: true, source: 'openstreetmap', searchedLocation: result.destination, count: places.length, places });
  } catch (error) {
    console.error('GET PLACES ERROR:', error);
    res.status(502).json({ success: false, message: error.message || 'Failed to search places' });
  }
};

export const getPlaceById = async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
  res.json({ success: true, place });
};
