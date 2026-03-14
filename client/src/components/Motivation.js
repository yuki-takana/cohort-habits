import React from 'react';
import './Motivation.css'; 
// A simple list of quotes.
const quotes = [
  "The secret of getting ahead is getting started.",
  "Don't wish for it. Work for it.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Discipline is the bridge between goals and accomplishment.",
  "A little progress each day adds up to big results.",
  "You don't have to be great to start, but you have to start to be great.",
  "The journey of a thousand miles begins with a single step."
];

const Motivation = () => {
  // This logic gets the day of the year (0-365)
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  // This uses the day of the year to pick a "random" but consistent quote
  const quoteIndex = dayOfYear % quotes.length;
  const quote = quotes[quoteIndex];

  return (
    <div className="motivation-container">
      <p className="motivation-title">💡 Daily Motivation</p>
      <p className="motivation-quote">"{quote}"</p>
    </div>
  );
};

export default Motivation;