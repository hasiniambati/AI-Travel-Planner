const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const geminiSchema = {
  type: "object",
  properties: {
    tripSummary: {
      type: "object",
      properties: {
        from: { type: "string" },
        destination: { type: "string" },
        durationDays: { type: "integer" },
        budget: { type: "string" },
        travelers: { type: "string" },
        bestTimeToVisit: { type: "string" },
        estimatedTravelCost: { type: "string" }
      },
      required: ["from", "destination", "durationDays", "budget", "travelers", "bestTimeToVisit", "estimatedTravelCost"]
    },
    hotelOptions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          hotelName: { type: "string" },
          address: { type: "string" },
          pricePerNight: { type: "string" },
          rating: { type: "string" },
          description: { type: "string" },
          geoCoordinates: {
            type: "object",
            properties: {
              lat: { type: "number" },
              lng: { type: "number" }
            },
            required: ["lat", "lng"]
          }
        },
        required: ["hotelName", "address", "pricePerNight", "rating", "description", "geoCoordinates"]
      }
    },
    itinerary: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "integer" },
          theme: { type: "string" },
          plan: {
            type: "array",
            items: {
              type: "object",
              properties: {
                timeOfDay: { type: "string" },
                placeName: { type: "string" },
                placeDetails: { type: "string" },
                ticketPricing: { type: "string" },
                travelTimeFromPrevious: { type: "string" },
                bestTimeToVisit: { type: "string" }
              },
              required: ["timeOfDay", "placeName", "placeDetails", "ticketPricing", "travelTimeFromPrevious", "bestTimeToVisit"]
            }
          }
        },
        required: ["day", "theme", "plan"]
      }
    }
  },
  required: ["tripSummary", "hotelOptions", "itinerary"]
};

export const getGeminiApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem("gemini_api_key") || "";
  if (key && (key.startsWith("AQ.Ab8RN") || key.includes("YOUR_API_KEY") || key === "placeholder")) {
    return "";
  }
  return key;
};

export const saveGeminiApiKey = (key) => {
  if (key && key.trim()) {
    localStorage.setItem("gemini_api_key", key.trim());
  } else {
    localStorage.removeItem("gemini_api_key");
  }
};

export const generateTripWithGemini = async (formData) => {
  const { origin, destination, startDate, endDate, budget, adults, children, infants, travelMode, interests = [], include = [] } = formData;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = isNaN(start.getTime()) || isNaN(end.getTime())
    ? 3
    : Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);

  const totalTravellers = Number(adults || 1) + Number(children || 0) + Number(infants || 0);

  const prompt = `You are an expert travel planner. Create a highly personalized, practical, and exciting travel itinerary based on the following preferences:
- **Origin Location (From):** ${origin || "Not specified"}
- **Destination Location (To):** ${destination}
- **Travel Dates:** From ${startDate} to ${endDate} (${duration} days)
- **Total Budget:** INR ${budget}
- **Number of Persons:** ${totalTravellers} (${adults} Adults, ${children} Children, ${infants} Infants)
- **Travel Mode:** ${travelMode}
- **Interests:** ${interests.join(", ") || "General sightseeing"}
- **Recommendations to Include:** ${include.join(", ") || "General attractions"}

Please output strict JSON matching the required schema. Ensure the estimatedTravelCost estimate matches the budget level. Recommended hotels must be realistic stays in ${destination}. For each day in the itinerary, provide multiple activities structured by timeOfDay (e.g. Morning, Afternoon, Evening) with correct ticketing/pricing, best visit times, and realistic travel times from previous spots.`;

  const response = await fetch(`${API_URL}/ai/proxy-gemini`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gemini-1.5-flash",
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
          responseMimeType: "application/json",
          responseSchema: geminiSchema
        }
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMsg = errorData?.message || errorData?.error?.message || `API error (${response.status})`;
    throw new Error(`Gemini API Error: ${errMsg}`);
  }

  const responseData = await response.json();
  const textContent = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error("Empty response received from the Gemini model.");
  }

  try {
    const parsedData = JSON.parse(textContent);
    
    // Store full response JSON in localStorage under 'userTrip'
    const tripPayload = { tripData: formData, result: parsedData };
    localStorage.setItem("userTrip", JSON.stringify(tripPayload));
    // Also save in current_trip for fallback/backward-compatibility
    localStorage.setItem("current_trip", JSON.stringify(tripPayload));

    return parsedData;
  } catch (parseErr) {
    console.error("Failed to parse response JSON: ", textContent);
    throw new Error("Failed to parse trip plan. Please try again.");
  }
};

export const chatWithGeminiAPI = async (message, chatHistory = [], tripContext = null) => {
  // Gemini expects: { role: 'user'|'model', parts: [{ text: string }] }
  const contents = [];

  // Build system instructions with trip context
  let contextPrompt = `You are a friendly and intelligent AI Travel Assistant inside a travel planning application.
Your job is to help users with:
- trip planning
- destinations
- hotels
- sightseeing
- budgets
- packing
- travel routes
- food recommendations
- travel tips

`;

  if (tripContext) {
    contextPrompt += `Current trip context:
- Destination: ${tripContext.tripSummary?.destination || "N/A"}
- Starting Location (From): ${tripContext.tripSummary?.from || "N/A"}
- Duration: ${tripContext.tripSummary?.durationDays} Days
- Budget Level: ${tripContext.tripSummary?.budget || "N/A"}
- Travelers / Group: ${tripContext.tripSummary?.travelers || "N/A"}
- Best Time to Visit: ${tripContext.tripSummary?.bestTimeToVisit || "N/A"}
- Estimated Transit Cost: ${tripContext.tripSummary?.estimatedTravelCost || "N/A"}

Itinerary details:
${JSON.stringify(tripContext.itinerary || [])}

Use this itinerary and trip details to answer follow-up questions accurately. Do not invent details contradicting this plan. If requested to find something outside this plan, provide suggestions aligned with the destination, budget, and travelers group type.
`;
  }

  // Add history (limit to last 10 messages to save context limits)
  chatHistory.slice(-10).forEach((msg) => {
    contents.push({
      role: msg.sender === "ai" ? "model" : "user",
      parts: [{ text: msg.text }]
    });
  });

  // Append new user message
  contents.push({
    role: "user",
    parts: [{ text: message }]
  });

  const response = await fetch(`${API_URL}/ai/proxy-gemini`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gemini-1.5-flash",
      body: {
        contents: contents,
        systemInstruction: {
          parts: [{ text: contextPrompt }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMsg = errorData?.message || errorData?.error?.message || `API error (${response.status})`;
    throw new Error(`Gemini API Error: ${errMsg}`);
  }

  const responseData = await response.json();
  const textContent = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error("Empty response received from the Gemini model.");
  }

  return textContent;
};
