// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import LoginPage from './LoginPage';
import UserInterface from './UserInterface';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/user-interface" element={<UserInterface />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
