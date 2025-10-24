// frontend/src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

function LoginPage() {
    // State for form inputs
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // State for API feedback
    const [error, setError] = useState(null);

    // Get the login function from our AuthContext
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Clear previous errors

        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If server returns an error, throw it to the catch block
                throw new Error(data.error || 'Login failed. Please check your credentials.');
            }

            // --- Use the context to handle the login ---
            // This will save the token to localStorage and update the global user state
            login(data.token);

            // Redirect the user to the homepage or a dashboard
            navigate('/'); // Redirect to home page on successful login

        } catch (err) {
            // Display any errors from the fetch or thrown error
            setError(err.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Login to Your Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            {/* Display error messages */}
            {error && <div className="result-container error">{error}</div>}
        </div>
    );
}

export default LoginPage;