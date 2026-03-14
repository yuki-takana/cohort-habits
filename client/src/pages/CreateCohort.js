import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker'; 
import "react-datepicker/dist/react-datepicker.css";
import toast from 'react-hot-toast'; // <-- 1. IMPORT
import './Form.css';

// ... (categories, daysOfWeek, dayNames, timeOptions variables stay the same) ...
const categories = [
  "Fitness",
  "Study",
  "Productivity",
  "Mindfulness",
  "Health",
  "Creative",
  "Finance",
  "Other"
];
const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeOptions = ['Anytime', 'Morning', 'Afternoon', 'Evening'];


const CreateCohort = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [activeDays, setActiveDays] = useState([]);
  const [startDate, setStartDate] = useState(new Date()); 
  const [endDate, setEndDate] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('Anytime');
  const [motivation, setMotivation] = useState('');
  const [description, setDescription] = useState('');
  
  // const [error, setError] = useState(''); // <-- No longer needed
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const onDayChange = (dayName) => {
    if (activeDays.includes(dayName)) {
      setActiveDays(activeDays.filter((day) => day !== dayName));
    } else {
      setActiveDays([...activeDays, dayName]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // 2. Use toast for validation
    if (!title || !category || !endDate || activeDays.length === 0) {
      return toast.error('Please fill out Title, Category, Active Days, and End Date.');
    }
    if (new Date(endDate) < new Date(startDate)) {
      return toast.error('End date must be after the start date.');
    }
    
    setLoading(true);
    const token = localStorage.getItem('token');
    
    const config = {
      headers: { 'x-auth-token': token },
    };

    const cohortData = {
      title,
      description,
      category,
      activeDays,
      startDate,
      endDate,
      timeOfDay,
      motivation
    };

    try {
      await axios.post(
        'http://10.27.201.214:5000/api/cohorts',
        cohortData,
        config
      );
      
      // 3. Your "Congrats!" pop-up!
      toast.success('Cohort created successfully! 🎉');
      navigate('/dashboard'); 

    } catch (err) {
      // 4. Use toast for errors
      toast.error(err.response.data.msg);
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create a New Cohort</h2>
      <form onSubmit={onSubmit}>
        {/* Error box is no longer needed */}

        <div className="form-group">
          <label>Cohort Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., 21-Day Code Challenge"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select 
            name="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>-- Select a Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="date-range-group">
          <div className="form-group">
            <label>Start Date</label>
            <div className="date-picker-wrapper">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                wrapperClassName="date-picker-wrapper"
              />
            </div>
          </div>
          <div className="form-group">
            <label>End Date</label>
            <div className="date-picker-wrapper">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Select an end date"
                wrapperClassName="date-picker-wrapper"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label className="day-picker-label">Select Active Days</label>
          <div className="day-picker">
            {dayNames.map((dayName, index) => (
              <label key={dayName} className="day-checkbox">
                <input
                  type="checkbox"
                  value={dayName}
                  checked={activeDays.includes(dayName)}
                  onChange={() => onDayChange(dayName)}
                />
                <span>{daysOfWeek[index]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Time of Day</label>
          <select 
            name="timeOfDay" 
            value={timeOfDay} 
            onChange={(e) => setTimeOfDay(e.target.value)}
          >
            {timeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Your Motivation (Why are you starting this?)</label>
          <textarea
            name="motivation"
            placeholder="e.g., 'I want to feel healthier and have more energy.'"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea
            name="description"
            placeholder="What is this cohort about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          ></textarea>
        </div>
        
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Cohort'}
        </button>
      </form>
    </div>
  );
};

export default CreateCohort;