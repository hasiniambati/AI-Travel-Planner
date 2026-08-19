import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";


dotenv.config();

const app = express();


// Database
connectDB();


// Middleware
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());


// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Travel Planner Backend is running"
  });
});


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/hotels", hotelRoutes);

app.use("/api/bookings", bookingRoutes);


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});