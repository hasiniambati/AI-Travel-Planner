import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./TripResult.css";

function TripResult() {

    const itinerary = [

        {
            day: 1,
            title: "Arrival & Local Sightseeing",
            activities: [
                "Check-in Hotel",
                "Lunch at Local Restaurant",
                "Visit City Museum",
                "Evening Shopping"
            ]
        },

        {
            day: 2,
            title: "Adventure Day",
            activities: [
                "Breakfast",
                "Beach Visit",
                "Boat Ride",
                "Sunset Point"
            ]
        },

        {
            day: 3,
            title: "Departure",
            activities: [
                "Breakfast",
                "Souvenir Shopping",
                "Airport Drop"
            ]
        }

    ];

    return (

        <>

            <Navbar />

            <section className="trip-result">

                <div className="trip-header">

                    <h1>Your AI Generated Trip</h1>

                    <p>
                        Here's your personalized itinerary based on your travel preferences.
                    </p>

                </div>

                <div className="timeline">

                    {

                        itinerary.map((item,index)=>(

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

                                    {

                                        item.activities.map((activity,i)=>

                                            <li key={i}>

                                                {activity}

                                            </li>

                                        )

                                    }

                                </ul>

                            </div>

                        ))

                    }

                </div>

            </section>

            <Footer />

        </>

    );

}

export default TripResult;