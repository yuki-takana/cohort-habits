import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import './InterestsModal.css';

// These are the categories the user can pick
const categories = [
  "Fitness",
  "Study",
  "Productivity",
  "Mindfulness",
  "Health",
  "Creative",
  "Finance",
  "Social"
];

const InterestsModal = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loadUser } = useContext(AuthContext);

  // This function handles clicking on a category
  const toggleInterest = (category) => {
    if (selectedInterests.includes(category)) {
      
      setSelectedInterests(selectedInterests.filter((i) => i !== category));
    } else {
      
      setSelectedInterests([...selectedInterests, category]);
    }
  };

  
  const onSaveInterests = async () => {
    if (selectedInterests.length === 0) {
      return toast.error('Please select at least one interest.');
    }
    
    setLoading(true);
    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    try {
      await axios.put(
        'http://10.27.201.214:5000/api/users/profile',
        { interests: selectedInterests }, // We send only the interests
        config
      );
      
      toast.success('Preferences saved!');
      loadUser(); // This will reload the user data and hide the modal
      
    } catch (err) {
      toast.error('Could not save interests. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="interests-modal-content">
        <h2>Welcome to Cohort Habits!</h2>
        <p>What are you interested in? Select a few categories so we can personalize your experience.</p>
        
        <div className="interests-grid">
          {categories.map((category) => (
            <button
              key={category}
              className={`interest-button ${selectedInterests.includes(category) ? 'selected' : ''}`}
              onClick={() => toggleInterest(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <button 
          className="btn-modal btn-confirm" 
          onClick={onSaveInterests} 
          disabled={loading}
          style={{ width: '100%', marginTop: '20px' }} // Quick style
        >
          {loading ? 'Saving...' : 'Save and Continue'}
        </button>
      </div>
    </div>
  );
};

export default InterestsModal;