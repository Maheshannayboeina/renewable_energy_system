// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const { user } = useAuth();

    if (!user) {
        // If user is not logged in, redirect to the login page
        return <Navigate to="/login" />;
    }

    // If user is logged in, render the child component (the protected page)
    return children;
}

export default ProtectedRoute;