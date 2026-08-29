import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./About.css";

function About() {
  return (
    <>
      <Navbar />

      <section className="about-page">
        <div className="about-container">

          <h1>About AI Travel Planner</h1>

          <p>
            Planning a trip should feel exciting, not confusing. AI Travel
            Planner helps you discover destinations, hotels, and personalized
            travel plans in one simple place.
          </p>

          <div className="about-grid">

            <div className="about-card">
              <h2>✈️ Personalized Travel</h2>
              <p>
                Create travel plans based on your destination, budget,
                travel dates, interests, and travel style.
              </p>
            </div>

            <div className="about-card">
              <h2>🏨 Find Hotels</h2>
              <p>
                Explore hotels and stays that match your destination
                and travel preferences.
              </p>
            </div>

            <div className="about-card">
              <h2>🗺️ Discover Places</h2>
              <p>
                Explore popular tourist destinations and interesting
                places for your next journey.
              </p>
            </div>

            <div className="about-card">
              <h2>🤖 AI Assistant</h2>
              <p>
                Get helpful travel suggestions while planning your
                next trip.
              </p>
            </div>

          </div>

          <div className="about-action">
            <h2>Ready to plan your next adventure?</h2>

            <Link to="/planner">
              <button className="about-btn">
                ✈ Plan Your Trip
              </button>
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;