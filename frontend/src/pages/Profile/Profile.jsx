import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getProfile, updateProfile, getSavedTrips, getMyBookings } from "../../services/api.js";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "./Profile.css";

function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profileImage: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data.user);

      setFormData({
        name: data.user.name || "",
        phone: data.user.phone || "",
        profileImage: data.user.profileImage || ""
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const loadStats = () => {
    getSavedTrips()
      .then((d) => setTrips(d.trips || []))
      .catch(() => {});
    getMyBookings()
      .then((d) => setBookings(d.bookings || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const data = await updateProfile(formData);
      setProfile(data.user);
      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="profile-container">
          {message && <div className="profile-success">{message}</div>}
          {error && <div className="profile-error">{error}</div>}

          <div className="profile-grid-container">
            {/* Left Sidebar - Profile Summary & Stats */}
            <div className="profile-sidebar">
              <div className="profile-card avatar-card">
                <div className="profile-avatar">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </div>
                <h2>{profile?.name || user?.name || "Traveler"}</h2>
                <p className="profile-email">{profile?.email || user?.email}</p>
                <span className="profile-status-badge">✈️ Global Nomad</span>

                <div className="profile-stats-row">
                  <div className="stat-box">
                    <span className="stat-num">{trips.length}</span>
                    <span className="stat-label">Trips</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-num">{bookings.length}</span>
                    <span className="stat-label">Bookings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Information & Edit Form */}
            <div className="profile-main-content">
              {!editing ? (
                <div className="profile-card">
                  <h2>Account Settings</h2>

                  <div className="profile-info-grid">
                    <div className="info-item">
                      <span>Full Name</span>
                      <strong>{profile?.name || user?.name}</strong>
                    </div>

                    <div className="info-item">
                      <span>Email Address</span>
                      <strong>{profile?.email || user?.email}</strong>
                    </div>

                    <div className="info-item">
                      <span>Phone Number</span>
                      <strong>{profile?.phone || "Not added yet"}</strong>
                    </div>

                    <div className="info-item">
                      <span>Travel Preferences</span>
                      <strong>Standard Mode</strong>
                    </div>
                  </div>

                  <button className="edit-profile-btn" onClick={() => setEditing(true)}>
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="profile-card">
                  <h2>Edit Personal Details</h2>

                  <form onSubmit={handleUpdate}>
                    <label>
                      Full Name
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </label>

                    <label>
                      Email Address
                      <input type="email" value={profile?.email || user?.email || ""} disabled />
                    </label>

                    <label>
                      Phone Number
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </label>

                    <div className="profile-edit-buttons">
                      <button type="submit" className="edit-profile-btn" style={{ margin: 0 }}>
                        Save Changes
                      </button>

                      <button
                        type="button"
                        className="cancel-profile-btn"
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Profile;