import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

export const createBooking = async (req, res) => {
  try {
    const {
      hotelId,
      checkIn,
      checkOut,
      guests
    } = req.body;

    if (!hotelId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        message: "All booking details are required"
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date"
      });
    }

    if (guests < 1) {
      return res.status(400).json({
        message: "At least one guest is required"
      });
    }

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const nights = Math.ceil(
      (checkOutDate - checkInDate) / millisecondsPerDay
    );

    const totalPrice = hotel.price * nights;

    const booking = await Booking.create({
      user: req.user._id,
      hotel: hotel._id,
      hotelName: hotel.name,
      location: hotel.location,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice
    });

    res.status(201).json({
      message: "Hotel booked successfully",
      booking
    });
  } catch (error) {
    console.error("Create Booking Error:", error);

    res.status(500).json({
      message: "Failed to create booking"
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id
    }).sort({
      createdAt: -1
    });

    res.json({
      bookings
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);

    res.status(500).json({
      message: "Failed to get bookings"
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.status = "Cancelled";

    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);

    res.status(500).json({
      message: "Failed to cancel booking"
    });
  }
};