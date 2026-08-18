import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    rating: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    amenities: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;