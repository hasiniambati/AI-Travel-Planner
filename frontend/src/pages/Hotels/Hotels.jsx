import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import MapView from "../../components/MapView";
import { getHotels, createBooking } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Hotels.css";

export default function Hotels() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tripInfo, setTripInfo] = useState(null);
  const [viewTab, setViewTab] = useState("all"); // 'planned' or 'all'

  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Checks if a trip was generated in localStorage
  const loadTripHotels = () => {
    const storedTrip = localStorage.getItem("userTrip") || localStorage.getItem("current_trip");
    if (storedTrip) {
      try {
        const parsed = JSON.parse(storedTrip);
        if (parsed?.result?.hotelOptions && parsed.result.hotelOptions.length > 0) {
          setTripInfo(parsed);
          setViewTab("planned"); // Default to viewing planned stays if a trip exists
          setHotels(parsed.result.hotelOptions);
          setLoading(false);
          return true;
        }
      } catch (err) {
        console.error("Error parsing userTrip for hotels:", err);
      }
    }
    return false;
  };

  const loadAllHotels = async (q = "", s = "") => {
    setLoading(true);
    setError("");
    try {
      const d = await getHotels(q, s);
      setHotels(d.hotels || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasTrip = loadTripHotels();
    if (!hasTrip) {
      setViewTab("all");
      loadAllHotels("", sort);
    }
  }, []);

  useEffect(() => {
    if (viewTab === "all") {
      loadAllHotels(search, sort);
    } else if (viewTab === "planned" && tripInfo) {
      setHotels(tripInfo.result.hotelOptions);
      setLoading(false);
    }
  }, [viewTab]);

  const searchNow = async (e) => {
    e.preventDefault();
    setViewTab("all");
    await loadAllHotels(search, sort);
  };

  const book = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!checkIn) {
      alert("Select check-in and check-out dates.");
      return;
    }
    try {
      setBookingLoading(true);
      const d = await createBooking({
        hotelId: booking._id || "generated-booking",
        hotelName: booking.hotelName || booking.name,
        checkIn,
        checkOut,
        guests: Number(guests)
      });
      alert(`Booking confirmed for ${d.booking.hotelName}.`);
      setBooking(null);
      navigate("/dashboard");
    } catch (e) {
      alert(e.message);
    } finally {
      setBookingLoading(false);
    }
  };

  // Open booking modal and automatically populate details from generated itinerary if available
  const handleOpenBooking = (h) => {
    setBooking(h);
    
    // Auto-populate dates and guests if trip context is active
    if (tripInfo?.tripData) {
      const plannedStart = tripInfo.tripData.startDate || "";
      const plannedEnd = tripInfo.tripData.endDate || "";
      const plannedGuests = Number(tripInfo.tripData.adults || 1) + Number(tripInfo.tripData.children || 0);

      setCheckIn(plannedStart);
      setCheckOut(plannedEnd);
      setGuests(plannedGuests);
    } else {
      setCheckIn(checkInDate);
      setCheckOut(checkOutDate);
      setGuests(1);
    }
  };



  const renderGoogleMapsLink = (h) => {
    const name = h.hotelName || h.name;
    const address = h.address || h.location;
    if (h.geoCoordinates && h.geoCoordinates.lat && h.geoCoordinates.lng) {
      return `https://www.google.com/maps/search/?api=1&query=${h.geoCoordinates.lat},${h.geoCoordinates.lng}`;
    }
    if (h.latitude && h.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${h.latitude},${h.longitude}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`;
  };

  return (
    <>
      <Navbar />
      <main className="real-page">
        {/* Banner with Segmented Switcher */}
        <header className="real-header-blue">
          <h1>Find Your Perfect Stay</h1>
          <p>Discover hotels that match your travel plans and budget.</p>
          
          {/* Custom Segmented Control Switcher */}
          {tripInfo && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "25px" }}>
              <div style={{ background: "rgba(255,255,255,0.15)", padding: "5px", borderRadius: "12px", display: "inline-flex", gap: "5px" }}>
                <button
                  type="button"
                  onClick={() => setViewTab("planned")}
                  style={{
                    background: viewTab === "planned" ? "white" : "transparent",
                    color: viewTab === "planned" ? "#103e8f" : "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  🏨 Stays in My Planned Trip
                </button>
                <button
                  type="button"
                  onClick={() => setViewTab("all")}
                  style={{
                    background: viewTab === "all" ? "white" : "transparent",
                    color: viewTab === "all" ? "#103e8f" : "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  🔍 Search All Hotels
                </button>
              </div>
            </div>
          )}

          {/* Search Inputs */}
          {(viewTab === "all" || !tripInfo) && (
            <form onSubmit={searchNow} className="search-row-box">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter destination"
                required
              />
              <input
                type="date"
                className="date-input"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                placeholder="dd-mm-yyyy"
              />
              <input
                type="date"
                className="date-input"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                placeholder="dd-mm-yyyy"
              />
              <button type="submit">Search</button>
            </form>
          )}
        </header>

        <div className="hotels-results-container">
          <div className="results-header-card">
            <div>
              {viewTab === "planned" && tripInfo ? (
                <>
                  <h2>Generated Stays for {tripInfo.result.tripSummary.destination}</h2>
                  <p>Persisted accommodations matching your {tripInfo.result.tripSummary.budget} preferences</p>
                </>
              ) : (
                <>
                  <h2>Recommended Hotels</h2>
                  <p>Popular stays for your next trip</p>
                </>
              )}
            </div>
            <div>
              {viewTab === "all" && (
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    loadAllHotels(search, e.target.value);
                  }}
                >
                  <option value="">Recommended</option>
                  <option value="rating">Top rated</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              )}
            </div>
          </div>

          {loading ? (
            <div className="state">Searching hotels...</div>
          ) : error ? (
            <div className="state error">{error}</div>
          ) : !hotels.length ? (
            <div className="state">No hotels found. Try searching for a destination.</div>
          ) : (
            <div className="hotel-grid">
              {hotels.map((h, index) => {
                const name = h.hotelName || h.name;
                const address = h.address || h.location || h.destination;
                const rating = h.rating ? Number(h.rating).toFixed(1) : "4.5";
                const imageSrc = h.image || "";
                const desc = h.description || "Comfortable stay with excellent dining and hospitality.";
                const numericPrice = h.price || 5000;
                const formattedPrice = h.pricePerNight 
                  ? h.pricePerNight 
                  : `₹${Number(numericPrice).toLocaleString("en-IN")}`;

                return (
                  <article className="hotel-card" key={index}>
                    <div className="hotel-image-placeholder" style={{
                      height: "220px",
                      background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "20px",
                      textAlign: "center",
                      boxSizing: "border-box",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      <span style={{
                        fontSize: "1.2rem",
                        fontWeight: "700",
                        color: "#4f46e5",
                        lineHeight: "1.3"
                      }}>
                        🏨 {name}
                      </span>
                    </div>
                    <div className="hotel-body">
                      <h2>{name}</h2>
                      <p className="muted">📍 {address}</p>
                      
                      <div className="hotel-rating-price-row">
                        <span className="hotel-rating-badge">⭐ {rating}</span>
                        <span className="hotel-price-tag">
                          <strong>{formattedPrice.split(" ")[0]}</strong> / night
                        </span>
                      </div>

                      <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: "1.5", marginBottom: "20px" }}>
                        {desc}
                      </p>

                      <div className="hotel-card-buttons">
                        <button
                          className="btn-secondary"
                          onClick={() => setSelected(h)}
                        >
                          View Hotel
                        </button>
                        <button
                          className="btn-primary"
                          onClick={() => handleOpenBooking(h)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Hotel Details Map Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <h2>{selected.hotelName || selected.name}</h2>
            <p style={{ color: "#64748b", marginBottom: "15px" }}>📍 {selected.address || selected.location}</p>
            <MapView
              latitude={selected.geoCoordinates?.lat || selected.latitude || 17.3850}
              longitude={selected.geoCoordinates?.lng || selected.longitude || 78.4867}
              name={selected.hotelName || selected.name}
            />
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <a
                className="btn-secondary"
                href={renderGoogleMapsLink(selected)}
                target="_blank"
                rel="noopener noreferrer"
              >
                🗺️ View Directions
              </a>
              {selected.website && (
                <a
                  className="btn-primary"
                  href={selected.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {booking && (
        <div className="modal-backdrop" onClick={() => setBooking(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setBooking(null)}>×</button>
            <h2>Book {booking.hotelName || booking.name}</h2>
            <p>Rate: {booking.pricePerNight || `₹${Number(booking.price || 0).toLocaleString("en-IN")} / night`}</p>
            <label>
              Check-in
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </label>
            <label>
              Check-out
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </label>
            <label>
              Guests
              <input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} />
            </label>
            <button disabled={bookingLoading} onClick={book} style={{ marginTop: "15px", width: "100%" }}>
              {bookingLoading ? "Confirming..." : "Confirm Booking"}
            </button>
            <p className="note" style={{ fontSize: "11px", color: "#64748b", marginTop: "10px", textAlign: "center" }}>
              Demo booking for your portfolio project. No real payment is processed.
            </p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
