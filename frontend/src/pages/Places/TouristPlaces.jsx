import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import DestinationCard from "../../components/cards/DestinationCard";
import paris from "../../assets/places/paris.jpg";
import bali from "../../assets/places/bali.jpg";
import dubai from "../../assets/places/dubai.jpg";
import goa from "../../assets/places/goa.jpg";
import swissAlps from "../../assets/places/swiss-alps.jpg";
import tajMahal from "../../assets/places/taj-mahal.jpg";
import "./TouristPlaces.css";

function TouristPlaces() {

  const destinations = [
  {
    name: "Paris",
    country: "France",
    image: paris,
    category: "City",
  },
  {
    name: "Bali",
    country: "Indonesia",
    image: bali,
    category: "Beach",
  },
  {
    name: "Dubai",
    country: "UAE",
    image: dubai,
    category: "City",
  },
  {
    name: "Goa",
    country: "India",
    image: goa,
    category: "Beach",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    image: swissAlps,
    category: "Mountain",
  },
  {
    name: "Taj Mahal",
    country: "India",
    image: tajMahal,
    category: "Historical",
  }
];

  return (

    <>

      <Navbar />

      <section className="places-page">

        <div className="places-header">

          <h1>Explore Amazing Destinations</h1>

          <p>
            Find beautiful places around the world for your next vacation.
          </p>

          <input
            type="text"
            placeholder="Search destination..."
          />

        </div>

        <div className="category-buttons">

          <button>All</button>

          <button>Beach</button>

          <button>Mountain</button>

          <button>City</button>

          <button>Adventure</button>

        </div>

        <div className="places-grid">

          {

            destinations.map((place,index)=>

              <DestinationCard
                key={index}
                place={place}
              />

            )

          }

        </div>

      </section>

      <Footer />

    </>

  );

}

export default TouristPlaces;