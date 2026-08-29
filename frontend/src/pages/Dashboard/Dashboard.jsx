import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../context/AuthContext.jsx";
import { getMyBookings, getSavedTrips, deleteSavedTrip, deleteBooking } from "../../services/api.js";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);

  const loadDashboardData = () => {
    getMyBookings()
      .then((d) => setBookings(d.bookings || []))
      .catch(() => {});
    getSavedTrips()
      .then((d) => setTrips(d.trips || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeleteTrip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this saved trip?")) return;
    try {
      await deleteSavedTrip(id);
      setTrips((prev) => prev.filter((t) => t._id !== id));
      alert("Trip deleted successfully.");
    } catch (err) {
      alert(err.message || "Failed to delete trip.");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel and delete this booking?")) return;
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      alert("Booking deleted successfully.");
    } catch (err) {
      alert(err.message || "Failed to delete booking.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Welcome, {user?.name || "Traveler"}! 👋</h1>
            <p>Your trips, hotel bookings and travel tools in one place.</p>
          </div>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>✈️ Plan a Trip</h3>
              <p>Generate a destination-verified AI itinerary.</p>
              <Link to="/planner">Start Planning</Link>
            </div>
            <div className="dashboard-card">
              <h3>🏨 Hotels</h3>
              <p>Search hotels by destination, view maps and book.</p>
              <Link to="/hotels">Explore Hotels</Link>
            </div>
            <div className="dashboard-card">
              <h3>🌍 Places</h3>
              <p>Search real mapped attractions.</p>
              <Link to="/places">Explore Places</Link>
            </div>
            <div className="dashboard-card">
              <h3>👤 Profile</h3>
              <p>Manage your account.</p>
              <Link to="/profile">View Profile</Link>
            </div>
          </div>

          <section className="dashboard-lists">
            <div className="dashboard-list">
              <h2>💾 Saved Trips</h2>
              {trips.length ? (
                <ul style={{ padding: 0 }}>
                  {trips.map((t) => (
                    <li
                      key={t._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        borderBottom: "1px solid #f1f5f9",
                        gap: "10px"
                      }}
                    >
                      <div>
                        <strong style={{ display: "block", fontSize: "1rem", color: "#1e293b" }}>{t.destination}</strong>
                        <span style={{ fontSize: "0.85rem", color: "#64748b", display: "block", marginTop: "2px" }}>
                          📅 {t.startDate} → {t.endDate}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteTrip(t._id)}
                        style={{
                          background: "#fef3f2",
                          color: "#b42318",
                          border: "1.5px solid #fda29b",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "background 0.2s"
                        }}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No saved trips yet.</p>
              )}
            </div>

            <div className="dashboard-list">
              <h2>🏨 My Bookings</h2>
              {bookings.length ? (
                <ul style={{ padding: 0 }}>
                  {bookings.map((b) => (
                    <li
                      key={b._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        borderBottom: "1px solid #f1f5f9",
                        gap: "10px"
                      }}
                    >
                      <div>
                        <strong style={{ display: "block", fontSize: "1rem", color: "#1e293b" }}>{b.hotelName}</strong>
                        <span style={{ fontSize: "0.85rem", color: "#64748b", display: "block", marginTop: "2px" }}>
                          📅 {b.checkIn?.slice(0, 10)} → {b.checkOut?.slice(0, 10)} · <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>{b.status}</span>
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteBooking(b._id)}
                        style={{
                          background: "#fef3f2",
                          color: "#b42318",
                          border: "1.5px solid #fda29b",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "background 0.2s"
                        }}
                      >
                        Cancel & Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bookings yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
