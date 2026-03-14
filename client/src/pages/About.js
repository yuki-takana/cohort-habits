import React from 'react';
import './About.css'; 

const About = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <div className="about-header-content">
          <h2>About Cohort Habits</h2>
          <p>
            Building lasting habits through accountability and community support.
          </p>
        </div>
      </header>

      <div className="about-container">
        <section className="about-section">
          <h3>Our Mission</h3>
          <p>
            Cohort Habits was created to help people build lasting, positive
            habits through the power of peer support. We believe that forming
            good habits is easier when you're not doing it alone. By joining
            a group, you gain a team to keep you accountable, motivated, and
            on track.
          </p>
        </section>

        <section className="about-section">
          <h3>What This Is</h3>
          <p>
            This is a full-stack MERN (MongoDB, Express, React, Node.js)
            web application. It was built to demonstrate a rich frontend
            and backend, with features like:
          </p>
          <ul>
            <li>User Authentication (Registration & Login with JWT)</li>
            <li>Protected API Routes and Frontend Pages</li>
            <li>Database Modeling with Relationships (Users, Cohorts, Habits)</li>
            <li>A "Smart" API that creates social notifications</li>
            <li>A "Live" React UI that reacts to user state</li>
          </ul>
        </section>

        {}
        <section className="about-section">
          <h3>Meet the Team</h3>
          <p>
            This project was built by a team of 3 members.
          </p>
          <div className="team-container">
            <div className="team-member">
              SRIPADA KRISHNA
            </div>
            <div className="team-member">
            SIN ARCHBISHOP OF GLUTTONY
              <br />
              <span style={{ fontSize: '0.9rem', color: '#555' }}></span>
            </div>
            <div className="team-member">
              SRI VAMSHI
            </div>
          </div>
        </section>
        
        
      </div>
    </div>
  );
};

export default About;