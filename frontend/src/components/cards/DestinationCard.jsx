import { useState } from "react";
import "./DestinationCard.css";

function DestinationCard({ place }) {
  const [showDetails, setShowDetails] = useState(false);

  const descriptions = {
    Paris:
      "Explore the iconic Eiffel Tower, Louvre Museum, charming streets, cafes and the rich culture of Paris.",

    Bali:
      "Enjoy beautiful beaches, temples, tropical landscapes and the unique culture of Bali.",

    Dubai:
      "Experience modern architecture, luxury shopping, desert adventures and world-famous attractions.",

    Goa:
      "Relax on beautiful beaches, enjoy water activities, explore Portuguese heritage and taste local cuisine.",

    "Swiss Alps":
      "Discover breathtaking mountain landscapes, scenic villages, hiking trails and unforgettable views.",

    "Taj Mahal":
      "Visit the magnificent Taj Mahal and explore the history, architecture and culture of Agra.",
  };

  return (
    <>
      <div className="destination-card">

        <img
          src={place.image}
          alt={place.name}
        />

        <div className="destination-content">

          <span>{place.category}</span>

          <h3>{place.name}</h3>

          <p>{place.country}</p>

          <button
            onClick={() => setShowDetails(true)}
          >
            View Details
          </button>

        </div>

      </div>

      {showDetails && (

        <div
          className="destination-modal-overlay"
          onClick={() => setShowDetails(false)}
        >

          <div
            className="destination-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="destination-close"
              onClick={() => setShowDetails(false)}
            >
              ✕
            </button>

            <img
              src={place.image}
              alt={place.name}
            />

            <h2>{place.name}</h2>

            <p className="modal-country">
              📍 {place.country}
            </p>

            <p className="modal-category">
              {place.category}
            </p>

            <p className="modal-description">
              {descriptions[place.name] ||
                `Explore the beautiful destination of ${place.name}.`}
            </p>

            <button
              className="plan-destination-btn"
              onClick={() => {
                setShowDetails(false);
                window.location.href = "/AI-Travel-Planner/planner";
              }}
            >
              ✈ Plan a Trip Here
            </button>

          </div>

        </div>

      )}
    </>
  );
}

export default DestinationCard;