import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "./Features.css";

const features = [
  {
    icon: "🤖",
    title: "AI Itinerary",
    desc: "Generate personalized travel plans within seconds."
  },
  {
    icon: "🏨",
    title: "Hotel Recommendations",
    desc: "Find the best hotels according to your budget."
  },
  {
    icon: "🌦",
    title: "Live Weather",
    desc: "Get accurate weather forecasts before you travel."
  },
  {
    icon: "💰",
    title: "Budget Planner",
    desc: "Estimate expenses and manage your trip budget."
  }
];

function Features() {
  return (
    <>
    <Navbar />
    <section className="features">

      <h2>Why Choose AI Travel Planner?</h2>

      <p>
        Smart AI tools that make every journey easier, faster, and more enjoyable.
      </p>

      <div className="feature-grid">

        {features.map((item) => (

          <div className="feature-card" key={item.title}>

            <div className="feature-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.desc}</p>

          </div>

        ))}

      </div>

    </section>
    
    <Footer />
   
    </>

  );
}

export default Features;