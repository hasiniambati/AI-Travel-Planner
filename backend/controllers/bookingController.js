import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';

export const createBooking = async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut, guests } = req.body;
    if (!hotelId || !checkIn || !checkOut || !guests) return res.status(400).json({ message: 'All booking details are required' });
    const inDate = new Date(checkIn); const outDate = new Date(checkOut);
    if (outDate <= inDate) return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    const nights = Math.ceil((outDate - inDate) / 86400000);
    const totalPrice = hotel.price * nights;
    const booking = await Booking.create({ user: req.user._id, hotel: hotel._id, hotelName: hotel.name, location: hotel.location, latitude: hotel.latitude, longitude: hotel.longitude, checkIn: inDate, checkOut: outDate, guests, totalPrice });
    res.status(201).json({ success: true, message: 'Hotel booking confirmed', booking });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Failed to create booking' }); }
};
export const getMyBookings = async (req,res)=>res.json({ bookings: await Booking.find({user:req.user._id}).sort({createdAt:-1}) });
export const cancelBooking = async (req,res)=>{ const b=await Booking.findOne({_id:req.params.id,user:req.user._id}); if(!b)return res.status(404).json({message:'Booking not found'}); b.status='Cancelled'; await b.save(); res.json({message:'Booking cancelled successfully',booking:b}); };

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

