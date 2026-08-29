import express from "express";

import {
  createBooking,
  getMyBookings,
  cancelBooking,
  deleteBooking
} from "../controllers/bookingController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBooking);

router.get("/my", authMiddleware, getMyBookings);

router.put("/:id/cancel", authMiddleware, cancelBooking);

router.delete("/:id", authMiddleware, deleteBooking);

export default router;