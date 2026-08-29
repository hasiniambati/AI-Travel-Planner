import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, default: '' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  category: { type: String, default: 'attraction' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  website: { type: String, default: '' },
  osmId: { type: String, unique: true, sparse: true },
  destination: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Place', placeSchema);
