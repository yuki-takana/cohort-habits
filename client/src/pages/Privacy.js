import React from 'react';
import './StaticPage.css';

const Privacy = () => {
  return (
    <div className="static-page-container">
      <div className="static-header">
        <h2>Privacy Policy</h2>
        <p>Your privacy is important to us.</p>
      </div>

      <div className="static-content">
        <h3>1. Information We Collect</h3>
        <p>
          We only collect information you voluntarily provide to us, such as
          your username, email, and password when you register. We also
          store your user-generated content, like your cohorts, motivations,
          and habit entries.
        </p>

        <h3>2. How We Use Your Information</h3>
        <p>
          Your information is used solely to operate the Cohort Habits
          application. We use your email to identify your account. We use
          your cohort and habit data to display your progress and streaks.
        </p>

        <h3>3. Information Sharing</h3>
        <p>
          We do not share, sell, or rent your personal information with any
          third parties. This is a portfolio project, not a commercial
          enterprise. Your data (like username and check-in status) is
          only visible to other members of cohorts you are a part of.
        </p>

        <h3>4. Data Deletion</h3>
        <p>
          You can delete your cohorts at any time from the cohort details
          page. As this is a project, a full "Delete Account" feature has
          not yet been implemented.
        </p>
      </div>
    </div>
  );
};

export default Privacy;