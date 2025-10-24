// frontend/src/components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Import the auth hook

function Navbar() {
    const { user, logout } = useAuth(); // <-- Get user state and logout function
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <nav>
            <div className="nav-left">
                <Link to="/">Home</Link> | <Link to="/billing">Billing</Link>
                {/* Show Dashboard link only if user is logged in */}
                {user && <> | <Link to="/dashboard">Dashboard</Link></>}
            </div>
            <div className="nav-right">
                {user ? (
                    // If user is logged in, show welcome message and Logout button
                    <>
                        <span>Welcome, {user.username}!</span>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                ) : (
                    // If user is not logged in, show Login and Register links
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;