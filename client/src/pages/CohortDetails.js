import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import './CohortDetails.css';
import ProgressBar from '../components/ProgressBar'; 
import ConfirmModal from '../components/ConfirmModal'; // <-- 1. IMPORT MODAL

// --- (Helper Data & Functions) ---
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const getTotalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays + 1; 
};
const getCurrentDayNum = (startDate) => {
  const start = new Date(startDate);
  const today = new Date();
  start.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  const diffTime = Math.abs(today - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

const CohortDetails = () => {
  const [cohort, setCohort] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckinLoading, setIsCheckinLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  
  const { user, isAuthenticated } = useContext(AuthContext); 
  const { id: cohortId } = useParams();
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayName = dayNames[today.getDay()];

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };

      try {
        const cohortRes = await axios.get(
          `http://10.27.201.214:5000/api/cohorts/${cohortId}`,
          config
        );
        const entriesRes = await axios.get(
          `http://10.27.201.214:5000/api/habits/${cohortId}`,
          config
        );

        setCohort(cohortRes.data);
        setEntries(entriesRes.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response.data.msg || 'Error fetching data');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [cohortId, navigate, isAuthenticated]);

  const onCheckIn = async () => {
    setIsCheckinLoading(true);
    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    try {
      await axios.post(
        `http://10.27.201.214:5000/api/habits/checkin/${cohortId}`,
        {}, 
        config
      );
      
     
      toast.success('Check-in successful! 🎉');
      
      const newEntry = {
        user: { _id: user._id },
        cohort: cohortId,
        date: new Date().toISOString(),
        completed: true,
      };
      setEntries([...entries, newEntry]);
      setIsCheckinLoading(false);

    } catch (err) {
      toast.error(err.response.data.msg || 'Error checking in');
      setIsCheckinLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false); 
    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };
    try {
      await axios.delete(
        `http://10.27.201.214:5000/api/cohorts/${cohort._id}`,
        config
      );
      toast.success('Cohort deleted.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response.data.msg || 'Error deleting cohort');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false); 
  };
  
  if (loading || !cohort || !user) {
    return <h2 className="loading-text">Loading cohort details...</h2>;
  }
  
  // --- (Check-in Logic) ---
  const isHabitActiveToday = cohort.activeDays.includes(todayName);
  const userEntryForToday = entries.find(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entry.user._id === user._id && 
           entryDate.getTime() === today.getTime() &&
           entry.completed;
  });
  const todaysEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime() && entry.completed;
  });
  const todaysEntryUserIds = todaysEntries.map(entry => entry.user._id);

  const renderCheckinButton = () => {
   
    if (userEntryForToday) {
      return (
        <button className="btn-checkin checked-in" disabled>
          ✅ Checked In for Today!
        </button>
      );
    }
    if (isHabitActiveToday) {
      return (
        <button onClick={onCheckIn} className="btn-checkin" disabled={isCheckinLoading}>
          {isCheckinLoading ? 'Checking In...' : `Click to Check In for ${todayName}`}
        </button>
      );
    }
    return (
      <button className="btn-checkin disabled" disabled>
        Today is an "Off" Day ({todayName})
      </button>
    );
  };
  
  const totalDays = getTotalDays(cohort.startDate, cohort.endDate);
  const currentDay = getCurrentDayNum(cohort.startDate);
  const isCreator = cohort.creator === user._id;

  return (
    <> 
      <div className="cohort-details-container">
        <div className="cohort-header">
          <h2>{cohort.title}</h2>
          <p>Category: <strong>{cohort.category}</strong></p>
          <p className="active-days">
            Time: <strong>{cohort.timeOfDay}</strong> | Active: {cohort.activeDays.join(', ')}
          </p> 
          
          <div className="cohort-main-progress">
            <ProgressBar value={currentDay} max={totalDays} />
          </div>
          
          {renderCheckinButton()}
        </div>

        {cohort.description && (
          <div className="cohort-description">
            <h3>Description</h3>
            <p>{cohort.description}</p>
          </div>
        )}

        <div className="cohort-progress">
          <h3>Today's Progress</h3>
          <ProgressBar value={todaysEntries.length} max={cohort.members.length} />
          <h4 className="member-status-title">Member Status (Today):</h4>
          <ul className="member-list">
            {cohort.members.map(member => (
              <li key={member._id} className="member-item">
                <span className="member-name">{member.username}</span>
                <span className={`status ${todaysEntryUserIds.includes(member._id) ? 'status-completed' : 'status-pending'}`}>
                  {todaysEntryUserIds.includes(member._id) ? 'Completed' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {isCreator && (
          <div className="danger-zone">
            <h3>Danger Zone</h3>
            <p>Deleting this cohort will remove it for all members permanently.</p>
            {/* 5. This button now just *opens* the modal */}
            <button onClick={() => setShowDeleteModal(true)} className="btn-delete">
              Delete This Cohort
            </button>
          </div>
        )}
      </div>

      
      {showDeleteModal && (
        <ConfirmModal
          title="Are you sure?"
          message="This action cannot be undone."
          motivation={cohort.motivation}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
};

export default CohortDetails;