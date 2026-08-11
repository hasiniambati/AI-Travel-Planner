import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./Profile.css";

function Profile() {
  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="profile-container">

          <div className="profile-header">
            <div className="profile-avatar">
              H
            </div>

            <h1>My Profile</h1>
            <p>Manage your travel profile and preferences.</p>
          </div>

          <div className="profile-card">

            <h2>Personal Information</h2>

            <div className="profile-info">
              <div>
                <span>Name</span>
                <strong>Priya</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>priya@gmail.com</strong>
              </div>
            </div>

          </div>

          <div className="profile-card">

            <h2>Travel Preferences</h2>

            <div className="preference-grid">

              <div>
                <span>Travel Style</span>
                <strong>Adventure</strong>
              </div>

              <div>
                <span>Favorite Destination</span>
                <strong>Paris, France</strong>
              </div>

              <div>
                <span>Budget</span>
                <strong>Medium</strong>
              </div>

              <div>
                <span>Interests</span>
                <strong>Nature, Food, Culture</strong>
              </div>

            </div>

          </div>

          <button className="edit-profile-btn">
            Edit Profile
          </button>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Profile;
