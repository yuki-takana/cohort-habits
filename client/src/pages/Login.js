import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Form.css'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [error, setError] = useState(''); // We'll keep this for form errors
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true); 

    const user = {
      email,
      password,
    };

    try {
      const res = await axios.post('http://10.27.201.214:5000/api/auth/login', user);
      
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
      <h2>Welcome Back</h2>
      <p className="form-subtitle">Log in to continue your habit journey</p>
      
      <form onSubmit={onSubmit}>
        
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
      
      <p className="form-footer-link">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;