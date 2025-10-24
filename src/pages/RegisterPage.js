// frontend/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect the user after successful registration

function RegisterPage() {
    // State for form inputs
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State for API feedback
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Reset errors on new submission
        setSuccess(null);

        // API call to the backend registration endpoint
        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If the server returns an error, display it
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            // If registration is successful
            setSuccess(data.message);
            
            // Optional: Redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000); // 2-second delay

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Create Your Account</h2>
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
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit">Register</button>
            </form>

            {/* Display success or error messages */}
            {success && <div className="result-container success">{success}</div>}
            {error && <div className="result-container error">{error}</div>}
        </div>
    );
}

export default RegisterPage;