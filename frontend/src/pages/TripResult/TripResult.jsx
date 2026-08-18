import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./TripResult.css";

function TripResult() {
    const location = useLocation();
    const navigate = useNavigate();

    const tripData = location.state?.tripData;

    // Prevent showing a fake itinerary when no trip was planned
    if (!tripData) {
        return (
            <>
                <Navbar />

                <section className="trip-result">
                    <div className="trip-header">
                        <h1>No Trip Planned Yet</h1>

                        <p>
                            Please enter your travel preferences to generate
                            your personalized itinerary.
                        </p>

                        <button
                            className="plan-btn"
                            onClick={() => navigate("/planner")}
                        >
                            ✈ Start Planning
                        </button>
                    </div>
                </section>

                <Footer />
            </>
        );
    }

    // Calculate number of travel days
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);

    const difference =
        Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const numberOfDays = Math.max(1, difference);

    // Remove emoji from interest names
    const cleanInterest = interest =>
        interest.replace(/^.\s/, "");

    const selectedInterests = tripData.interests.map(cleanInterest);

    // Generate activities based on selected interests
    function getActivities(day) {
        const activities = [];

        if (day === 1) {
            activities.push("Check-in at Hotel");
            activities.push("Explore the local area");

            if (selectedInterests.includes("Food")) {
                activities.push("Try Local Cuisine");
            } else {
                activities.push("Lunch at a Local Restaurant");
            }

            if (selectedInterests.includes("Shopping")) {
                activities.push("Evening Shopping");
            } else {
                activities.push("Relax and enjoy the evening");
            }

            return activities;
        }

        if (
            selectedInterests.includes("Beach") &&
            day === 2
        ) {
            activities.push("Breakfast");
            activities.push("Visit a Popular Beach");
            activities.push("Water Activities");
            activities.push("Watch the Sunset");
            return activities;
        }

        if (
            selectedInterests.includes("Adventure") &&
            day === 2
        ) {
            activities.push("Breakfast");
            activities.push("Adventure Activities");
            activities.push("Explore Scenic Locations");
            activities.push("Sunset Point");
            return activities;
        }

        if (
            selectedInterests.includes("Mountains") &&
            day === 2
        ) {
            activities.push("Breakfast");
            activities.push("Mountain Exploration");
            activities.push("Nature Walk");
            activities.push("Scenic Sunset");
            return activities;
        }

        if (
            selectedInterests.includes("Historical Places") &&
            day === 2
        ) {
            activities.push("Breakfast");
            activities.push("Visit Historical Monuments");
            activities.push("Explore Local Heritage");
            activities.push("Evening Cultural Experience");
            return activities;
        }

        if (
            selectedInterests.includes("Nature") &&
            day === 2
        ) {
            activities.push("Breakfast");
            activities.push("Explore Nature Spots");
            activities.push("Photography");
            activities.push("Relax in Nature");
            return activities;
        }

        if (day === numberOfDays) {
            activities.push("Breakfast");

            if (selectedInterests.includes("Shopping")) {
                activities.push("Souvenir Shopping");
            }

            activities.push(
                tripData.travelMode === "Flight"
                    ? "Airport Drop"
                    : "Departure"
            );

            return activities;
        }

        // General activities for middle days
        activities.push("Breakfast");

        if (selectedInterests.length > 0) {
            activities.push(
                `Explore ${selectedInterests[
                    (day - 1) % selectedInterests.length
                ]} Attractions`
            );
        } else {
            activities.push("Explore Popular Attractions");
        }

        if (selectedInterests.includes("Food")) {
            activities.push("Enjoy Local Cuisine");
        } else {
            activities.push("Visit a Local Attraction");
        }

        activities.push("Evening Leisure");

        return activities;
    }

    const itinerary = Array.from(
        { length: numberOfDays },
        (_, index) => {
            const day = index + 1;

            let title = "Explore & Enjoy";

            if (day === 1) {
                title = "Arrival & Local Sightseeing";
            } else if (day === numberOfDays) {
                title = "Departure";
            } else if (
                tripData.interests.some(i =>
                    i.includes("Adventure")
                )
            ) {
                title = "Adventure Day";
            } else if (
                tripData.interests.some(i =>
                    i.includes("Beach")
                )
            ) {
                title = "Beach & Exploration";
            } else if (
                tripData.interests.some(i =>
                    i.includes("Nature")
                )
            ) {
                title = "Nature & Relaxation";
            }

            return {
                day,
                title,
                activities: getActivities(day)
            };
        }
    );

    return (
        <>
            <Navbar />

            <section className="trip-result">

                <div className="trip-header">

                    <h1>
                        Your AI Generated Trip to{" "}
                        {tripData.destination}
                    </h1>

                    <p>
                        Here's your personalized itinerary based on
                        your travel preferences.
                    </p>

                    <div className="trip-summary">

                        <p>
                            📅 <strong>Dates:</strong>{" "}
                            {tripData.startDate} → {tripData.endDate}
                        </p>

                        <p>
                            👥 <strong>Travellers:</strong>{" "}
                            {tripData.adults} Adults,{" "}
                            {tripData.children} Children,{" "}
                            {tripData.infants} Infants
                        </p>

                        <p>
                            💰 <strong>Budget:</strong> ₹
                            {tripData.budget}
                        </p>

                        {tripData.travelMode && (
                            <p>
                                🚗 <strong>Travel Mode:</strong>{" "}
                                {tripData.travelMode}
                            </p>
                        )}

                        {tripData.travelStyle && (
                            <p>
                                ✨ <strong>Travel Style:</strong>{" "}
                                {tripData.travelStyle}
                            </p>
                        )}

                    </div>

                </div>

                <div className="timeline">

                    {itinerary.map((item, index) => (

                        <div
                            key={index}
                            className="timeline-card"
                        >

                            <div className="day">
                                Day {item.day}
                            </div>

                            <h2>
                                {item.title}
                            </h2>

                            <ul>

                                {item.activities.map(
                                    (activity, i) => (
                                        <li key={i}>
                                            {activity}
                                        </li>
                                    )
                                )}

                            </ul>

                        </div>

                    ))}

                </div>

                <div className="trip-actions">

                    <button
                        className="plan-btn"
                        onClick={() => navigate("/planner")}
                    >
                        🔄 Plan Another Trip
                    </button>

                </div>

            </section>

            <Footer />
        </>
    );
}

export default TripResult;