import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../layout/Navbar";
import { useAuth } from "../../context/AuthContext.jsx";

import "./Auth.css";

function Auth({ register }) {
  const navigate = useNavigate();
  const { login, register: registerUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (register) {
        await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        navigate("/dashboard");
      } else {
        await login({
          email: formData.email,
          password: formData.password
        });

        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="form-page">
        <div className="auth-container">

          <div className="form-header">
            <h2>
              {register ? "Create Your Account" : "Welcome Back"}
            </h2>

            <p>
              {register
                ? "Sign up and save your future travel plans."
                : "Login to continue your travel planning journey."}
            </p>
          </div>

          <div className="simple-form auth-form">
            <h3>{register ? "Sign Up" : "Login"}</h3>

            <form onSubmit={handleSubmit}>

              {register && (
                <label>
                  Full Name

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
              )}

              <label>
                Email Address

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Password

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </label>

              {error && (
                <p className="auth-error">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : register
                  ? "Create Account"
                  : "Login"}
              </button>

            </form>

            <p>
              {register
                ? "Already have an account? "
                : "New here? "}

              <Link to={register ? "/login" : "/register"}>
                {register ? "Login" : "Create an account"}
              </Link>
            </p>

          </div>

        </div>
      </section>
    </>
  );
}

export default Auth;