# AI Travel Planner — Portfolio Complete Build

This version keeps the existing React + Vite + Express + MongoDB application and adds:

- destination-based hotel search using OpenStreetMap/Overpass
- destination-based tourist-place search using OpenStreetMap/Overpass
- coordinates and embedded OpenStreetMap maps for hotels and places
- correct image lookup using Wikipedia/Wikimedia when available
- hotel View + Map + Book flow
- demo hotel booking stored in MongoDB
- Gemini-powered itinerary generation with structured JSON
- destination verification before itinerary generation
- verified OSM attractions supplied to Gemini so it does not freely invent places
- AI travel assistant endpoint
- saved trips in MongoDB
- dashboard sections for saved trips and bookings
- free Open-Meteo-ready architecture can be added later if needed

## Run locally

### 1. MongoDB
Make sure MongoDB is running locally.

### 2. Backend
```powershell
cd "AI-Travel Planner\backend"
npm install
```

Open `backend/.env` and replace:
```env
GEMINI_API_KEY=PUT_YOUR_GEMINI_API_KEY_HERE
```
with your Gemini API key.

Then:
```powershell
npm run dev
```

Backend: `http://localhost:5000`

### 3. Frontend
Open a second terminal:
```powershell
cd "AI-Travel Planner\frontend"
npm install
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173/`.

## Important

- Hotel prices from OpenStreetMap search are portfolio estimates, not live rates.
- Booking is a demo booking stored in MongoDB; no real payment or hotel inventory is processed.
- OpenStreetMap/Nominatim/Overpass are public services. Use reasonable request rates.
- Keep `backend/.env` private and never commit the Gemini API key.

## Optional seed data

To restore the six curated homepage hotels:
```powershell
cd "AI-Travel Planner\backend"
npm run seed
```

The hotel search will still use OpenStreetMap for a non-empty destination search.
