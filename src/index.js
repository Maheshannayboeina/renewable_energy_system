// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <-- IMPORT

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* <-- WRAP a */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider> {/* <-- WRAP b */}
  </React.StrictMode>
);