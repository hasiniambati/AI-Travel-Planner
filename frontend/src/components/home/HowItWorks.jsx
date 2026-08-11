import "./HowItWorks.css";

function HowItWorks() {

  const steps = [
    {
      icon: "📍",
      title: "Choose Destination",
      desc: "Select your destination, dates, budget, and travel preferences."
    },
    {
      icon: "🤖",
      title: "AI Creates Itinerary",
      desc: "Our AI generates a personalized travel plan in seconds."
    },
    {
      icon: "✈️",
      title: "Enjoy Your Journey",
      desc: "Book hotels, explore attractions, and travel with confidence."
    }
  ];

  return (
    <section className="how-it-works">

      <h2>How It Works</h2>

      <p>Planning your dream trip has never been easier.</p>

      <div className="steps">

        {steps.map((step) => (

          <div className="step-card" key={step.title}>

            <div className="step-icon">
              {step.icon}
            </div>

            <h3>{step.title}</h3>

            <p>{step.desc}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default HowItWorks;