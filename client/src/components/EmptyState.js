import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa'; // Import icons
import './EmptyState.css'; 

const EmptyState = () => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">
        {}
        <span>🎯</span>
      </div>
      <h3 className="empty-state-title">Your Dashboard is Empty</h3>
      <p className="empty-state-message">
        It looks like you haven't joined any cohorts yet. Get started by
        creating your own or exploring public ones.
      </p>
      <div className="empty-state-actions">
        <Link to="/create-cohort" className="btn-primary-empty">
          <FaPlus /> Create a Cohort
        </Link>
        <Link to="/explore" className="btn-secondary-empty">
          <FaSearch /> Explore Cohorts
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;