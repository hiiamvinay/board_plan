import React from 'react';
import { useUser } from '../../context/UserContext'
import './LogoutButton.css';

const LogoutButton = () => {
  const { setUserId } = useUser();

  const handleLogout = () => {
    setUserId(null);
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;