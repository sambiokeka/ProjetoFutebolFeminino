import React, { useState, useEffect } from 'react';
import Popup from './Popup';

const PrivateRoute = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated) {
      setShowPopup(true);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleClose = () => {
    setShowPopup(false);
    window.location.href = '/';
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <>
      <Popup 
        isOpen={showPopup}
        onClose={handleClose}
        onLoginRedirect={handleLogin}
      />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        color: '#666',
        fontSize: '1.1rem'
      }}>
        <p>Verificando acesso...</p>
      </div>
    </>
  );
};

export default PrivateRoute;