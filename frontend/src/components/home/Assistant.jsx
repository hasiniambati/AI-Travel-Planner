import { useState } from "react";
import "./Assistant.css";

function Assistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I am your AI Travel Assistant 🤖. Ask me about destinations, hotels, itineraries, budgets, packing, weather, or travel tips!"
    }
  ]);

  // Generate a travel response based on the user's question
  const getAIResponse = (question) => {
    const text = question.toLowerCase();

    // Greetings
    if (
      text.includes("hi") ||
      text.includes("hello") ||
      text.includes("hey")
    ) {
      return "Hello! 👋 I’m your AI Travel Assistant. Tell me where you want to travel, your budget, or what kind of trip you want, and I’ll help you plan it. 🌍✈️";
    }

    // Goa
    if (text.includes("goa")) {
      return "Goa is a great choice! 🏖️ You can enjoy beaches, water activities, local food, nightlife and Portuguese-style heritage. Popular places include Baga Beach, Calangute, Fort Aguada and Palolem Beach.";
    }

    // Paris
    if (text.includes("paris")) {
      return "Paris is perfect for a cultural and romantic trip. 🗼 Consider visiting the Eiffel Tower, Louvre Museum, Notre-Dame area and Montmartre. Don't forget to try French pastries and local cuisine!";
    }

    // Dubai
    if (text.includes("dubai")) {
      return "Dubai offers a mix of luxury, adventure and modern attractions. 🏙️ You can visit Burj Khalifa, Dubai Mall, Palm Jumeirah and the desert. A desert safari is a great adventure option!";
    }

    // Bali
    if (text.includes("bali")) {
      return "Bali is ideal for beaches, nature and relaxation. 🌴 Consider Ubud for nature and culture, Seminyak for beaches and restaurants, and Uluwatu for beautiful sunsets.";
    }

    // Mountains
    if (
      text.includes("mountain") ||
      text.includes("hills") ||
      text.includes("hiking")
    ) {
      return "🏔️ For a mountain trip, consider the Himalayas, Manali, Kashmir, Munnar or the Swiss Alps. Your choice depends on your budget, season and preferred activities.";
    }

    // Beach
    if (
      text.includes("beach") ||
      text.includes("sea")
    ) {
      return "🏖️ For a beach vacation, Goa, Bali, Maldives, Andaman and Thailand are popular choices. For a budget-friendly trip from India, Goa and the Andaman Islands are good options.";
    }

    // Hotels
    if (
      text.includes("hotel") ||
      text.includes("stay") ||
      text.includes("accommodation")
    ) {
      return "🏨 I can help you choose a stay based on destination and budget. Visit the Hotels section of Travel Planner to search and sort our available hotel recommendations.";
    }

    // Budget
    if (
      text.includes("budget") ||
      text.includes("cheap") ||
      text.includes("affordable")
    ) {
      return "💰 For a budget-friendly trip, choose destinations with affordable accommodation and local transport. Traveling during the off-season, booking early and using public transport can help reduce costs.";
    }

    // Weather
    if (
      text.includes("weather") ||
      text.includes("temperature") ||
      text.includes("rain")
    ) {
      return "🌦️ Weather depends on the destination and travel dates. Enter your destination and dates in the Trip Planner to plan your trip more effectively. For live weather information, a weather API can be connected later.";
    }

    // Food
    if (
      text.includes("food") ||
      text.includes("restaurant") ||
      text.includes("eat")
    ) {
      return "🍽️ Food is an important part of every trip! Try local restaurants and regional specialties rather than only international chains. Tell me your destination and I can suggest what local foods to look for.";
    }

    // Packing
    if (
      text.includes("pack") ||
      text.includes("packing") ||
      text.includes("luggage")
    ) {
      return "🎒 Basic travel packing checklist: clothes, comfortable shoes, toiletries, medicines, phone charger, power bank, travel documents, ID proof and some emergency cash. Pack according to your destination's weather.";
    }

    // Itinerary
    if (
      text.includes("itinerary") ||
      text.includes("plan my trip") ||
      text.includes("trip plan")
    ) {
      return "🗺️ You can create a personalized itinerary using the Trip Planner. Enter your destination, dates, budget, travelers, travel style and interests, then select 'Plan My Trip'.";
    }

    // Places
    if (
      text.includes("places") ||
      text.includes("attractions") ||
      text.includes("visit") ||
      text.includes("tourist")
    ) {
      return "📍 You can explore popular destinations in the Places section. Choose a category such as Beach, Mountain, City or Historical to find destinations that match your interests.";
    }

    // Travel mode
    if (
      text.includes("flight") ||
      text.includes("train") ||
      text.includes("bus") ||
      text.includes("car") ||
      text.includes("transport")
    ) {
      return "🚗 Choose your travel mode based on distance, budget and convenience. Flights are usually faster for long distances, while trains and buses can be more economical.";
    }

    // Family
    if (
      text.includes("family") ||
      text.includes("children") ||
      text.includes("kids")
    ) {
      return "👨‍👩‍👧‍👦 For a family trip, choose destinations with comfortable accommodation, easy transportation and activities suitable for different age groups. Goa, Kerala, Dubai and Singapore are popular choices.";
    }

    // Couple
    if (
      text.includes("couple") ||
      text.includes("romantic") ||
      text.includes("honeymoon")
    ) {
      return "❤️ For a romantic trip, consider Goa, Bali, Maldives, Paris, Kashmir or Udaipur. Look for scenic stays, relaxed activities and beautiful evening experiences.";
    }

    // Adventure
    if (
      text.includes("adventure") ||
      text.includes("adventurous")
    ) {
      return "🔥 For adventure, consider trekking, rafting, scuba diving, paragliding, camping or a desert safari. Manali, Rishikesh, Goa, Dubai and the Himalayas offer many options.";
    }

    // Login
    if (
      text.includes("login") ||
      text.includes("sign in") ||
      text.includes("account")
    ) {
      return "🔐 You can use the Login option in the navigation bar to access your account. New users can create an account using Sign Up.";
    }

    // Help
    if (
      text.includes("help") ||
      text.includes("what can you do")
    ) {
      return "🤖 I can help with:\n\n🌍 Destinations\n🏨 Hotels\n🗺️ Trip planning\n💰 Budget tips\n🌦️ Weather information\n🍽️ Food suggestions\n🎒 Packing tips\n🚗 Travel modes\n❤️ Couple trips\n👨‍👩‍👧‍👦 Family trips\n🔥 Adventure trips";
    }

    // Default
    return "🤔 I can help you with destinations, hotels, itineraries, budgets, food, packing, travel modes and trip suggestions. Try asking something like:\n\n• Suggest a trip to Goa\n• What should I pack?\n• Best beach destinations?\n• Help me plan a family trip\n• Tell me about hotels";
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const userText = message.trim();

    const userMessage = {
      sender: "user",
      text: userText
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    setMessage("");

    // Show typing animation
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "typing"
      }
    ]);

    setTimeout(() => {
      const response = getAIResponse(userText);

      setMessages((prev) => {
        const withoutTyping = prev.filter(
          (msg) => msg.text !== "typing"
        );

        return [
          ...withoutTyping,
          {
            sender: "ai",
            text: response
          }
        ];
      });
    }, 800);
  };

  return (
    <div className="assistant-container">

      {open && (

        <div className="chat-box">

          <div className="chat-header">

            <h3>
              AI Travel Assistant 🤖
            </h3>

            <button
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

          </div>

          <div className="chat-body">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={
                  msg.text === "typing"
                    ? "ai-message typing"
                    : msg.sender === "ai"
                    ? "ai-message"
                    : "user-message"
                }
              >

                {msg.text === "typing" ? (
                  <>
                    <span></span>
                    <span></span>
                    <span></span>
                  </>
                ) : (
                  msg.text
                )}

              </div>

            ))}

          </div>

          <div className="chat-input">

            <input
              type="text"
              placeholder="Ask about your trip..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button onClick={sendMessage}>
              ➤
            </button>

          </div>

        </div>

      )}

      <button
        className="assistant-button"
        onClick={() => setOpen(!open)}
      >
        🤖
      </button>

    </div>
  );
}

export default Assistant;