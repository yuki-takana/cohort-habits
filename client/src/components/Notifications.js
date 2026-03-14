import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token'); 

  // This function fetches unread notifications
  useEffect(() => {
   
    const fetchNotifications = async () => {
      if (!token) return; 
      const config = { headers: { 'x-auth-token': token } };
      try {
        const res = await axios.get('http://10.27.201.214:5000/api/notifications', config);
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications');
      }
    };

    fetchNotifications();
  }, [token]); 

  
  const markAsRead = async () => {
    if (notifications.length === 0) return; 

    const config = { headers: { 'x-auth-token': token } };
    try {
      await axios.post('http://10.27.201.214:5000/api/notifications/mark-read', {}, config);
      
      setNotifications([]); 
    } catch (err) {
      console.error('Error marking as read');
    }
  };

  const onOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) { 
      markAsRead();
    }
  };

  return (
    <div className="notification-bell">
      <button onClick={onOpen} className="bell-button">
        🔔 {/* Bell Icon */}
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {/* This is the dropdown menu */}
      {isOpen && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Link
                to={notification.link}
                key={notification._id}
                className="notification-item"
                onClick={() => setIsOpen(false)} 
              >
                {notification.message}
              </Link>
            ))
          ) : (
            <div className="notification-item no-notifications">
              No new notifications
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;