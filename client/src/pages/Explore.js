import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Explore.css';
import { FaBook, FaDumbbell, FaBrain } from 'react-icons/fa';

// --- Pre-made Challenge Data ---
const preMadeChallenges = [
  {
    icon: <FaBook />,
    title: "30-Day Study Blitz",
    category: "Study",
    description: "Commit to studying for 60 minutes every weekday.",
    timeOfDay: "Evening",
    activeDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)), 
    motivation: "I want to pass my exams and improve my grades."
  },
  {
    icon: <FaDumbbell />,
    title: "Gym Starter Pack (3x/week)",
    category: "Fitness",
    description: "Hit the gym 3 times a week (Mon, Wed, Fri) for a month.",
    timeOfDay: "Anytime",
    activeDays: ["Monday", "Wednesday", "Friday"],
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    motivation: "I want to build a consistent workout routine."
  },
  {
    icon: <FaBrain />,
    title: "15-Min Daily Mindfulness",
    category: "Mindfulness",
    description: "Practice 15 minutes of mindfulness meditation every single day.",
    timeOfDay: "Morning",
    activeDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    motivation: "I want to reduce stress and improve my focus."
  }
];

const Explore = () => {
  const [myCohorts, setMyCohorts] = useState([]); // Your cohorts
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(null); 
  const navigate = useNavigate();

  // This fetches only your cohorts (to filter the list)
  useEffect(() => {
    const fetchMyData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const config = { headers: { 'x-auth-token': token } };

      try {
        const myRes = await axios.get('http://10.27.201.214:5000/api/cohorts/mycohorts', config);
        setMyCohorts(myRes.data);
      } catch (err) {
        console.error(err.response.data.msg);
        toast.error("Could not load your data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, [navigate]);

  // "Join" function for pre-made challenges
  const onJoinPreMade = async (challenge) => {
    setJoinLoading(challenge.title);
    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    try {
      await axios.post(
        'http://10.27.201.214:5000/api/cohorts',
        challenge, 
        config
      );
      toast.success(`Successfully joined "${challenge.title}"!`);
      navigate('/dashboard'); 
    } catch (err) {
      toast.error(err.response.data.msg);
      setJoinLoading(null); 
    }
  };

  if (loading) {
    return (
      <div className="explore-container">
        <h2>Loading challenges...</h2>
      </div>
    );
  }

  // --- "Smart" Filter ---
  const myCohortTitles = myCohorts.map(c => c.title);
  const availableChallenges = preMadeChallenges.filter(
    c => !myCohortTitles.includes(c.title)
  );

  return (
    <div className="explore-container"> 
      <h2>Explore Challenges</h2>
      <p>Find a group to join and build a new habit together.</p>

      {/* --- Pre-made Challenges Section --- */}
      <h3 className="explore-subtitle">Start with a Pre-made Challenge</h3>
      
      {availableChallenges.length > 0 ? (
        <div className="challenge-list">
          {availableChallenges.map((challenge) => (
            <div key={challenge.title} className="challenge-card">
              <div className="challenge-icon">{challenge.icon}</div>
              <h4>{challenge.title}</h4>
              <p>{challenge.description}</p>
              <button
                onClick={() => onJoinPreMade(challenge)}
                className="btn-view-cohort"
                disabled={joinLoading === challenge.title}
              >
                {joinLoading === challenge.title ? 'Joining...' : 'Join Challenge'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>You have already joined all available pre-made challenges!</p>
      )}

      {/* --- Community Cohorts Section has been removed --- */}
      
    </div>
  );
};

export default Explore;