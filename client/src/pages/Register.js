import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Form.css'; 

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '', 
  });
  
  const [loading, setLoading] = useState(false);

  const { username, email, password, password2 } = formData;
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== password2) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true); 
    
    const newUser = { username, email, password };

    try {
      const res = await axios.post('http://10.27.201.214:5000/api/auth/register', newUser);
      
      authContext.login(res.data.token);
      
      // --- THIS IS THE NEW LINE ---
      // We set a flag to tell the dashboard to show the welcome message.
      localStorage.setItem('justLoggedIn', 'true');
      
      navigate('/dashboard');

    } catch (err) {
      toast.error(err.response.data.msg);
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <span className="form-icon">🎯</span> 
      <h2>Create an Account</h2>
      <p className="form-subtitle">Start building better habits today</p>
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="password2"
            placeholder="Confirm your password"
            value={password2}
            onChange={onChange}
            required
          />
        </div>
        
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      
      <p className="form-footer-link">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Register;