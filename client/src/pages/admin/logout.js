// LogoutPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './logout.css'

const LogoutPage = () => {
  const navigate = useNavigate(); // Use useNavigate for navigation

  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/'); // Replace '/admin' with the path of your desired page after logout
  };

  return (
    <div className="logout-page">
      <h2>Are you sure you want to logout?</h2>
      <div className="logout-button" style={{  marginBottom: "30px" }}>
        <button   onClick={() => setConfirmLogout(true)}>Yes</button> 
        </div>
        <div className="logout-button">
        <button onClick={() => navigate(-1)}>No</button>
      </div>
      {confirmLogout && (
        <div className="confirm-logout">
          <p>Confirming logout...</p>
          {/* Calling handleLogout function to perform the logout action */}
          {handleLogout()}
        </div>
      )}
    </div>
  );
};

export default LogoutPage;
