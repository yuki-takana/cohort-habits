import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider (a component that wraps our app)
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
  });

  // This function will load the user data as soon as the app loads
  // This replaces the logic that was in your Navbar
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set the auth header for all future axios requests
      axios.defaults.headers.common['x-auth-token'] = token;
      try {
        const res = await axios.get('http://10.27.201.214:5000/api/users/me');
        setAuth({
          token: token,
          isAuthenticated: true,
          loading: false,
          user: res.data,
        });
      } catch (err) {
        // If token is bad, remove it
        localStorage.removeItem('token');
        setAuth({
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
        });
      }
    } else {
      setAuth({
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      });
    }
  };

  // Run loadUser once on app load
  useEffect(() => {
    loadUser();
  }, []);

  // Login function
  const login = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['x-auth-token'] = token;
    loadUser(); // Reload user data after login
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setAuth({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        loadUser,
      }}
    >
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;