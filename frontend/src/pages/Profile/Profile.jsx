import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getProfile, updateProfile } from "../../services/api.js";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "./Profile.css";

function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profileImage: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();

      setProfile(data.user);

      setFormData({
        name: data.user.name || "",
        phone: data.user.phone || "",
        profileImage: data.user.profileImage || ""
      });

    } catch (error) {
      setError(error.message);
    }
  };

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

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Navbar />

      <main className="profile-page">

        <div className="profile-container">

          <div className="profile-header">

            <div className="profile-avatar">
              {profile?.name
                ? profile.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <h1>My Profile</h1>

            <p>
              Manage your personal information.
            </p>

          </div>

          {message && (
            <p className="profile-success">
              {message}
            </p>
          )}

          {error && (
            <p className="profile-error">
              {error}
            </p>
          )}

          {!editing ? (

            <>
              <div className="profile-card">

                <h2>Personal Information</h2>

                <div className="profile-info">

                  <div>
                    <span>Name</span>
                    <strong>
                      {profile?.name || user?.name}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>
                      {profile?.email || user?.email}
                    </strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>
                      {profile?.phone || "Not added"}
                    </strong>
                  </div>

                </div>

              </div>

              <div className="profile-card">

                <h2>Travel Profile</h2>

                <div className="preference-grid">

                  <div>
                    <span>Account</span>
                    <strong>Active</strong>
                  </div>

                  <div>
                    <span>Travel Planner</span>
                    <strong>Available</strong>
                  </div>

                  <div>
                    <span>Hotels</span>
                    <strong>Available</strong>
                  </div>

                  <div>
                    <span>Destinations</span>
                    <strong>Available</strong>
                  </div>

                </div>

              </div>

              <button
                className="edit-profile-btn"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            </>

          ) : (

            <div className="profile-card">

              <h2>Edit Profile</h2>

              <form onSubmit={handleUpdate}>

                <label>
                  Name

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Email

                  <input
                    type="email"
                    value={profile?.email || user?.email || ""}
                    disabled
                  />
                </label>

                <label>
                  Phone

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </label>

                <div className="profile-edit-buttons">

                  <button
                    type="submit"
                    className="edit-profile-btn"
                  >
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

      </main>

      <Footer />
    </>
  );
}

export default Profile;