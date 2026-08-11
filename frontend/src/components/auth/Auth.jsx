import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";
import "./Auth.css";

function Auth({ register }) {
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

            <form onSubmit={(e) => e.preventDefault()}>

              {register && (
                <label>
                  Full Name
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </label>
              )}

              <label>
                Email Address
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </label>

              <button type="submit">
                {register ? "Create Account" : "Login"}
              </button>

            </form>

            <p>
              {register ? "Already have an account? " : "New here? "}

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