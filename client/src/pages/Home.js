import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 
// --- 1. Import Icons ---
import { FaUsers, FaRegCheckCircle, FaChartLine } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-page-container">
      {/* --- Hero Section (from your screenshot) --- */}
      <header className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">Build Habits Together</h1>
          <p className="hero-subtitle">
            Join small accountability groups, track your progress, and achieve
            your goals with the support of your cohort.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started Free
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </header>

      {/* --- How It Works Section (from your screenshot) --- */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          
          {/* --- 2. Add Icons to Steps --- */}
          <div className="step">
            <FaUsers className="step-icon" />
            <h3>1. Join Challenges</h3>
            <p>Find or create cohort challenges with like-minded individuals pursuing similar goals.</p>
          </div>
          <div className="step">
            <FaRegCheckCircle className="step-icon" />
            <h3>2. Check In Daily</h3>
            <p>Log your progress, build streaks, and see your calendar fill up with completed days.</p>
          </div>
          <div className="step">
            <FaChartLine className="step-icon" />
            <h3>3. Stay Accountable</h3>
            <p>Share updates with your cohort, climb the leaderboard, and receive encouragement from peers.</p>
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default Home;