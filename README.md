# 🌍 AI Travel Planner

An intelligent, full-stack travel planning web application built with **React**, **Node.js**, **Express**, and **MongoDB**. The application generates customized travel itineraries, recommends tourist attractions and hotels, provides real-time local previews, and manages user trip bookings, all powered by the **Google Gemini API**.

---

## 📌 Features

### **Frontend & User Experience**
* **Interactive Trip Planner**: Form-driven interface to input origin, destination, dates, budget, travelers group, travel style, and special interests.
* **AI Itinerary View**: Interactive rendering of chronological daily plans, categorized by Morning, Afternoon, and Evening activities.
* **Place & Stay Discovery**: Visual recommendations of hotels and tourist attractions matching budget constraints.
* **AI Chat Assistant**: An interactive slide-out chat bot companion to ask questions, plan routes, or get packing recommendations using context from your trip.
* **User Dashboard & Bookings**: Save your generated trips, explore booking confirmations, and manage your profile.
* **Authentication**: Complete JWT-based registration, login, and protected routing.

### **Backend & AI Engine**
* **Gemini API Integration**: Dynamic content generation and chat interactions powered by `gemini-3.6-flash`.
* **RESTful API**: Standardized JSON endpoints for users, bookings, saved trips, search places, and local weather.
* **Secure Session Management**: Protected routes utilizing JWT headers and `bcryptjs` password hashing.
* **Database Seeding**: Simple configuration script to pre-load hotel data into MongoDB.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework**: React 19 (Vite)
* **Routing**: React Router DOM (v7)
* **Icons**: React Icons
* **Deployment**: GitHub Pages (`gh-pages`)

### **Backend**
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (via Mongoose ODM)
* **Authentication**: JWT & Bcryptjs
* **Development**: Nodemon

---

## 📂 Project Structure

```text
AI-Travel-Planner/
├── frontend/                   # React Frontend
│   ├── public/                 # Static assets (favicons, SPA redirect scripts)
│   ├── src/
│   │   ├── assets/             # Images (Hero background image)
│   │   ├── components/         # Reusable UI elements (cards, auth forms, planner, layout)
│   │   ├── context/            # Global React state (AuthContext, TripContext)
│   │   ├── pages/              # Routed page views (Home, Dashboard, Hotels, Places, etc.)
│   │   ├── services/           # API handlers (base fetch requests & Gemini proxy client)
│   │   ├── App.jsx             # Main Router definition
│   │   └── main.jsx            # App mount point
│   ├── vite.config.js          # Vite config (defines base path for GitHub Pages)
│   └── package.json
│
├── backend/                    # Express Backend
│   ├── config/                 # Database configuration (db connection helper)
│   ├── controllers/            # Logic handlers (Auth, AI proxy, Bookings, Hotels)
│   ├── middleware/             # Route guards (JWT verification & Error handling)
│   ├── models/                 # Database models (User, Booking, Place, etc.)
│   ├── routes/                 # Express route definitions
│   ├── services/               # Integrations (Gemini API service, OpenStreetMap)
│   ├── seedHotels.js           # Hotel database seeder script
│   ├── app.js                  # App start configuration
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** (Local instance or Atlas Connection URI)
* **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root directory and add the following configurations:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/aiTravelPlanner
   JWT_SECRET=your_jwt_secret_token
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-3.6-flash
   ```
   > [!NOTE]
   > The backend relies on newer `AQ.` prefix authorization keys issued by Google AI Studio. The validation checks natively support the updated Google key structures.

4. Seed the database with hotel data:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend should now be running on `http://localhost:5000`.

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify or edit your environment configurations. In `frontend/.env`, set the API URL pointing to your backend:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/AI-Travel-Planner`.

---

## ✈️ Gemini API Integration Details

The app uses the **`gemini-3.6-flash`** model from the `v1beta` API endpoint to handle:
* **Structured Output**: Requesting custom itineraries conforming to a strict JSON Schema representing days, activities, budget splits, packing lists, and tips.
* **Contextual Conversations**: The AI assistant accepts conversational inputs alongside active itinerary context to answer destination-specific queries.

If you hit a **`401 (Request had invalid authentication credentials)`** error, ensure your generated API key from [Google AI Studio](https://aistudio.google.com/) is copied correctly into `backend/.env`.

---

## 🌐 Deployment

### Frontend (GitHub Pages)
The project is configured to build and deploy to GitHub Pages under the subpath `/AI-Travel-Planner/` (configured via the `base` property in `vite.config.js`).

1. Ensure the remote repository is configured correctly:
   ```bash
   git remote -v
   ```
2. Deploy the build:
   ```bash
   npm run deploy
   ```
   This compiles assets into `dist/` and pushes the output folder directly to your repository's `gh-pages` branch.

### Backend (e.g. Render, Heroku)
1. Push all source code to your GitHub `main` branch.
2. Connect your repository to your backend host (such as Render).
3. Set your production Environment Variables in the hosting dashboard corresponding to the backend `.env` keys (ensure `VITE_API_URL` in `.env.production` matches your live API URL).
