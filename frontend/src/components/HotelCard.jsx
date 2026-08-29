import "./CardShared.css";

function HotelCard({ hotel }) {
  const { hotelName, address, pricePerNight, rating, description, geoCoordinates } = hotel;

  // Generate an external Google Maps search link based on geoCoordinates, falling back to name/address search if unavailable
  const mapLink = geoCoordinates && geoCoordinates.lat && geoCoordinates.lng
    ? `https://www.google.com/maps/search/?api=1&query=${geoCoordinates.lat},${geoCoordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotelName} ${address}`)}`;

  return (
    <div className="travel-card">
      <div className="travel-card-badge-row">
        <span className="travel-card-badge rating-badge">⭐ {rating || "N/A"}</span>
        <span className="travel-card-badge price-badge">{pricePerNight}</span>
      </div>
      <div className="travel-card-body">
        <h3 className="travel-card-title">{hotelName}</h3>
        <p className="travel-card-address">
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
            title="View on Map"
          >
            📍 {address}
          </a>
        </p>
        <p className="travel-card-description">{description}</p>
      </div>
    </div>
  );
}

export default HotelCard;
