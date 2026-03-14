import React from 'react';
import './ProgressBar.css'; 

const ProgressBar = ({ value, max }) => {
  // Calculate percentage, but ensure it's between 0 and 100
  const percentage = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="progress-bar-text">
        <strong>{value}</strong> out of <strong>{max}</strong> completed
      </div>
    </div>
  );
};

export default ProgressBar;