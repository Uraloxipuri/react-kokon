import React, { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/user-interface');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.REACT_APP_COGNITO_REDIRECT_URI);
    const cognitoDomain = process.env.REACT_APP_COGNITO_DOMAIN;

    window.location.href = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${redirectUri}`;
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to My App</h1>
      <img src="/logo.png" alt="My App Logo" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
