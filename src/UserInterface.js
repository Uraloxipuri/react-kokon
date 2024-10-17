// src/UserInterface.js

import React, { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import CircleContainer from './CircleContainer';

function UserInterface() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      // Redirect to login if not authenticated
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    // Show a loading indicator while checking authentication
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CircleContainer />
    </div>
  );
}

export default UserInterface;
