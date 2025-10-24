// frontend/src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // We need a library to decode the token

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    // This effect runs when the component mounts or when the token changes
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                // Decode the token to get user info (like username) and expiration
                const decodedUser = jwtDecode(storedToken);
                // Check if the token is expired
                if (decodedUser.exp * 1000 < Date.now()) {
                    logout(); // Log out if token is expired
                } else {
                    setToken(storedToken);
                    setUser(decodedUser);
                }
            } catch (error) {
                // If token is invalid, log out
                logout();
            }
        }
    }, []);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        try {
            const decodedUser = jwtDecode(newToken);
            setUser(decodedUser);
        } catch (error) {
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // The value provided to consumers of the context
    const value = { token, user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
    return useContext(AuthContext);
};