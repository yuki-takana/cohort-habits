import React from 'react';
import './StaticPage.css';

const Terms = () => {
  return (
    <div className="static-page-container">
      <div className="static-header">
        <h2>Terms of Service</h2>
        <p>Please read these terms carefully.</p>
      </div>

      <div className="static-content">
        <h3>1. Acceptance of Terms</h3>
        <p>
          By creating an account and using the Cohort Habits application ("Service"),
          you agree to be bound by these Terms of Service. This is a
          portfolio project and is offered "as-is" without any warranties.
        </p>

        <h3>2. User Conduct</h3>
        <p>
          You agree to use the Service only for its intended purpose of habit
          tracking and social motivation. You agree not to use the service
          to post any content that is unlawful, harmful, or abusive.
        </p>

        <h3>3. Limitation of Liability</h3>
        <p>
          This Service is provided for educational and demonstrative purposes.
          The creators are not liable for any data loss, service
          interruption, or damages that may occur from using this
          application.
        </p>
      </div>
    </div>
  );
};

export default Terms;