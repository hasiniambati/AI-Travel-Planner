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


  // ------------------------------------------
  // HOTEL DATA
  // ------------------------------------------

  const [hotels, setHotels] = useState([]);

  const [search, setSearch] = useState("");

  const [activeSearch, setActiveSearch] = useState("");

  const [sort, setSort] = useState("");


  // ------------------------------------------
  // UI
  // ------------------------------------------

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ------------------------------------------
  // MODALS
  // ------------------------------------------

  const [selectedHotel, setSelectedHotel] =
    useState(null);

  const [bookingHotel, setBookingHotel] =
    useState(null);


  // ------------------------------------------
  // BOOKING
  // ------------------------------------------

  const [checkIn, setCheckIn] =
    useState("");

  const [checkOut, setCheckOut] =
    useState("");

  const [guests, setGuests] =
    useState(1);

  const [bookingLoading, setBookingLoading] =
    useState(false);


  // ------------------------------------------
  // GET IMAGE
  // ------------------------------------------

  const getHotelImage = (hotel) => {

    if (!hotel?.image) {
      return null;
    }


    const fileName =
      hotel.image
        .split("/")
        .pop();


    return hotelImages[fileName] || null;
  };


  // ------------------------------------------
  // LOAD HOTELS
  // ------------------------------------------

  const loadHotels = async (
    searchValue = "",
    sortValue = ""
  ) => {

    try {

      setLoading(true);

      setError("");


      const data =
        await getHotels(
          searchValue,
          sortValue
        );


      setHotels(
        Array.isArray(data.hotels)
          ? data.hotels
          : []
      );


    } catch (err) {

      console.error(
        "Hotel error:",
        err
      );

      setHotels([]);

      setError(
        err.message ||
        "Failed to load hotels"
      );


    } finally {

      setLoading(false);

    }

  };


  // ------------------------------------------
  // INITIAL LOAD
  // ------------------------------------------

  useEffect(() => {

    loadHotels();

  }, []);


  // ------------------------------------------
  // SEARCH
  // ------------------------------------------

  const handleSearch = async (e) => {

    e.preventDefault();


    const value =
      search.trim();


    setActiveSearch(value);


    await loadHotels(
      value,
      sort
    );

  };


  // ------------------------------------------
  // CLEAR SEARCH
  // ------------------------------------------

  const handleClear = async () => {

    setSearch("");

    setActiveSearch("");


    await loadHotels(
      "",
      sort
    );

  };


  // ------------------------------------------
  // SORT
  // ------------------------------------------

  const handleSort = async (e) => {

    const value =
      e.target.value;


    setSort(value);


    await loadHotels(
      activeSearch,
      value
    );

  };


  // ------------------------------------------
  // BOOK HOTEL
  // ------------------------------------------

  const handleBook = async () => {

    if (!user) {

      setBookingHotel(null);

      alert(
        "Please login before booking a hotel."
      );

      navigate("/login");

      return;
    }


    if (!checkIn || !checkOut) {

      alert(
        "Please select check-in and check-out dates."
      );

      return;
    }


    if (
      new Date(checkOut) <=
      new Date(checkIn)
    ) {

      alert(
        "Check-out date must be after check-in date."
      );

      return;
    }


    try {

      setBookingLoading(true);


      const data =
        await createBooking({
          hotelId:
            bookingHotel._id,

          checkIn,

          checkOut,

          guests:
            Number(guests)
        });


      alert(
        `Booking confirmed!\n\n${
          data.booking.hotelName
        }\nTotal: ₹${
          Number(
            data.booking.totalPrice
          ).toLocaleString("en-IN")
        }`
      );


      setBookingHotel(null);

      setCheckIn("");

      setCheckOut("");

      setGuests(1);


    } catch (err) {

      alert(
        err.message ||
        "Booking failed"
      );


    } finally {

      setBookingLoading(false);

    }

  };


  // ------------------------------------------
  // PAGE
  // ------------------------------------------

  return (
    <>
      <Navbar />


      <main className="hotels-page">


        {/* HEADER */}

        <section className="hotels-header">

          <h1>
            Find Your Perfect Hotel
          </h1>


          <p>
            Discover comfortable stays
            for your next journey.
          </p>


          <form
            className="hotel-search"
            onSubmit={handleSearch}
          >

            <input
              type="text"
              value={search}
              placeholder="Search by hotel name or location..."
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />


            <button type="submit">
              Search
            </button>

          </form>

        </section>


        {/* HOTEL SECTION */}

        <section className="hotel-section">


          {/* TOP */}

          <div className="section-top">

            <div>

              <h2>

                {activeSearch
                  ? `Hotels for "${activeSearch}"`
                  : "Popular Hotels"}

              </h2>


              <p>

                {loading
                  ? "Finding hotels..."
                  : `${hotels.length} hotel${
                      hotels.length !== 1
                        ? "s"
                        : ""
                    } found`}

              </p>

            </div>


            <select
              value={sort}
              onChange={handleSort}
            >

              <option value="">
                Sort By
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating">
                Rating
              </option>

            </select>

          </div>


          {/* ERROR */}

          {error && (

            <div className="no-hotels">

              <h3>
                Unable to load hotels
              </h3>

              <p>
                {error}
              </p>

              <button
                onClick={() =>
                  loadHotels(
                    activeSearch,
                    sort
                  )
                }
              >
                Try Again
              </button>

            </div>

          )}


          {/* LOADING */}

          {loading && !error && (

            <div className="no-hotels">

              <h3>
                Loading hotels...
              </h3>

            </div>

          )}


          {/* NO RESULTS */}

          {!loading &&
            !error &&
            hotels.length === 0 && (

              <div className="no-hotels">

                <h3>
                  No hotels found
                </h3>


                <p>
                  {activeSearch
                    ? `No hotels match "${activeSearch}".`
                    : "No hotels are available."}
                </p>


                {activeSearch && (

                  <button
                    onClick={handleClear}
                  >
                    Show All Hotels
                  </button>

                )}

              </div>

            )}


          {/* HOTEL CARDS */}

          {!loading &&
            !error &&
            hotels.length > 0 && (

              <div className="hotel-grid">

                {hotels.map((hotel) => {

                  const image =
                    getHotelImage(hotel);


                  return (

                    <article
                      className="hotel-card"
                      key={hotel._id}
                    >

                      {image && (

                        <img
                          src={image}
                          alt={hotel.name}
                        />

                      )}


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
                              ₹
                              {Number(
                                hotel.price
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>


                            <small>
                              / night
                            </small>

                          </div>

                        </div>


                        <div className="hotel-buttons">

                          <button
                            className="view-btn"
                            onClick={() =>
                              setSelectedHotel(
                                hotel
                              )
                            }
                          >
                            View
                          </button>


                          <button
                            className="book-btn"
                            onClick={() =>
                              setBookingHotel(
                                hotel
                              )
                            }
                          >
                            Book
                          </button>

                        </div>

                      </div>

                    </article>

                  );

                })}

              </div>

            )}

        </section>


{/* VIEW HOTEL MODAL */}

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

      {/* HOTEL IMAGE */}
      {hotelImages[
        selectedHotel.image?.split("/").pop()
      ] && (
        <img
          src={
            hotelImages[
              selectedHotel.image?.split("/").pop()
            ]
          }
          alt={selectedHotel.name}
        />
      )}

      {/* HOTEL DETAILS */}
      <h2>{selectedHotel.name}</h2>

      <p>
        📍 {selectedHotel.location}
      </p>

      <p>
        ⭐ {selectedHotel.rating}
      </p>

      <h3>
        ₹
        {Number(selectedHotel.price).toLocaleString("en-IN")}
        {" "}
        / night
      </h3>

      {/* DESCRIPTION */}
      {selectedHotel.description && (
        <p className="hotel-description">
          {selectedHotel.description}
        </p>
      )}

      {/* AMENITIES */}
      {selectedHotel.amenities?.length > 0 && (
        <>
          <h4>Amenities</h4>

          <ul>
            {selectedHotel.amenities.map((amenity, index) => (
              <li key={index}>
                {amenity}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* BOOK NOW */}
      <button
        className="modal-book-btn"
        onClick={() => {
          setSelectedHotel(null);
          setBookingHotel(selectedHotel);
        }}
      >
        🏨 Book Now
      </button>
    </div>
  </div>
)}


        {/* BOOKING MODAL */}

        {bookingHotel && (

          <div
            className="modal-overlay"
            onClick={() =>
              setBookingHotel(null)
            }
          >

            <div
              className="hotel-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                className="close-modal"
                onClick={() =>
                  setBookingHotel(null)
                }
              >
                ✕
              </button>


              <h2>
                Book {bookingHotel.name}
              </h2>


              <p>
                📍 {bookingHotel.location}
              </p>


              <label>
                Check-in

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) =>
                    setCheckIn(
                      e.target.value
                    )
                  }
                />

              </label>


              <label>
                Check-out

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) =>
                    setCheckOut(
                      e.target.value
                    )
                  }
                />

              </label>


              <label>
                Guests

                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) =>
                    setGuests(
                      e.target.value
                    )
                  }
                />

              </label>


              <button
                className="book-btn"
                onClick={handleBook}
                disabled={bookingLoading}
              >

                {bookingLoading
                  ? "Booking..."
                  : "Confirm Booking"}

              </button>

            </div>

          </div>

        )}

      </main>


      <Footer />

    </>
  );
}


export default Hotels;