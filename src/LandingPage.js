import React from "react";

function LandingPage({ goToLogin, goToSignup }) {
  return (
    <div className="landing-container">

      <div className="landing-content">
        <img
          src="/Logo.png"
          alt="Student Web Portal"
          className="landing-logo"
        />

        <h1 className="landing-title">
          Student Web Portal
        </h1>

        <p className="landing-subtitle">
          Track. Manage. Showcase Achievements.
        </p>

        <div className="landing-buttons">
          <button className="btn-login" onClick={goToLogin}>
            Login
          </button>

          <button className="btn-signup" onClick={goToSignup}>
            Sign Up
          </button>
        </div>
      </div>

    </div>
  );
}

export default LandingPage;