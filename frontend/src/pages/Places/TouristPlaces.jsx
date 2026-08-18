import { useState } from "react";

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
    },
  ];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Beach",
    "Mountain",
    "City",
    "Historical",
  ];

  const filteredDestinations = destinations.filter((place) => {

    const matchesSearch =
      place.name.toLowerCase().includes(search.toLowerCase()) ||
      place.country.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      place.category === category;

    return matchesSearch && matchesCategory;
  });

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="category-buttons">

          {categories.map((item) => (

            <button
              key={item}
              className={
                category === item
                  ? "active-category"
                  : ""
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>

          ))}

        </div>

        <div className="places-result-info">

          <p>
            Showing {filteredDestinations.length} destination
            {filteredDestinations.length !== 1 ? "s" : ""}
          </p>

        </div>

        {filteredDestinations.length > 0 ? (

          <div className="places-grid">

            {filteredDestinations.map((place) => (

              <DestinationCard
                key={place.name}
                place={place}
              />

            ))}

          </div>

        ) : (

          <div className="no-places">

            <h2>No destinations found</h2>

            <p>
              Try searching for Paris, Bali, Dubai, Goa,
              Swiss Alps or Taj Mahal.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Show All Destinations
            </button>

          </div>

        )}

      </section>

      <Footer />
    </>
  );
}

export default TouristPlaces;