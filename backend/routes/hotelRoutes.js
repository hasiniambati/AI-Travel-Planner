import express from "express";

const router = express.Router();

const hotels = [
  {
    id: 1,
    name: "Taj Krishna",
    location: "Hyderabad, Telangana",
    rating: 4.6,
    price: 8500,
    image: "/assets/hotel1.jpg"
  },
  {
    id: 2,
    name: "ITC Grand Chola",
    location: "Chennai, Tamil Nadu",
    rating: 4.7,
    price: 12000,
    image: "/assets/hotel2.jpg"
  },
  {
    id: 3,
    name: "The Leela Palace Bengaluru",
    location: "Bangalore, Karnataka",
    rating: 4.7,
    price: 14000,
    image: "/assets/hotel3.jpg"
  },
  {
    id: 4,
    name: "Taj Lake Palace",
    location: "Udaipur, Rajasthan",
    rating: 4.8,
    price: 18000,
    image: "/assets/hotel4.jpg"
  },
  {
    id: 5,
    name: "The Oberoi Rajvilas",
    location: "Jaipur, Rajasthan",
    rating: 4.8,
    price: 20000,
    image: "/assets/hotel5.jpg"
  },
  {
    id: 6,
    name: "Taj Exotica Resort & Spa",
    location: "Goa, India",
    rating: 4.7,
    price: 15000,
    image: "/assets/hotel6.jpg"
  }
];

router.get("/", (req, res) => {
  res.json({
    success: true,
    hotels
  });
});

export default router;