import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Hotel from "./models/Hotel.js";

dotenv.config();

const hotels = [
  {
    name: "Taj Krishna",
    location: "Hyderabad, Telangana",
    rating: 4.6,
    price: 8500,
    image: "/AI-Travel-Planner/assets/hotel1.jpg",
    description:
      "A luxury hotel offering comfortable rooms, excellent dining and premium hospitality.",
    amenities: [
      "Free WiFi",
      "Swimming Pool",
      "Restaurant",
      "Gym",
      "Parking"
    ]
  },
  {
    name: "ITC Grand Chola",
    location: "Chennai, Tamil Nadu",
    rating: 4.7,
    price: 12000,
    image: "/AI-Travel-Planner/assets/hotel2.jpg",
    description:
      "A luxurious stay in Chennai with elegant rooms and modern facilities.",
    amenities: [
      "Free WiFi",
      "Swimming Pool",
      "Spa",
      "Restaurant",
      "Gym"
    ]
  },
  {
    name: "The Leela Palace Bengaluru",
    location: "Bangalore, Karnataka",
    rating: 4.7,
    price: 14000,
    image: "/AI-Travel-Planner/assets/hotel3.jpg",
    description:
      "A premium palace-style hotel offering a relaxing and luxurious experience.",
    amenities: [
      "Free WiFi",
      "Pool",
      "Spa",
      "Restaurant",
      "Room Service"
    ]
  },
  {
    name: "Taj Lake Palace",
    location: "Udaipur, Rajasthan",
    rating: 4.8,
    price: 18000,
    image: "/AI-Travel-Planner/assets/hotel4.jpg",
    description:
      "A beautiful luxury hotel located on Lake Pichola with stunning views.",
    amenities: [
      "Lake View",
      "Restaurant",
      "Swimming Pool",
      "Spa",
      "Free WiFi"
    ]
  },
  {
    name: "The Oberoi Rajvilas",
    location: "Jaipur, Rajasthan",
    rating: 4.8,
    price: 20000,
    image: "/AI-Travel-Planner/assets/hotel5.jpg",
    description:
      "A luxury resort inspired by Rajasthan's royal heritage.",
    amenities: [
      "Free WiFi",
      "Pool",
      "Spa",
      "Restaurant",
      "Garden"
    ]
  },
  {
    name: "Taj Exotica Resort & Spa",
    location: "Goa, India",
    rating: 4.7,
    price: 15000,
    image: "/AI-Travel-Planner/assets/hotel6.jpg",
    description:
      "A relaxing Goa resort offering beautiful surroundings and premium facilities.",
    amenities: [
      "Beach Access",
      "Swimming Pool",
      "Spa",
      "Restaurant",
      "Free WiFi"
    ]
  }
];

const seedHotels = async () => {
  try {
    await connectDB();

    await Hotel.deleteMany();

    await Hotel.insertMany(hotels);

    console.log("Hotels inserted successfully");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Seed Error:", error);

    process.exit(1);
  }
};

seedHotels();