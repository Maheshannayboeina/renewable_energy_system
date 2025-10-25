import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './layouts/ProtectedLayout'; // <-- Import new layout

// Import Pages
import HomePage from './pages/HomePage'; // We will remove this later if not needed
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BillingPage from './pages/BillingPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LoginPage />} /> 
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes wrapped in the new sexy layout */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><ProtectedLayout><DashboardPage /></ProtectedLayout></ProtectedRoute>} 
      />
      <Route 
        path="/billing" 
        element={<ProtectedRoute><ProtectedLayout><BillingPage /></ProtectedLayout></ProtectedRoute>} 
      />
    </Routes>
  );
}

export default App;