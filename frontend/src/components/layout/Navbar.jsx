import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaPlaneDeparture, FaUserCircle } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext.jsx";

import "./Navbar.css";

function Navbar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">

      <div className="logo">

        <Link to="/">
          <FaPlaneDeparture />
          <span>Travel Planner</span>
        </Link>

      </div>

      <nav>

        <NavLink to="/">Home</NavLink>

        <NavLink to="/hotels">Hotels</NavLink>

        <NavLink to="/places">Places</NavLink>

        <NavLink to="/features">Features</NavLink>

        <NavLink to="/about">About</NavLink>

        <NavLink to="/contact">Contact</NavLink>

      </nav>

      <div className="nav-buttons">

        {!user ? (

          <>
            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="signup-btn"
            >
              Sign Up
            </Link>
          </>

        ) : (

          <>

            <Link
              to="/dashboard"
              className="login-btn"
            >
              Dashboard
            </Link>

            <Link
              to="/profile"
              className="profile"
              title="Profile"
            >
              <FaUserCircle />
            </Link>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>

        )}

      </div>

    </header>
  );
}

export default Navbar;