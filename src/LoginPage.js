// src/LoginPage.js
import React from 'react';

function LoginPage() {
  const handleLogin = () => {
    window.location.href =
      'https://your-cognito-domain/login?client_id=your-client-id&response_type=code&scope=email+openid+profile&redirect_uri=your-redirect-uri/user-interface';
  };

  return (
    <div>
      <h1>Welcome to My App</h1>
      <img src="/logo.png" alt="My App Logo" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
