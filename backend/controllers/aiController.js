import { searchPlaces, geocode } from '../services/osmService.js';
import { generateItinerary, chatWithGemini } from '../services/geminiService.js';
import SavedTrip from '../models/SavedTrip.js';

function fallbackItinerary(input, places) {
  const days=Math.max(1,Math.round((new Date(input.endDate)-new Date(input.startDate))/86400000)+1);
  const verified=places.slice(0,Math.max(3,days*3)); const perDay=Math.max(1,Math.ceil(verified.length/days));
  const dayList=Array.from({length:days},(_,i)=>{const items=verified.slice(i*perDay,(i+1)*perDay).slice(0,3).map(p=>({name:p.name,time:"Flexible",duration:"1-2 hours",description:"Verified attraction selected for this destination.",estimatedCost:0}));return {day:i+1,title:`Day ${i+1} in ${input.destination}`,morning:items.slice(0,1),afternoon:items.slice(1,2),evening:items.slice(2,3)};});
  const budget=Number(input.budget)||0; return {destination:input.destination,summary:`A ${days}-day personalized plan focused on ${input.interests?.length?input.interests.join(', '):'destination highlights'}.`,journey:{departurePlan:input.origin?`Plan your departure from ${input.origin} with a reasonable buffer.`:"Plan your departure with a reasonable buffer.",stationArrivalAdvice:"Arrive early and verify live schedules before travel.",arrivalPlan:"Check in after arrival and begin nearby sightseeing.",localTransfer:"Use local transport based on convenience and budget.",returnPlan:"Keep sufficient time for checkout and return travel."},stay:{recommendedArea:"Central area near major attractions",reason:"Reduces local travel time and improves sightseeing convenience.",checkInAdvice:"Confirm check-in requirements with your chosen hotel."},days:dayList,budget:{transport:Math.round(budget*.2),stay:Math.round(budget*.35),food:Math.round(budget*.2),activities:Math.round(budget*.15),miscellaneous:Math.round(budget*.1),total:budget},recommendations:input.include||[],packing:['Travel ID','Comfortable shoes','Weather-appropriate clothing','Phone charger / power bank'],tips:['Attractions were verified against map data.','Prices are estimates; verify current prices before booking.']};
}

export const generateTrip = async (req, res) => {
  try {
    const input = req.body;
    if (!input.destination || !input.startDate || !input.endDate || !input.budget) return res.status(400).json({ success: false, message: 'Destination, dates and budget are required' });
    if (new Date(input.endDate) < new Date(input.startDate)) return res.status(400).json({ success: false, message: 'End date cannot be before start date' });
    const geo = await geocode(input.destination);
    const result = await searchPlaces(input.destination, 30);
    if (!result.places.length) return res.status(404).json({ success: false, message: `No mapped attractions were found for ${input.destination}. Try a nearby city or a more specific destination.` });
    const normalized = { ...input, destination: geo.name };
    let itinerary = null;
    try { itinerary = await generateItinerary(normalized, result.places); } catch (e) { console.error('Gemini itinerary failed:', e.message); }
    if (!itinerary) itinerary = fallbackItinerary(normalized, result.places);
    itinerary.destination = geo.name;
    res.json({ success: true, source: process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('PUT_YOUR') ? 'gemini+openstreetmap' : 'verified-openstreetmap-fallback', destination: geo, verifiedPlaces: result.places.slice(0, 30), itinerary });
  } catch (error) { console.error('GENERATE TRIP ERROR:', error); res.status(502).json({ success: false, message: error.message || 'Unable to generate trip' }); }
};

export const assistantChat = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const answer = await chatWithGemini(
      message.trim(),
      context || {}
    );

    if (!answer) {
      return res.json({
        success: true,
        source: "fallback",
        answer:
          "I can help you plan trips, choose destinations, estimate budgets and suggest places to visit."
      });
    }

    return res.json({
      success: true,
      source: "ai",
      answer
    });

  } catch (error) {
    console.error("ASSISTANT ERROR:", error.message);

    return res.status(502).json({
      success: false,
      message: error.message || "Assistant is temporarily unavailable"
    });
  }
};

export const saveTrip = async (req, res) => {
  const trip = await SavedTrip.create({ user: req.user._id, destination: req.body.destination, startDate: req.body.startDate, endDate: req.body.endDate, tripData: req.body });
  res.status(201).json({ success: true, trip });
};

export const getSavedTrips = async (req, res) => {
  const trips = await SavedTrip.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, trips });
};

export const deleteSavedTrip = async (req, res) => {
  try {
    const trip = await SavedTrip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const proxyGemini = async (req, res) => {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.includes("PUT_YOUR")) {
      return res.status(400).json({
        success: false,
        message: "Gemini API Key is not set or is invalid on the server backend. Please configure GEMINI_API_KEY in your backend environment."
      });
    }

    const { model, body } = req.body;
    if (!model || !body) {
      return res.status(400).json({
        success: false,
        message: "Model and body are required for Gemini proxy request"
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.json(data);
  } catch (error) {
    console.error("PROXY GEMINI ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Gemini proxy failed"
    });
  }
};

