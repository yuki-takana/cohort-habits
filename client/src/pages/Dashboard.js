import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast'; // <-- 1. IMPORT TOAST
import './Dashboard.css';
import Motivation from '../components/Motivation';
import { 
  FaPlus, 
  FaTasks, 
  FaFire, 
  FaUsers, 
  FaCheckCircle, 
  FaFolderOpen 
} from 'react-icons/fa';

const Dashboard = () => {
  const [cohorts, setCohorts] = useState([]); 
  const [stats, setStats] = useState({
    activeHabits: 0,
    currentStreak: 0,
    todaysProgress: 0,
    cohortsJoined: 0
  });
  const [loading, setLoading] = useState(true); 
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      try {
        // --- 2. SHOW WELCOME MESSAGE ---
        if (localStorage.getItem('justLoggedIn') && user) {
          toast.success(`Welcome back, ${user.username}!`);
          localStorage.removeItem('justLoggedIn'); // Remove the flag
        }

        // --- 3. GENERATE REMINDERS ---
        
        try {
          await axios.post('http://10.27.201.214:5000/api/notifications/generate-reminders', {}, config);
          
        } catch (err) {
          console.error("Error generating reminders", err);
        }

        // --- 4. FETCH DASHBOARD DATA ---
        const [cohortsRes, statsRes] = await Promise.all([
          axios.get('http://10.27.201.214:5000/api/cohorts/mycohorts', config),
          axios.get('http://10.27.201.214:5000/api/dashboard/stats', config)
        ]);

        setCohorts(cohortsRes.data);
        setStats(statsRes.data);

      } catch (err) {
        console.error(err.response ? err.response.data.msg : err.message);
        localStorage.removeItem('token');
        window.location.href = '/login'; 
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) { // Wait for user to be loaded
      fetchData();
    }
  }, [navigate, isAuthenticated, user]); // Add user as dependency

  if (loading || !user) {
    return (
      <div className="dashboard-container">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome back, {user.username}!</h2>
        <p>Let's build great habits today</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span>Active Habits</span>
            <FaTasks className="stat-icon" />
          </div>
          <div className="stat-card-value">{stats.activeHabits}</div>
          <div className="stat-card-footer">Tracking daily</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <span>Current Streak</span>
            <FaFire className="stat-icon" style={{ color: '#ff6b2b' }} />
          </div>
          <div className="stat-card-value">{stats.currentStreak}</div>
          <div className="stat-card-footer">Days in a row</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <span>Cohorts Joined</span>
            <FaUsers className="stat-icon" />
          </div>
          <div className="stat-card-value">{stats.cohortsJoined}</div>
          <div className="stat-card-footer">Active groups</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <span>Today's Progress</span>
            <FaCheckCircle className="stat-icon" style={{ color: '#28a745' }} />
          </div>
          <div className="stat-card-value">{stats.todaysProgress}%</div>
          <div className="stat-card-footer">Habits completed</div>
        </div>
      </div>

      <div className="dashboard-main-layout">
        <div className="main-column">
          <div className="section-header">
            <h3>Today's Habits</h3>
            <Link to="/create-cohort" className="btn-add-habit">
              <FaPlus size={12} /> Add Habit
            </Link>
          </div>
          
          <div className="habits-list">
            {cohorts.length > 0 ? (
              cohorts.map((cohort) => (
                <div key={cohort._id} className="habit-item-card">
                  <div className="habit-info">
                    <h4>{cohort.title}</h4>
                    <p>{cohort.category}</p>
                  </div>
                  <Link to={`/cohort/${cohort._id}`} className="btn-view-habit">
                    View
                  </Link>
                </div>
              ))
            ) : (
              <div className="habits-empty-state">
                <FaFolderOpen className="empty-icon" />
                <h4>No habits yet</h4>
                <p>Start building better habits today</p>
                <Link to="/create-cohort" className="btn-add-habit">
                  Create Your First Habit
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="sidebar-column">
          <div className="section-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="habits-empty-state">
            <FaUsers className="empty-icon" />
            <h4>No recent activity</h4>
          </div>
        </div>
      </div>
      <Motivation /> 
    </div>
  );
};

export default Dashboard;