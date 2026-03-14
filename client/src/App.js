import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer';
import AuthContext, { AuthProvider } from './context/AuthContext';

// --- Import all your real pages ---
import Home from './pages/Home';
import Login from './pages/Login'; 
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateCohort from './pages/CreateCohort';
import CohortDetails from './pages/CohortDetails';
import About from './pages/About';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import InterestsModal from './components/InterestsModal';

// --- Static Page Imports ---
import Contact from './pages/Contact';
import FAQ from './pages/FAQ'; // <-- FIXED (was pagescss/FAQ)
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// This is a new component that handles the logic
const AppContent = () => {
  const { isAuthenticated, user } = useContext(AuthContext); 

  const showInterestsModal = isAuthenticated && user && user.interests.length === 0;

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />
      
      {showInterestsModal && <InterestsModal />}

      <Navbar />
      
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-cohort" element={<CreateCohort />} />
          <Route path="/cohort/:id" element={<CohortDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* --- Static Routes --- */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
      
      <Footer />
    </>
  );
};

// Your main App function now just wraps everything
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;