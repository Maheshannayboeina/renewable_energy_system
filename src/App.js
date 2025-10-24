// frontend/src/App.js
import './App.css';
import { Routes, Route } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BillingPage from './pages/BillingPage'; // <-- IMPORT THE NEW BILLING PAGE

function App() {
  return (
    <div className="App-container">
      <Navbar /> {/* Use the Navbar for navigation */}
      
      <main className="App-content">
        <Routes>
          {/* Public Routes - Accessible to everyone */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - Accessible only to logged-in users */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/billing" 
            element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;