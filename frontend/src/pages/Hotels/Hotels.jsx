import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import {
  getHotels,
  createBooking
} from "../../services/api.js";

import { useAuth } from "../../context/AuthContext.jsx";

import hotel1 from "../../assets/hotels/hotel1.jpg";
import hotel2 from "../../assets/hotels/hotel2.jpg";
import hotel3 from "../../assets/hotels/hotel3.jpg";
import hotel4 from "../../assets/hotels/hotel4.jpg";
import hotel5 from "../../assets/hotels/hotel5.jpg";
import hotel6 from "../../assets/hotels/hotel6.jpg";

import "./Hotels.css";

const hotelImages = {
  "hotel1.jpg": hotel1,
  "hotel2.jpg": hotel2,
  "hotel3.jpg": hotel3,
  "hotel4.jpg": hotel4,
  "hotel5.jpg": hotel5,
  "hotel6.jpg": hotel6
};

function Hotels() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [hotels, setHotels] = useState([]);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedHotel, setSelectedHotel] = useState(null);

  const [bookingHotel, setBookingHotel] = useState(null);

  const [checkIn, setCheckIn] = useState("");

  const [checkOut, setCheckOut] = useState("");

  const [guests, setGuests] = useState(1);

  const [bookingLoading, setBookingLoading] = useState(false);

  const loadHotels = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHotels(search, sort);

      setHotels(data.hotels);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, [sort]);

  const handleSearch = (e) => {
    e.preventDefault();

    loadHotels();
  };

  const handleBook = async () => {
    if (!user) {
      setBookingHotel(null);

      alert("Please login before booking a hotel.");

      navigate("/login");

      return;
    }

    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");

      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out date must be after check-in date.");

      return;
    }

    try {
      setBookingLoading(true);

      const data = await createBooking({
        hotelId: bookingHotel._id,
        checkIn,
        checkOut,
        guests: Number(guests)
      });

      alert(
        `Booking confirmed!\n\n${data.booking.hotelName}\nTotal: ₹${data.booking.totalPrice.toLocaleString(
          "en-IN"
        )}`
      );

      setBookingHotel(null);

      setCheckIn("");
      setCheckOut("");
      setGuests(1);
    } catch (error) {
      alert(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="hotels-page">

        <div className="hotels-header">

          <h1>Find Your Perfect Stay</h1>

          <p>
            Discover hotels that match your travel plans and budget.
          </p>

          <form
            className="hotel-search"
            onSubmit={handleSearch}
          >

            <input
              type="text"
              placeholder="Enter destination or hotel"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />

            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />

            <button type="submit">
              Search
            </button>

          </form>

        </div>

        <section className="hotel-section">

          <div className="section-top">

            <div>
              <h2>Recommended Hotels</h2>

              <p>
                {hotels.length} hotel
                {hotels.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >

              <option value="">
                Recommended
              </option>

              <option value="price-low">
                Price Low to High
              </option>

              <option value="price-high">
                Price High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>

            </select>

          </div>

          {loading && (
            <div className="no-hotels">
              <h2>Loading hotels...</h2>
            </div>
          )}

          {error && (
            <div className="no-hotels">
              <h2>Unable to load hotels</h2>

              <p>{error}</p>

              <button onClick={loadHotels}>
                Try Again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            hotels.length === 0 && (

              <div className="no-hotels">

                <h2>No hotels found</h2>

                <p>
                  Try another destination.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    loadHotels();
                  }}
                >
                  Show All Hotels
                </button>

              </div>

            )}

          {!loading &&
            !error &&
            hotels.length > 0 && (

              <div className="hotel-grid">

                {hotels.map((hotel) => (

                  <div
                    className="hotel-card"
                    key={hotel._id}
                  >

                    <img
                      src={hotelImages[hotel.image]}
                      alt={hotel.name}
                    />

                    <div className="hotel-info">

                      <h3>
                        {hotel.name}
                      </h3>

                      <p className="location">
                        📍 {hotel.location}
                      </p>

                      <div className="hotel-bottom">

                        <span className="rating">
                          ⭐ {hotel.rating}
                        </span>

                        <div>
                          <strong>
                            ₹{hotel.price.toLocaleString("en-IN")}
                          </strong>

                          <small>
                            {" "}/ night
                          </small>
                        </div>

                      </div>

                      <div className="hotel-buttons">

                        <button
                          className="view-btn"
                          onClick={() =>
                            setSelectedHotel(hotel)
                          }
                        >
                          View Hotel
                        </button>

                        <button
                          className="book-btn"
                          onClick={() =>
                            setBookingHotel(hotel)
                          }
                        >
                          Book Now
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

        </section>

      </div>

      {/* HOTEL DETAILS */}

      {selectedHotel && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedHotel(null)}
        >

          <div
            className="hotel-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-modal"
              onClick={() => setSelectedHotel(null)}
            >
              ✕
            </button>

            <img
              src={hotelImages[selectedHotel.image]}
              alt={selectedHotel.name}
            />

            <h2>
              {selectedHotel.name}
            </h2>

            <p>
              📍 {selectedHotel.location}
            </p>

            <p>
              ⭐ {selectedHotel.rating} / 5
            </p>

            <h3>
              ₹{selectedHotel.price.toLocaleString("en-IN")}
              {" "}/ night
            </h3>

            <p>
              {selectedHotel.description}
            </p>

            <h3>
              Amenities
            </h3>

            <p>
              {selectedHotel.amenities?.join(" • ")}
            </p>

          </div>

        </div>

      )}

      {/* BOOKING */}

      {bookingHotel && (

        <div
          className="modal-overlay"
          onClick={() => setBookingHotel(null)}
        >

          <div
            className="hotel-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-modal"
              onClick={() => setBookingHotel(null)}
            >
              ✕
            </button>

            <h2>
              🏨 Book Your Stay
            </h2>

            <h3>
              {bookingHotel.name}
            </h3>

            <p>
              📍 {bookingHotel.location}
            </p>

            <div className="booking-form">

              <label>
                Check-in

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) =>
                    setCheckIn(e.target.value)
                  }
                />

              </label>

              <label>
                Check-out

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) =>
                    setCheckOut(e.target.value)
                  }
                />

              </label>

              <label>
                Number of Guests

                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) =>
                    setGuests(e.target.value)
                  }
                />

              </label>

              <button
                className="book-confirm-btn"
                onClick={handleBook}
                disabled={bookingLoading}
              >
                {bookingLoading
                  ? "Booking..."
                  : "Confirm Booking"}
              </button>

            </div>

          </div>

        </div>

      )}

      <Footer />
    </>
  );
}

export default Hotels;