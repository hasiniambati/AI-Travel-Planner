import { useState } from "react";
import HotelCard from "./HotelCard";
import PlaceCard from "./PlaceCard";
import "./ItineraryView.css";

function ItineraryView({ tripPlan }) {
  const { tripSummary, hotelOptions = [], itinerary = [] } = tripPlan;
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  if (!tripSummary) {
    return <div className="state">No summary available for this trip.</div>;
  }

  const activeDayPlan = itinerary[activeDayIdx];

  return (
    <div className="itinerary-container">
      {/* Trip Summary Panel */}
      <div className="trip-summary-panel">
        <h2>✈️ Trip Overview</h2>
        <div className="trip-summary-grid">
          <div className="summary-item">
            <label>Origin</label>
            <span>{tripSummary.from || "Anywhere"}</span>
          </div>
          <div className="summary-item">
            <label>Destination</label>
            <span>{tripSummary.destination}</span>
          </div>
          <div className="summary-item">
            <label>Duration</label>
            <span>{tripSummary.durationDays} Days</span>
          </div>
          <div className="summary-item">
            <label>Budget Level</label>
            <span>{tripSummary.budget}</span>
          </div>
          <div className="summary-item">
            <label>Travelers</label>
            <span>{tripSummary.travelers}</span>
          </div>
          <div className="summary-item">
            <label>Best Time to Visit</label>
            <span>{tripSummary.bestTimeToVisit || "Varies"}</span>
          </div>
          <div className="summary-item" style={{ gridColumn: "span 2" }}>
            <label>Estimated Transit Cost</label>
            <span>{tripSummary.estimatedTravelCost || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Hotel Options Section */}
      {hotelOptions.length > 0 && (
        <div className="hotels-section">
          <h2>🏨 Recommended Accommodations</h2>
          <div className="hotels-grid">
            {hotelOptions.map((hotel, index) => (
              <HotelCard key={index} hotel={hotel} />
            ))}
          </div>
        </div>
      )}

      {/* Day Plan & Itinerary Timeline Section */}
      {itinerary.length > 0 && (
        <div className="itinerary-section">
          <h2>📅 Day-by-Day Plan</h2>

          {/* Day Tabs */}
          <div className="day-tabs">
            {itinerary.map((dayPlan, index) => (
              <button
                key={dayPlan.day}
                className={`day-tab-btn ${index === activeDayIdx ? "active" : ""}`}
                onClick={() => setActiveDayIdx(index)}
              >
                Day {dayPlan.day}
              </button>
            ))}
          </div>

          {/* Timeline Details */}
          {activeDayPlan && (
            <div className="day-details-panel">
              <div className="day-theme">🎯 Today's Theme: {activeDayPlan.theme}</div>
              <div className="timeline">
                {activeDayPlan.plan && activeDayPlan.plan.map((activity, idx) => (
                  <div className="timeline-item" key={idx}>
                    <div className="timeline-dot"></div>
                    <PlaceCard activity={activity} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ItineraryView;
