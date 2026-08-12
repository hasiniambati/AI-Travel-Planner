import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import DestinationCard from "../../components/cards/DestinationCard";
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
    rating: "4.6",
    price: "₹8,500",
    image: hotel1,
  },
  {
    name: "ITC Grand Chola",
    location: "Chennai, Tamil Nadu",
    rating: "4.7",
    price: "₹12,000",
    image: hotel2,
  },
  {
    name: "The Leela Palace Bengaluru",
    location: "Bangalore, Karnataka",
    rating: "4.7",
    price: "₹14,000",
    image: hotel3,
  },
  {
    name: "Taj Lake Palace",
    location: "Udaipur, Rajasthan",
    rating: "4.8",
    price: "₹18,000",
    image: hotel4,
  },
  {
    name: "The Oberoi Rajvilas",
    location: "Jaipur, Rajasthan",
    rating: "4.8",
    price: "₹20,000",
    image: hotel5,
  },
  {
    name: "Taj Exotica Resort & Spa",
    location: "Goa, India",
    rating: "4.7",
    price: "₹15,000",
    image: hotel6,
  },
];

function Hotels() {
  return (
    <>
    <Navbar />

    <div className="hotels-page">

      <div className="hotels-header">
        <h1>Find Your Perfect Stay</h1>

        <p>
          Discover hotels that match your travel plans and budget.
        </p>

        <div className="hotel-search">
          <input type="text" placeholder="Enter destination" />
          <input type="date" />
          <input type="date" />
          <button>Search</button>
        </div>
      </div>

      <section className="hotel-section">

        <div className="section-top">
          <div>
            <h2>Recommended Hotels</h2>
            <p>Popular stays for your next trip</p>
          </div>

          <select>
            <option>Recommended</option>
            <option>Price Low to High</option>
            <option>Price High to Low</option>
            <option>Highest Rated</option>
          </select>
        </div>

        <div className="hotel-grid">

          {hotels.map((hotel) => (
            <div className="hotel-card" key={hotel.name}>

              <img src={hotel.image} alt={hotel.name} />

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
                    <strong>{hotel.price}</strong>
                    <small> / night</small>
                  </div>

                </div>

                <button className="view-btn">
                  View Hotel
                </button>
                
                <button className="book-btn">
                  Book Now
                </button>

              </div>

            </div>
          ))}

        </div>

      </section>

    </div>

    <Footer />

    </>
  );
}

export default Hotels;