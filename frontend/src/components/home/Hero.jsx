import { Link } from "react-router-dom";
import heroImage from "../../assets/images/hero-image.jpg";
import "./Hero.css";

function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1>
          AI Powered Travel
          <br />
          Planner
        </h1>

        <p>
          Plan smarter, travel better with personalized itineraries,
          hotel recommendations, weather updates, and your own AI travel assistant.
        </p>

        <Link to="/planner" className="hero-btn">
          Start Planning
        </Link>
      </div>
    </section>
  );
}

export default Hero;