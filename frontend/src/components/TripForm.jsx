import { useState } from "react";
import { generateTripWithGemini, saveGeminiApiKey } from "../services/geminiService";
import "./TripForm.css";

function TripForm({ onTripGenerated }) {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    adults: 1,
    children: 0,
    infants: 0,
    travelMode: "Flight",
    interests: [],
    include: ["Shopping Locations", "Nearby Places"]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [showKeyConfig, setShowKeyConfig] = useState(!localStorage.getItem("gemini_api_key"));

  const handleApiKeyChange = (e) => {
    const val = e.target.value;
    setApiKey(val);
    saveGeminiApiKey(val);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdjustCounter = (field, amount) => {
    setFormData((prev) => {
      const nextVal = prev[field] + amount;
      const minVal = field === "adults" ? 1 : 0;
      if (nextVal >= minVal) {
        return { ...prev, [field]: nextVal };
      }
      return prev;
    });
  };

  const handleToggleInterest = (interest) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const handleToggleInclude = (item) => {
    setFormData((prev) => {
      const include = prev.include.includes(item)
        ? prev.include.filter((i) => i !== item)
        : [...prev.include, item];
      return { ...prev, include };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.destination.trim()) {
      setError("Destination location is required.");
      return;
    }
    if (!formData.startDate) {
      setError("Start date is required.");
      return;
    }
    if (!formData.endDate) {
      setError("End date is required.");
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) {
      setError("End date cannot be before start date.");
      return;
    }

    const durationDays = Math.max(1, Math.round((end - start) / 86400000) + 1);
    if (durationDays > 10) {
      setError("Trip duration cannot exceed 10 days.");
      return;
    }

    if (!formData.budget || Number(formData.budget) <= 0) {
      setError("Please enter a valid total budget.");
      return;
    }

    setLoading(true);

    try {
      const generatedTrip = await generateTripWithGemini(formData);
      onTripGenerated(formData, generatedTrip);
    } catch (err) {
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  const interestsList = [
    "Beach",
    "Mountains",
    "Nature",
    "Food",
    "Shopping",
    "Wildlife",
    "Culture",
    "Historical Places",
    "Nightlife",
    "Adventure"
  ];

  const recommendationsList = [
    "Shopping Locations",
    "Nearby Places",
    "Hotel Stay",
    "Food Recommendations",
    "Local Transport",
    "Packing Tips"
  ];

  return (
    <div className="planner-shell">
      <div className="planner-intro">
        <span>🤖 AI Trip Planner</span>
        <h1>Tell us what you want. We build the trip.</h1>
        <p>Instant, smart itinerary generation powered by Gemini API.</p>
      </div>

      <form onSubmit={handleSubmit} className="planner-form">
        {error && (
          <div className="state error" style={{ margin: "0 0 15px 0", color: "#b42318", background: "#fef3f2", border: "1px solid #fda29b", borderRadius: "10px", padding: "12px" }}>
            ⚠️ {error}
          </div>
        )}

        <div className="trip-form-key-section">
          <h4 style={{ margin: "0 0 8px 0", fontSize: "0.95rem", color: "#334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600 }}>🔑 Gemini API Key Settings</span>
            <button
              type="button"
              style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline" }}
              onClick={() => setShowKeyConfig(!showKeyConfig)}
            >
              {showKeyConfig ? "Hide Config" : "Show Config"}
            </button>
          </h4>
          {showKeyConfig && (
            <div>
              <input
                type="password"
                placeholder="Enter AIzaSy..."
                value={apiKey}
                onChange={handleApiKeyChange}
                style={{
                  fontFamily: "inherit",
                  padding: "10px",
                  fontSize: "0.9rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  width: "100%",
                  boxSizing: "border-box",
                  marginBottom: "8px"
                }}
              />
              <p className="hint" style={{ fontSize: "0.75rem", color: "#64748b", margin: "4px 0 0 0" }}>
                Get an API key from the <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#4f46e5", textDecoration: "underline" }}>Google AI Studio</a>. Keys are stored locally in your browser.
              </p>
            </div>
          )}
        </div>

        {/* Origin & Destination Row */}
        <div className="grid-2-col">
          <label>
            🧭 Starting location (From)
            <input
              type="text"
              name="origin"
              placeholder="City, Country (e.g. New York, USA)"
              value={formData.origin}
              onChange={handleChange}
            />
          </label>

          <label>
            📍 Destination (To)
            <input
              type="text"
              name="destination"
              placeholder="Where are you going? (e.g. Paris, France)"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {/* Start Date & End Date Row */}
        <div className="grid-2-col">
          <label>
            📅 Start Date
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            📅 End Date
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {/* Budget Input Row */}
        <div>
          <label>
            💰 Total Budget (₹)
            <input
              type="number"
              name="budget"
              min="1"
              placeholder="e.g. 50000"
              value={formData.budget}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {/* Traveler Counter Columns with Good Spacing */}
        <div>
          <h3 style={{ fontWeight: 700, margin: "10px 0 6px 0" }}>👥 Travelers</h3>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginTop: "12px" }}>
            
            {/* Adults Counter */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "120px", flex: "1" }}>
              <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#475569" }}>Adults</span>
              <div className="duration-container" style={{ margin: 0, width: "100%", justifyContent: "space-between" }}>
                <button
                  type="button"
                  className="duration-btn"
                  onClick={() => handleAdjustCounter("adults", -1)}
                  disabled={formData.adults <= 1}
                >
                  −
                </button>
                <span className="duration-value">{formData.adults}</span>
                <button
                  type="button"
                  className="duration-btn"
                  onClick={() => handleAdjustCounter("adults", 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Children Counter */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "120px", flex: "1" }}>
              <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#475569" }}>Children (2-12 yr)</span>
              <div className="duration-container" style={{ margin: 0, width: "100%", justifyContent: "space-between" }}>
                <button
                  type="button"
                  className="duration-btn"
                  onClick={() => handleAdjustCounter("children", -1)}
                  disabled={formData.children <= 0}
                >
                  −
                </button>
                <span className="duration-value">{formData.children}</span>
                <button
                  type="button"
                  className="duration-btn"
                  onClick={() => handleAdjustCounter("children", 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Infants Counter */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "120px", flex: "1" }}>
              <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#475569" }}>Infants (Under 2 yr)</span>
              <div className="duration-container" style={{ margin: 0, width: "100%", justifyContent: "space-between" }}>
                <button
                  type="button"
                  className="duration-btn"
                  onClick={() => handleAdjustCounter("infants", -1)}
                  disabled={formData.infants <= 0}
                >
                  −
                </button>
                <span className="duration-value">{formData.infants}</span>
                <button
                  type="button"
                  className="duration-btn"
                  onClick={() => handleAdjustCounter("infants", 1)}
                >
                  +
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Travel Mode Chips */}
        <div>
          <h3 style={{ fontWeight: 700, margin: "10px 0 6px 0" }}>🚗 Travel Mode</h3>
          <div className="chips">
            {["Flight", "Train", "Car", "Bus"].map((mode) => (
              <button
                key={mode}
                type="button"
                className={formData.travelMode === mode ? "active" : ""}
                onClick={() => handleSelectField("travelMode", mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Interests Multiple Chips */}
        <div>
          <h3 style={{ fontWeight: 700, margin: "10px 0 6px 0" }}>❤️ Interests</h3>
          <div className="chips">
            {interestsList.map((interest) => (
              <button
                key={interest}
                type="button"
                className={formData.interests.includes(interest) ? "active" : ""}
                onClick={() => handleToggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* AI Recommendations Multiple Chips */}
        <div>
          <h3 style={{ fontWeight: 700, margin: "18px 0 6px 0" }}>🤖 AI Recommendations</h3>
          <div className="chips">
            {recommendationsList.map((rec) => (
              <button
                key={rec}
                type="button"
                className={formData.include.includes(rec) ? "active" : ""}
                onClick={() => handleToggleInclude(rec)}
              >
                {rec}
              </button>
            ))}
          </div>
        </div>

        <button className="generate" type="submit" disabled={loading} style={{ marginTop: "12px" }}>
          {loading ? "🔎 Generating Itinerary..." : "✨ Generate Trip"}
        </button>
      </form>

      {/* Loading Skeleton */}
      {loading && (
        <div className="skeleton-container">
          <div className="skeleton-line title"></div>
          <div className="skeleton-line subtitle"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line" style={{ width: "85%" }}></div>
          <div className="skeleton-card-grid">
            <div className="skeleton-card">
              <div className="skeleton-line title" style={{ width: "60%" }}></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line" style={{ width: "80%" }}></div>
            </div>
            <div className="skeleton-card">
              <div className="skeleton-line title" style={{ width: "60%" }}></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line" style={{ width: "80%" }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripForm;
