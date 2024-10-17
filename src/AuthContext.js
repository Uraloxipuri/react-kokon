import React, { createContext, useState, useEffect } from 'react';
import { exchangeAuthCodeForTokens } from './Authentication';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null indicates loading state

  useEffect(() => {
    const initializeAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');

      if (authCode) {
        const success = await exchangeAuthCodeForTokens(authCode);
        setIsAuthenticated(success);
        window.history.replaceState({}, document.title, process.env.REACT_APP_COGNITO_REDIRECT_URI);
      } else {
        const idToken = localStorage.getItem('id_token');
        setIsAuthenticated(!!idToken);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
