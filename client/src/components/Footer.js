import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <h3>
            
            <Link to="/">🎯 Cohort Habits</Link>
          </h3>
          <p>Build lasting habits together.</p>
        </div>

        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/explore">Challenges</Link>
            </li>
            <li>
              <Link to="/register">Get Started</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li>
              <Link to="/terms">Terms</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Cohort Habits. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;