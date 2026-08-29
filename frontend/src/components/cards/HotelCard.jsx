import "./HotelCard.css";

function HotelCard({ hotel }) {

  return (

    <div className="hotel-card">

      <img
        src={hotel.image}
        alt={hotel.name}
        className="hotel-image"
      />

      <div className="hotel-info">

        <h3>{hotel.name}</h3>

        <p>{hotel.city}</p>

        <span className="rating">

          {hotel.rating}

        </span>

        <h4>{hotel.price}</h4>

        <button>

          Book Now

        </button>

      </div>

    </div>

  );

}

export default HotelCard;