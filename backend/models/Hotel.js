import mongoose from 'mongoose';
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  latitude: Number,
  longitude: Number,
  rating: { type: Number, min: 0, max: 5, default: 4.2 },
  price: { type: Number, min: 0, default: 2500 },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  amenities: { type: [String], default: [] },
  website: { type: String, default: '' },
  osmId: { type: String, unique: true, sparse: true },
  destination: { type: String, default: '' }
}, { timestamps: true });
export default mongoose.model('Hotel', hotelSchema);
