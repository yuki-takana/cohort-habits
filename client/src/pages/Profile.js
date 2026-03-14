import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Profile.css'; 
import './Dashboard.css'; 
import ProgressBar from '../components/ProgressBar';

import { FaFire, FaTasks, FaTrophy, FaUsers, FaFolderOpen } from 'react-icons/fa';

const ageRanges = ["Under 18", "18-24", "25-34", "35-44", "45-54", "55+", "Prefer not to say"];
const genderOptions = ["Male", "Female", "Non-binary", "Other", "Prefer not to say"];
const occupationOptions = ["Student", "Worker (Full-time)", "Worker (Part-time)", "Self-Employed", "Unemployed", "Other", "Prefer not to say"];

const Profile = () => {
  const { user, loadUser, isAuthenticated } = useContext(AuthContext);
  
  // State for the "gamified" stats
  const [stats, setStats] = useState(null);
  // State for the list of cohorts in the "My Habits" tab
  const [myCohorts, setMyCohorts] = useState([]);
  // State for the active tab
  const [activeTab, setActiveTab] = useState('achievements');
  // State for the "Settings" form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    age: '',
    gender: '',
    occupation: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // --- This effect fetches ALL data for the profile page ---
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login'; // Redirect if not logged in
      return;
    }
    if (user) {
      // 1. Set the form data
      setFormData({
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        age: user.age || '',
        gender: user.gender || '',
        occupation: user.occupation || ''
      });
      
      // 2. Fetch the stats and cohort list
      const fetchData = async () => {
        const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
        try {
          const [statsRes, cohortsRes] = await Promise.all([
            axios.get('http://10.27.201.214:5000/api/users/stats', config),
            axios.get('http://10.27.201.214:5000/api/cohorts/mycohorts', config)
          ]);
          setStats(statsRes.data);
          setMyCohorts(cohortsRes.data);
        } catch (err) {
          toast.error('Could not load profile data.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user, isAuthenticated]);

  const onFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- This is the "Save Changes" function for the Settings tab ---
  const onFormSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    const { username, bio, age, gender, occupation } = formData;
    const updatedData = { username, bio };
    if (!user.age && age) updatedData.age = age;
    if (!user.gender && gender) updatedData.gender = gender;
    if (!user.occupation && occupation) updatedData.occupation = occupation;

    try {
      await axios.put('http://10.27.201.214:5000/api/users/profile', updatedData);
      toast.success('Profile updated successfully!');
      setSaveLoading(false);
      loadUser(); // Tell context to get new user info
    } catch (err) {
      toast.error(err.response.data.msg || 'Server Error');
      setSaveLoading(false);
    }
  };

  // This renders the content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'achievements':
        return <div className="habits-empty-state"><FaTrophy className="empty-icon" /><h4>Achievements Coming Soon!</h4><p>Complete cohorts to unlock new achievements.</p></div>;
      case 'habits':
        return (
          <div className="habits-list">
            {myCohorts.length > 0 ? (
              myCohorts.map((cohort) => (
                <div key={cohort._id} className="habit-item-card">
                  <div className="habit-info">
                    <h4>{cohort.title}</h4>
                    <p>{cohort.category}</p>
                  </div>
                  <Link to={`/cohort/${cohort._id}`} className="btn-view-habit">View</Link>
                </div>
              ))
            ) : (
              <div className="habits-empty-state"><FaFolderOpen className="empty-icon" /><h4>No Active Habits</h4><p>Go to the Explore page to join a new cohort!</p></div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="settings-form-container">
            <form onSubmit={onFormSubmit}>
              <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} disabled /></div>
              <div className="form-group"><label>Username</label><input type="text" name="username" value={formData.username} onChange={onFormChange} required /></div>
              <div className="form-group"><label>Your Bio (max 200 characters)</label><textarea name="bio" placeholder="Tell everyone..." value={formData.bio} onChange={onFormChange} rows="4" maxLength="200"></textarea></div>
              <div className="profile-grid-group">
                <div className="form-group"><label>Age (Set Once)</label>{user.age ? (<p className="form-value-locked">{user.age}</p>) : (<select name="age" value={formData.age} onChange={onFormChange} required><option value="" disabled>-- Select Age --</option>{ageRanges.map(val => <option key={val} value={val}>{val}</option>)}</select>)}</div>
                <div className="form-group"><label>Gender (Set Once)</label>{user.gender ? (<p className="form-value-locked">{user.gender}</p>) : (<select name="gender" value={formData.gender} onChange={onFormChange} required><option value="" disabled>-- Select Gender --</option>{genderOptions.map(val => <option key={val} value={val}>{val}</option>)}</select>)}</div>
              </div>
              <div className="form-group"><label>Occupation (Set Once)</label>{user.occupation ? (<p className="form-value-locked">{user.occupation}</p>) : (<select name="occupation" value={formData.occupation} onChange={onFormChange} required><option value="" disabled>-- Select Occupation --</option>{occupationOptions.map(val => <option key={val} value={val}>{val}</option>)}</select>)}</div>
              <button type="submit" className="form-button" disabled={saveLoading}>{saveLoading ? 'Saving...' : 'Save Changes'}</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading || !user || !stats) {
    return <h2 className="loading-text">Loading Profile...</h2>;
  }

  return (
    <div className="profile-page-container">
      {/* --- 1. Profile Header --- */}
      <div className="profile-header">
        <div className="profile-pic-placeholder">
          <span>{user.username.charAt(0).toUpperCase()}</span>
        </div>
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
        </div>
        <div className="profile-level-badges">
          <span className="level-badge">Level {stats.level}</span>
          <span className="level-badge points">{stats.totalXp} XP</span>
        </div>
      </div>

      {/* --- 2. Profile Stats Grid --- */}
      <div className="profile-stats-grid">
        <div className="stat-card"><div className="stat-card-header"><span>Active Habits</span><FaTasks className="stat-icon" /></div><div className="stat-card-value">{stats.activeHabits}</div><div className="stat-card-footer">of {stats.totalCohortsJoined} total</div></div>
        <div className="stat-card"><div className="stat-card-header"><span>Longest Streak</span><FaFire className="stat-icon" style={{ color: '#ff6b2b' }} /></div><div className="stat-card-value">{stats.longestStreak}</div><div className="stat-card-footer">days</div></div>
        <div className="stat-card"><div className="stat-card-header"><span>Total Completions</span><FaTrophy className="stat-icon" style={{ color: '#ffc107' }} /></div><div className="stat-card-value">{stats.totalCompletions}</div><div className="stat-card-footer">all time</div></div>
        <div className="stat-card"><div className="stat-card-header"><span>Cohorts</span><FaUsers className="stat-icon" /></div><div className="stat-card-value">{stats.totalCohortsJoined}</div><div className="stat-card-footer">joined</div></div>
      </div>

      {/* --- 3. Level Progress --- */}
      <div className="level-progress-container">
        <div className="level-progress-header">
          <h3>Level {stats.level} Progress</h3>
          <span>{stats.currentLevelXp} / {stats.xpForNextLevel} XP</span>
        </div>
        <ProgressBar value={stats.currentLevelXp} max={stats.xpForNextLevel} />
        <p>{stats.xpForNextLevel - stats.currentLevelXp} more XP to reach Level {stats.level + 1}</p>
      </div>

      {/* --- 4. Content Tabs --- */}
      <div className="profile-tabs">
        <button className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}>Achievements</button>
        <button className={`tab-button ${activeTab === 'habits' ? 'active' : ''}`} onClick={() => setActiveTab('habits')}>My Habits</button>
        <button className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
      </div>
      <div className="profile-tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;