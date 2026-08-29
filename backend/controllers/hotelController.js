import Hotel from '../models/Hotel.js';
import { searchHotels } from '../services/osmService.js';
import { findPlaceImage } from '../services/imageService.js';

function estimatePrice(name) {
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return 1800 + (hash % 9) * 900;
}

export const getHotels = async (req, res) => {
  try {
    const search = (req.query.search || '').trim();
    const sort = req.query.sort || '';
    if (!search) {
      let query = Hotel.find({}).limit(12);
      if (sort === 'price-low') query = query.sort({ price: 1 });
      if (sort === 'price-high') query = query.sort({ price: -1 });
      if (sort === 'rating') query = query.sort({ rating: -1 });
      const hotels = await query.lean();
      for (let i = hotels.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [hotels[i], hotels[j]] = [hotels[j], hotels[i]]; }
      return res.json({ success: true, source: 'database', count: hotels.length, hotels });
    }
    const result = await searchHotels(search, 30);
    
    // Concurrently fetch images and save hotels in database
    const hotels = await Promise.all(result.hotels.map(async (raw) => {
      let hotel = await Hotel.findOne({ osmId: raw.osmId });
      const image = raw.image || (raw.wikipedia ? await findPlaceImage(raw.name, raw.wikipedia) : null);
      const payload = {
        name: raw.name,
        location: raw.location || result.destination.displayName,
        latitude: raw.latitude,
        longitude: raw.longitude,
        rating: 4.1 + ((raw.name.length * 7) % 9) / 10,
        price: estimatePrice(raw.name),
        image: image || (hotel && hotel.image ? hotel.image : ''),
        description: raw.description || `${raw.name} in ${result.destination.displayName}. Price shown is a portfolio estimate, not live hotel pricing.`,
        amenities: ['Wi-Fi', 'Reception', 'Accommodation'],
        website: raw.website || '',
        osmId: raw.osmId,
        destination: result.destination.displayName
      };
      if (!hotel) hotel = new Hotel(payload); else Object.assign(hotel, payload);
      await hotel.save();
      return hotel;
    }));

    let output = hotels;
    if (sort === 'price-low') output = hotels.sort((a,b) => a.price - b.price);
    if (sort === 'price-high') output = hotels.sort((a,b) => b.price - a.price);
    if (sort === 'rating') output = hotels.sort((a,b) => b.rating - a.rating);
    res.json({ success: true, source: 'openstreetmap', searchedLocation: result.destination, count: output.length, hotels: output });
  } catch (error) {
    console.error('GET HOTELS ERROR:', error);
    res.status(502).json({ success: false, message: error.message || 'Failed to search hotels' });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, hotel });
  } catch { res.status(400).json({ success: false, message: 'Invalid hotel id' }); }
};
