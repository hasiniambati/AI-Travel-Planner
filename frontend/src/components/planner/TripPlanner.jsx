import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import TripForm from "../TripForm";
import "./TripPlanner.css";

export default function TripPlanner() {
  const navigate = useNavigate();

  const handleTripGenerated = (formData, result) => {
    const tripPayload = { tripData: formData, result };
    // Save to localStorage so refreshing page does not lose the result
    localStorage.setItem("current_trip", JSON.stringify(tripPayload));
    navigate("/trip-result", { state: tripPayload });
  };

  return (
    <>
      <Navbar />
      <main className="planner-page">
        <TripForm onTripGenerated={handleTripGenerated} />
      </main>
      <Footer />
    </>
  );
}
