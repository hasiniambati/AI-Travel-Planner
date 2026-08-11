import "./DestinationCard.css";

function DestinationCard({ place }) {

  return (

    <div className="destination-card">

      <img
        src={place.image}
        alt={place.name}
      />

      <div className="destination-content">

        <span>{place.category}</span>

        <h3>{place.name}</h3>

        <p>{place.country}</p>

        <button>

          View Details

        </button>

      </div>

    </div>

  );

}

export default DestinationCard;