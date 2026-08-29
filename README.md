# 🌍 AI Travel Planner

An intelligent, full-stack travel planning web application built with React, Node.js, Express, and MongoDB. It generates customized travel itineraries, recommends tourist attractions and hotels, provides weather insights, and manages user bookings.

---

## 📌 Features

### **Frontend & User Experience**
* **Interactive Trip Planner**: Form-driven interface to input destination, dates, budget, and travel preferences.
* **AI Itinerary View**: Interactive display for daily itineraries, schedules, and recommended activities.
* **Map & Place Discovery**: Visual destination previews and attraction recommendations.
* **Hotel Listings & Bookings**: Explore tailored hotel stays and manage bookings.
* **User Dashboard & Profile**: Save trips, review past itineraries, and update user preferences.
* **Authentication UI**: Login and registration pages with protected routes and context-based state management.

### **Backend & AI Services**
* **AI Integration**: Custom itinerary generation powered by the Gemini API.
* **RESTful API**: Modular endpoints handling places, hotels, weather, bookings, and user inquiries.
* **Secure Auth**: JWT-based session handling and bcrypt password encryption.
* **Database Management**: Schema validation with Mongoose for users, saved trips, hotels, and bookings.

---

## 🛠️ Tech Stack

### **Frontend**
* **Library**: React 18
* **Build Tool**: Vite
* **Routing**: React Router DOM
* **State Management**: React Context API (`AuthContext`, `TripContext`)
* **Styling**: Modular CSS
* **Icons & Assets**: Custom SVG icons

### **Backend**
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
* **AI Engine**: Google Gemini API (`@google/genai` / REST)
* **Utilities**: `dotenv`, `cors`, `nodemon`

---

## 📂 Project Structure

```text
AI-Travel-Planner/
├── frontend/
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── assets/             # Images & static media
│   │   ├── components/         # Reusable UI components
│   │   │   ├── auth/           # Login/Register form components
│   │   │   ├── cards/          # Place & Hotel cards
│   │   │   ├── home/           # Hero, Assistant, HowItWorks sections
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── planner/        # TripForm, ItineraryView, MapView
│   │   ├── context/            # Global state (AuthContext, TripContext)
│   │   ├── pages/              # Routed pages (Home, Dashboard, Hotels, Places, etc.)
│   │   ├── services/           # API handlers (api.js, geminiService.js)
│   │   ├── App.jsx             # Main router configuration
│   │   └── main.jsx            # Application root
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/                 # Database connection (db.js)
│   ├── controllers/            # Route controllers (AI, Auth, Places, etc.)
│   ├── middleware/             # JWT auth & error middleware
│   ├── models/                 # Database models (User, Booking, Place, etc.)
│   ├── app.js                  # Express app setup
│   └── package.json
│
└── README.md
