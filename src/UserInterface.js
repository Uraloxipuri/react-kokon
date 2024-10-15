// src/UserInterface.js
import React, { useEffect } from 'react';
import CircleContainer from './CircleContainer';

function UserInterface() {
  useEffect(() => {
    const idToken = localStorage.getItem('id_token');
    if (!idToken) {
      // Redirect to login if not authenticated
      window.location.href =
        'https://your-cognito-domain/login?client_id=your-client-id&response_type=code&scope=email+openid+profile&redirect_uri=your-redirect-uri/user-interface';
    }
  }, []);

  return (
    <div>
      <CircleContainer />
    </div>
  );
}

export default UserInterface;
