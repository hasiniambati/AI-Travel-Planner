import "./CardShared.css";

function PlaceCard({ activity }) {
  const { placeName, placeDetails, ticketPricing, travelTimeFromPrevious, bestTimeToVisit, timeOfDay } = activity;

  // Generate an external Google Maps search link for the place name
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;

  return (
    <div className="travel-card">
      <div className="travel-card-badge-row">
        <span className="travel-card-badge time-badge">⏰ {timeOfDay} ({bestTimeToVisit})</span>
        <span className="travel-card-badge price-badge">{ticketPricing}</span>
      </div>
      <div className="travel-card-body">
        <h3 className="travel-card-title">{placeName}</h3>
        {travelTimeFromPrevious && travelTimeFromPrevious.toLowerCase() !== "none" && (
          <div className="travel-card-transit">
            🚗 {travelTimeFromPrevious}
          </div>
        )}
        <p className="travel-card-description">{placeDetails}</p>
        <p className="travel-card-address" style={{ marginTop: "auto" }}>
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
            title="View on Map"
          >
            📍 View on Map
          </a>
        </p>
      </div>
    </div>
  );
}

export default PlaceCard;
