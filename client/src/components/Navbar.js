import React, { useContext } from 'react'; // <-- Import useContext
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Notifications from './Notifications';
import AuthContext from '../context/AuthContext'; // <-- 1. IMPORT THE CONTEXT

const Navbar = () => {
  // 2. USE THE CONTEXT
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext; // Get auth state and logout function
  
  const navigate = useNavigate();

  const onLogout = () => {
    logout(); // Call the logout function from context
    navigate('/login'); // Send user to login page
  };

  // Links to show when user is LOGGED IN
  const authLinks = (
    <ul className="nav-links">
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li>
        <Link to="/explore">Explore</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        
        
        <Link to="/profile" className="navbar-username-link">
          Hi, {user ? user.username : ''}
        </Link>
      </li>
      <li>
        {}
        <a onClick={onLogout} href="#!">
          Logout
        </a>
      </li>
      <li>
        <Notifications />
      </li>
    </ul>
  );


  const guestLinks = (
    <ul className="nav-links">
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Sign Up</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <h1>
        <Link to="/">Cohort Habits</Link>
      </h1>
      
      <div className="nav-menu">
        {/* 3. The logic is now just 'isAuthenticated' */}
        {isAuthenticated ? authLinks : guestLinks}
      </div>
    </nav>
  );
};

export default Navbar;