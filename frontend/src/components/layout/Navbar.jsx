import { Link, NavLink } from "react-router-dom";
import { FaPlaneDeparture, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
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

        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/register" className="signup-btn">
          Sign Up
        </Link>

        <Link to="/profile" className="profile">

          <FaUserCircle />

        </Link>

      </div>

    </header>
  );
}

export default Navbar;