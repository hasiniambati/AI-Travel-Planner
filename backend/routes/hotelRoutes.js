import express from "express";

import {
  getHotels,
  getHotelById
} from "../controllers/hotelController.js";

const router = express.Router();


// GET /api/hotels
router.get("/", getHotels);


// GET /api/hotels/:id
router.get("/:id", getHotelById);


export default router;