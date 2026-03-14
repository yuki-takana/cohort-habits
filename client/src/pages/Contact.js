import React from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import './StaticPage.css'; 
const Contact = () => {
  return (
    <div className="static-page-container">
      <div className="static-header">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you. Here's how you can reach us.</p>
      </div>
      
      <div className="static-content">
        <p>
          If you have any questions about the project, bug reports, or
          feedback, please don't hesitate to get in touch.
        </p>
        
        <div className="contact-info">
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <div className="contact-details">
              <strong>Email</strong>
              <p>cohort@gmail.com</p>
            </div>
          </div>
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <div className="contact-details">
              <strong>Phone</strong>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;