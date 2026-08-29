import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import MapView from "../../components/MapView";
import { getPlaces } from "../../services/api.js";
import "./TouristPlaces.css";

export default function TouristPlaces() {
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [places, setPlaces] = useState([]);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const [tripInfo, setTripInfo] = useState(null);
  const [viewTab, setViewTab] = useState("all"); // 'planned' or 'all'

  // Curated default recommendations matching the mockup image with exact coordinates
  const defaultDestinations = [
    {
      name: "Paris",
      location: "France",
      category: "City",
      latitude: 48.8566,
      longitude: 2.3522,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&auto=format&fit=crop&q=60",
      description: "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture."
    },
    {
      name: "Bali",
      location: "Indonesia",
      category: "Beach",
      latitude: -8.4095,
      longitude: 115.1889,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=60",
      description: "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs."
    },
    {
      name: "Dubai",
      location: "UAE",
      category: "City",
      latitude: 25.2048,
      longitude: 55.2708,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&auto=format&fit=crop&q=60",
      description: "Dubai is a city and emirate in the United Arab Emirates luxury shopping, ultramodern architecture and a lively nightlife scene."
    },
    {
      name: "Goa",
      location: "India",
      category: "Beach",
      latitude: 15.2993,
      longitude: 74.1240,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60",
      description: "Goa is a state in western India with coastlines stretching along the Arabian Sea. Its long history as a Portuguese colony is evident in its preserved 17th-century churches."
    }
  ];

  // Checks if a trip was generated in localStorage
  const loadTripPlaces = () => {
    const storedTrip = localStorage.getItem("userTrip") || localStorage.getItem("current_trip");
    if (storedTrip) {
      try {
        const parsed = JSON.parse(storedTrip);
        if (parsed?.result?.itinerary && parsed.result.itinerary.length > 0) {
          setTripInfo(parsed);
          setViewTab("planned"); // Default to viewing planned sights if a trip exists
          
          const placesList = [];
          parsed.result.itinerary.forEach((dayPlan) => {
            if (dayPlan.plan) {
              dayPlan.plan.forEach((item) => {
                const categoryName = item.timeOfDay || "Sight";
                placesList.push({
                  ...item,
                  name: item.placeName || item.name,
                  location: parsed.result.tripSummary.destination,
                  category: categoryName,
                  image: getPlacePlaceholderImage(item.placeName || item.name, categoryName),
                  description: item.placeDetails || item.description || "Planned attraction."
                });
              });
            }
          });
          
          setPlaces(placesList);
          setLoading(false);
          return true;
        }
      } catch (err) {
        console.error("Error parsing userTrip for places:", err);
      }
    }
    return false;
  };

  const searchPlacesFromAPI = async (queryStr) => {
    setLoading(true);
    setError("");
    try {
      const d = await getPlaces(queryStr);
      setPlaces(d.places || []);
      setDestination(d.searchedLocation || null);
    } catch (e) {
      setError(e.message);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasTrip = loadTripPlaces();
    if (!hasTrip) {
      setViewTab("all");
      setPlaces(defaultDestinations);
      setDestination(null);
    }
  }, []);

  useEffect(() => {
    if (viewTab === "all") {
      if (!searchInput.trim()) {
        setPlaces(defaultDestinations);
        setDestination(null);
        setLoading(false);
      }
    } else if (viewTab === "planned" && tripInfo) {
      const placesList = [];
      tripInfo.result.itinerary.forEach((dayPlan) => {
        if (dayPlan.plan) {
          dayPlan.plan.forEach((item) => {
            const categoryName = item.timeOfDay || "Sight";
            placesList.push({
              ...item,
              name: item.placeName || item.name,
              location: tripInfo.result.tripSummary.destination,
              category: categoryName,
              image: getPlacePlaceholderImage(item.placeName || item.name, categoryName),
              description: item.placeDetails || item.description || "Planned attraction."
            });
          });
        }
      });
      setPlaces(placesList);
      setLoading(false);
    }
  }, [viewTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchPlacesFromAPI(searchInput.trim());
    } else {
      setPlaces(defaultDestinations);
      setDestination(null);
    }
  };


  // Dynamic geocoding in details modal on click to pinpoint exact locations
  const handleViewDetails = async (place) => {
    setSelected(place);
    if (!place.latitude || !place.longitude) {
      try {
        const query = `${place.name}, ${place.location}`;
        const response = await fetch(`https://photon.komoot.io/api?q=${encodeURIComponent(query)}&limit=1`);
        if (response.ok) {
          const data = await response.json();
          const feature = data.features?.[0];
          if (feature) {
            const coords = feature.geometry.coordinates;
            setSelected((prev) => {
              if (prev && (prev.name === place.name || prev.placeName === place.name)) {
                return { ...prev, latitude: coords[1], longitude: coords[0] };
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.error("Failed to dynamically geocode place details:", err);
      }
    }
  };

  // Filter places based on selected category pill
  const filteredPlaces = places.filter((p) => {
    if (activeCategory === "All" || viewTab === "planned") return true;
    const cat = String(p.category || "").toLowerCase();
    const filter = activeCategory.toLowerCase();
    
    // Custom mapping helper
    if (filter === "mountain" && (cat.includes("mountain") || cat.includes("nature") || cat.includes("valley") || cat.includes("hill"))) return true;
    if (filter === "beach" && (cat.includes("beach") || cat.includes("sea") || cat.includes("coast") || cat.includes("lake"))) return true;
    if (filter === "city" && (cat.includes("city") || cat.includes("historic") || cat.includes("sight") || cat.includes("museum"))) return true;
    if (filter === "adventure" && (cat.includes("adventure") || cat.includes("wildlife") || cat.includes("climb"))) return true;
    
    return cat.includes(filter);
  });

  return (
    <>
      <Navbar />
      <main className="places-real">
        {/* Dynamic Centered Header with Segmented Control */}
        <div className="places-header">
          <h1>Explore Amazing Destinations</h1>
          <p>Find beautiful places around the world for your next vacation.</p>

          {/* Segmented Control Selector */}
          {tripInfo && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <div style={{ background: "#f1f5f9", padding: "5px", borderRadius: "12px", display: "inline-flex", gap: "5px", border: "1px solid #cbd5e1" }}>
                <button
                  type="button"
                  onClick={() => setViewTab("planned")}
                  style={{
                    background: viewTab === "planned" ? "#2563eb" : "transparent",
                    color: viewTab === "planned" ? "white" : "#475569",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  📍 Sightseeing in My Planned Trip
                </button>
                <button
                  type="button"
                  onClick={() => setViewTab("all")}
                  style={{
                    background: viewTab === "all" ? "#2563eb" : "transparent",
                    color: viewTab === "all" ? "white" : "#475569",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  🔍 Search All Attractions
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search controls only shown in 'all' view */}
        {viewTab === "all" && (
          <>
            <form onSubmit={handleSearchSubmit} className="search-box-container" style={{ display: "flex", alignItems: "center", background: "white", paddingRight: "10px" }}>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search destination..."
                style={{ flex: 1, border: "none" }}
              />
              <button
                type="submit"
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "13.5px"
                }}
              >
                Search
              </button>
            </form>

            <div className="filter-pills-row">
              {["All", "Beach", "Mountain", "City", "Adventure"].map((category) => (
                <button
                  key={category}
                  className={`filter-pill ${activeCategory === category ? "active" : ""}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </>
        )}

        {destination && viewTab === "all" && (
          <div className="destination-bar" style={{ maxWidth: "1200px", margin: "0 auto 30px auto" }}>
            <div>
              <strong>{destination.name}</strong>
              <span>{destination.displayName}</span>
            </div>
            <MapView
              latitude={destination.latitude}
              longitude={destination.longitude}
              name={destination.name}
              height={190}
            />
          </div>
        )}

        {loading ? (
          <div className="state">Finding real mapped places...</div>
        ) : error ? (
          <div className="state error">{error}</div>
        ) : !filteredPlaces.length ? (
          <div className="state">No places found matching the selected filters.</div>
        ) : (
          <div className="place-grid-4">
            {filteredPlaces.map((p, index) => {
              const name = p.name || p.placeName;
              const location = p.location || p.country;
              const category = p.category || "City";
              const image = p.image || "";

              return (
                <article className="place-card-mock" key={index}>
                    <div className="place-image-placeholder" style={{
                      height: "200px",
                      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "20px",
                      textAlign: "center",
                      boxSizing: "border-box",
                      position: "relative",
                      borderBottom: "1px solid #cbd5e1"
                    }}>
                      <span style={{
                        fontSize: "1.2rem",
                        fontWeight: "700",
                        color: "#166534",
                        lineHeight: "1.3"
                      }}>
                        📍 {name}
                      </span>
                      <span className="category-pill">{category}</span>
                    </div>
                  <div className="place-body">
                    <h2>{name}</h2>
                    <p className="country">{location}</p>
                    <button
                      className="btn-view-details"
                      onClick={() => handleViewDetails(p)}
                    >
                      View Details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <h2>{selected.name || selected.placeName}</h2>
            <p style={{ color: "#64748b", marginBottom: "15px" }}>📍 {selected.location || selected.country}</p>
            <MapView
              latitude={selected.latitude || 48.8584}
              longitude={selected.longitude || 2.2945}
              name={selected.name || selected.placeName}
            />
            <p style={{ marginTop: "15px", lineHeight: "1.6", color: "#334155" }}>
              {selected.description || "Explore beautiful attractions and historical landmarks at this travel destination."}
            </p>
            {selected.ticketPricing && (
              <div style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
                🎫 <strong>Ticket cost:</strong> {selected.ticketPricing}
              </div>
            )}
            <div style={{ marginTop: "20px" }}>
              <a
                className="btn-primary"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selected.name || selected.placeName} ${selected.location || selected.country}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", display: "inline-block" }}
              >
                🗺️ View Directions
              </a>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
