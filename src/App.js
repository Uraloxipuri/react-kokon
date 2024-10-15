// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { exchangeAuthCodeForTokens, checkAuthentication } from './Authentication';
import LoginPage from './LoginPage';
import UserInterface from './UserInterface';

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode) {
      exchangeAuthCodeForTokens(authCode);
    } else {
      checkAuthentication();
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/user-interface" element={<UserInterface />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
