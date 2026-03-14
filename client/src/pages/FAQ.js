import React from 'react';
import './StaticPage.css';

const FAQ = () => {
  return (
    <div className="static-page-container">
      <div className="static-header">
        <h2>Frequently Asked Questions</h2>
        <p>Have questions? We've got answers.</p>
      </div>

      <div className="static-content">
        <div className="faq-item">
          <h4>What is a "Cohort"?</h4>
          <p>
            A "cohort" is a small group of people who are all working on the
            same habit for the same period of time. It's a team to keep you
            accountable and motivated!
          </p>
        </div>

        <div className="faq-item">
          <h4>How does the streak work?</h4>
          <p>
            Your streak is the number of consecutive "active days" that you
            successfully checked in for a habit. If you miss an active day,
            your streak resets to zero. Don't worry, "off days" (like weekends,
            if you set it that way) don't count against you!
          </p>
        </div>

        <div className="faq-item">
          <h4>Is this service really free?</h4>
          <p>
            Yes! This project is 100% free. It was built as a portfolio
            project to demonstrate MERN stack development skills.
          </p>
        </div>

        <div className="faq-item">
          <h4>Can I delete a cohort I created?</h4>
          <p>
            Yes. If you are the creator of a cohort, you will see a "Danger
            Zone" on the cohort's detail page. Be careful, as deleting a
            cohort will permanently remove it for all members.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;