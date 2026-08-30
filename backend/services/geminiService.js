const API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

const getModel = () =>
  process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";

async function callGemini(prompt, schema = null) {
  const key = process.env.GEMINI_API_KEY;

  if (!key || key.includes("PUT_YOUR") || key.startsWith("AQ.Ab8RN")) {
    return null;
  }

  const model = getModel();

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096
    }
  };

  if (schema) {
    body.generationConfig.responseMimeType = "application/json";
    body.generationConfig.responseSchema = schema;
  }

  const response = await fetch(
    `${API_BASE}/${model}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    console.error(
      "Gemini Error:",
      response.status,
      JSON.stringify(errorData)
    );

    throw new Error(
      errorData?.error?.message ||
        `Gemini API returned ${response.status}`
    );
  }

  const data = await response.json();

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  if (schema) {
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Gemini returned invalid structured data");
    }
  }

  return text;
}


/* =========================
   ITINERARY SCHEMA
========================= */

const activitySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    time: { type: "string" },
    duration: { type: "string" },
    description: { type: "string" },
    estimatedCost: { type: "number" }
  },
  required: [
    "name",
    "time",
    "duration",
    "description",
    "estimatedCost"
  ]
};

const itinerarySchema = {
  type: "object",
  properties: {
    destination: { type: "string" },

    summary: { type: "string" },

    journey: {
      type: "object",
      properties: {
        departurePlan: { type: "string" },
        stationArrivalAdvice: { type: "string" },
        arrivalPlan: { type: "string" },
        localTransfer: { type: "string" },
        returnPlan: { type: "string" }
      },
      required: [
        "departurePlan",
        "stationArrivalAdvice",
        "arrivalPlan",
        "localTransfer",
        "returnPlan"
      ]
    },

    stay: {
      type: "object",
      properties: {
        recommendedArea: { type: "string" },
        reason: { type: "string" },
        checkInAdvice: { type: "string" }
      },
      required: [
        "recommendedArea",
        "reason",
        "checkInAdvice"
      ]
    },

    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "integer" },
          title: { type: "string" },
          morning: {
            type: "array",
            items: activitySchema
          },
          afternoon: {
            type: "array",
            items: activitySchema
          },
          evening: {
            type: "array",
            items: activitySchema
          }
        },
        required: [
          "day",
          "title",
          "morning",
          "afternoon",
          "evening"
        ]
      }
    },

    budget: {
      type: "object",
      properties: {
        transport: { type: "number" },
        stay: { type: "number" },
        food: { type: "number" },
        activities: { type: "number" },
        miscellaneous: { type: "number" },
        total: { type: "number" }
      },
      required: [
        "transport",
        "stay",
        "food",
        "activities",
        "miscellaneous",
        "total"
      ]
    },

    recommendations: {
      type: "array",
      items: { type: "string" }
    },

    packing: {
      type: "array",
      items: { type: "string" }
    },

    tips: {
      type: "array",
      items: { type: "string" }
    }
  },

  required: [
    "destination",
    "summary",
    "journey",
    "stay",
    "days",
    "budget",
    "recommendations",
    "packing",
    "tips"
  ]
};


/* =========================
   GENERATE TRIP
========================= */

export async function generateItinerary(input, places) {
  const placeList = places
    .slice(0, 20)
    .map(
      (place, index) =>
        `${index + 1}. ${place.name} (${place.category})`
    )
    .join("\n");

  const days = Math.max(
    1,
    Math.round(
      (new Date(input.endDate) -
        new Date(input.startDate)) /
        86400000
    ) + 1
  );

  const travellers =
    Number(input.adults || 0) +
    Number(input.children || 0) +
    Number(input.infants || 0);

  const prompt = `
You are an expert travel planner.

Create a practical, realistic and personalized travel itinerary.

IMPORTANT:
The itinerary must be easy to follow and chronological.

TRIP DETAILS

Starting location:
${input.origin}

Destination:
${input.destination}

Travel dates:
${input.startDate} to ${input.endDate}

Number of days:
${days}

Travellers:
${travellers}

Travel mode:
${input.travelMode}

Trip purpose:
${input.tripPurpose}

Travel style:
${input.travelStyle}

Total budget:
INR ${input.budget}

Interests:
${(input.interests || []).join(", ")}

Additional user requirements:
${input.specialRequests || "None"}

USER WANTS RECOMMENDATIONS FOR:
${(input.include || []).join(", ")}

PLAN REQUIREMENTS:

1. Start with the journey from the user's origin.
2. Explain when the traveller should reach the railway station,
airport or bus point as a recommended buffer.
3. Do NOT invent exact train, flight or bus schedules.
4. On arrival, explain how to reach the recommended stay area.
5. Recommend the best area to stay based on sightseeing convenience.
6. Create morning, afternoon and evening activities.
7. Avoid repeating attractions.
8. Do not overload each day.
9. Keep travel time practical.
10. The first day should account for travel and check-in.
11. The last day should account for check-out and return.
12. Keep the total budget realistic.
13. Respect the user's travel style and interests.
14. Give useful AI recommendations based on the user's preferences.

ONLY USE THESE VERIFIED PLACES:

${placeList}

Do not mention APIs, map data providers, data sources,
or that this is a demo application.
`;

  return await callGemini(prompt, itinerarySchema);
}


/* =========================
   AI ASSISTANT
========================= */

export async function chatWithGemini(message, context = {}) {
  const prompt = `
You are a friendly and intelligent AI Travel Assistant inside a travel planning application.

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
- family trips
- solo trips
- romantic trips

Current application context:
${JSON.stringify(context)}

User message:
${message}

Rules:

1. Give direct and useful answers.
2. Be conversational and natural.
3. Do not mention that you are an API.
4. Do not mention internal technical details.
5. Do not invent live train or flight schedules.
6. If exact live information is required, explain what information should be checked.
7. Keep answers concise but helpful.
`;

  return await callGemini(prompt);
}