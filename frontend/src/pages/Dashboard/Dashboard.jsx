import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import { useAuth } from "../../context/AuthContext.jsx";

import "./Dashboard.css";

function Dashboard() {

  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <main className="dashboard-page">

        <div className="dashboard-container">

          <div className="dashboard-header">

            <h1>
              Welcome, {user?.name || "Traveler"}! 👋
            </h1>

            <p>
              Manage your travel plans and explore new destinations.
            </p>

          </div>

          <div className="dashboard-cards">

            <div className="dashboard-card">

              <h3>✈️ Plan a Trip</h3>

              <p>
                Create a personalized itinerary based on your
                destination, budget and interests.
              </p>

              <Link to="/planner">
                Start Planning
              </Link>

            </div>

            <div className="dashboard-card">

              <h3>🏨 Explore Hotels</h3>

              <p>
                Discover recommended hotels and find a stay
                that matches your budget.
              </p>

              <Link to="/hotels">
                Explore Hotels
              </Link>

            </div>

            <div className="dashboard-card">

              <h3>🌍 Explore Places</h3>

              <p>
                Discover beautiful destinations around the
                world for your next adventure.
              </p>

              <Link to="/places">
                Explore Places
              </Link>

            </div>

            <div className="dashboard-card">

              <h3>👤 My Profile</h3>

              <p>
                View and manage your personal travel profile.
              </p>

              <Link to="/profile">
                View Profile
              </Link>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Dashboard;