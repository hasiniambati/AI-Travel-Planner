import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Hotels from "./pages/Hotels/Hotels";
import TouristPlaces from "./pages/Places/TouristPlaces";
import Planner from "./pages/Planner/Planner";
import TripResult from "./pages/TripResult/TripResult";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import Dashboard from "./pages/Dashboard/Dashboard";
import Features from "./pages/Features/Features";

import ProtectedRoute from "./components/ProtectedRoute";
import Assistant from "./components/home/Assistant";

import "./App.css";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/hotels" element={<Hotels />} />

        <Route path="/places" element={<TouristPlaces />} />

        <Route path="/planner" element={<Planner />} />

        <Route path="/trip-result" element={<TripResult />} />

        <Route path="/features" element={<Features />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
      <Assistant />
    </BrowserRouter>
  );
}


export default App;