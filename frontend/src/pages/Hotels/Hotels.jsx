import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./Hotels.css";

import hotel1 from "../../assets/hotels/hotel1.jpg";
import hotel2 from "../../assets/hotels/hotel2.jpg";
import hotel3 from "../../assets/hotels/hotel3.jpg";
import hotel4 from "../../assets/hotels/hotel4.jpg";
import hotel5 from "../../assets/hotels/hotel5.jpg";
import hotel6 from "../../assets/hotels/hotel6.jpg";

const hotels = [
  {
    name: "Taj Krishna",
    location: "Hyderabad, Telangana",
    city: "Hyderabad",
    rating: 4.6,
    price: 8500,
    image: hotel1,
    description:
      "A luxurious stay in Hyderabad with comfortable rooms, excellent dining and premium hospitality.",
  },
  {
    name: "ITC Grand Chola",
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    rating: 4.7,
    price: 12000,
    image: hotel2,
    description:
      "A premium luxury hotel in Chennai offering elegant rooms, restaurants and world-class facilities.",
  },
  {
    name: "The Leela Palace Bengaluru",
    location: "Bangalore, Karnataka",
    city: "Bangalore",
    rating: 4.7,
    price: 14000,
    image: hotel3,
    description:
      "Experience luxury and comfort in the heart of Bangalore with premium rooms and excellent services.",
  },
  {
    name: "Taj Lake Palace",
    location: "Udaipur, Rajasthan",
    city: "Udaipur",
    rating: 4.8,
    price: 18000,
    image: hotel4,
    description:
      "A beautiful luxury property surrounded by the waters of Lake Pichola in Udaipur.",
  },
  {
    name: "The Oberoi Rajvilas",
    location: "Jaipur, Rajasthan",
    city: "Jaipur",
    rating: 4.8,
    price: 20000,
    image: hotel5,
    description:
      "A luxurious resort in Jaipur inspired by the rich heritage and architecture of Rajasthan.",
  },
  {
    name: "Taj Exotica Resort & Spa",
    location: "Goa, India",
    city: "Goa",
    rating: 4.7,
    price: 15000,
    image: hotel6,
    description:
      "A relaxing beach resort in Goa offering beautiful surroundings, comfortable rooms and premium facilities.",
  },
];

function Hotels() {
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("Recommended");

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingHotel, setBookingHotel] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchText.trim());
  };

  const handleSort = (e) => {
    setSort(e.target.value);
  };

  let filteredHotels = hotels.filter((hotel) =>
    `${hotel.name} ${hotel.location} ${hotel.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (sort === "Price Low to High") {
    filteredHotels.sort((a, b) => a.price - b.price);
  }

  if (sort === "Price High to Low") {
    filteredHotels.sort((a, b) => b.price - a.price);
  }

  if (sort === "Highest Rated") {
    filteredHotels.sort((a, b) => b.rating - a.rating);
  }

  const handleBook = (hotel) => {
    setBookingHotel(hotel);
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
              placeholder="Enter destination"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <button type="submit">
              Search
            </button>

          </form>

        </div>

        <section className="hotel-section">

          <div className="section-top">

            <div>

              <h2>
                {search
                  ? `Hotels in "${search}"`
                  : "Recommended Hotels"}
              </h2>

              <p>
                {filteredHotels.length} hotel
                {filteredHotels.length !== 1 ? "s" : ""} found
              </p>

            </div>

            <select
              value={sort}
              onChange={handleSort}
            >
              <option>Recommended</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
              <option>Highest Rated</option>
            </select>

          </div>

          {filteredHotels.length === 0 ? (

            <div className="no-hotels">

              <h2>No hotels found</h2>

              <p>
                Try searching for Goa, Hyderabad, Chennai,
                Bangalore, Udaipur or Jaipur.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSearchText("");
                }}
              >
                Show All Hotels
              </button>

            </div>

          ) : (

            <div className="hotel-grid">

              {filteredHotels.map((hotel) => (

                <div
                  className="hotel-card"
                  key={hotel.name}
                >

                  <img
                    src={hotel.image}
                    alt={hotel.name}
                  />

                  <div className="hotel-info">

                    <h3>{hotel.name}</h3>

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
                          {" "} / night
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
                          handleBook(hotel)
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

      {/* HOTEL DETAILS MODAL */}

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
              src={selectedHotel.image}
              alt={selectedHotel.name}
            />

            <h2>{selectedHotel.name}</h2>

            <p>
              📍 {selectedHotel.location}
            </p>

            <p>
              ⭐ {selectedHotel.rating} Rating
            </p>

            <h3>
              ₹{selectedHotel.price.toLocaleString("en-IN")}
              <small> / night</small>
            </h3>

            <p>
              {selectedHotel.description}
            </p>

            <button
              className="book-btn"
              onClick={() => {
                setSelectedHotel(null);
                setBookingHotel(selectedHotel);
              }}
            >
              Book This Hotel
            </button>

          </div>

        </div>

      )}

      {/* BOOKING MODAL */}

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

            <h2>🏨 Booking Request</h2>

            <p>
              You selected:
            </p>

            <h3>{bookingHotel.name}</h3>

            <p>
              📍 {bookingHotel.location}
            </p>

            {startDate && endDate ? (

              <p>
                📅 {startDate} → {endDate}
              </p>

            ) : (

              <p>
                Please select your travel dates before booking.
              </p>

            )}

            <p>
              💰 ₹{bookingHotel.price.toLocaleString("en-IN")}
              {" "} / night
            </p>

            <button
              className="book-btn"
              onClick={() => {
                alert(
                  `Booking request submitted for ${bookingHotel.name}!`
                );

                setBookingHotel(null);
              }}
            >
              Confirm Booking
            </button>

          </div>

        </div>

      )}

      <Footer />

    </>
  );
}

export default Hotels;