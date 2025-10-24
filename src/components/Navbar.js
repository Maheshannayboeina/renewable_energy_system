// frontend/src/components/Navbar.js
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Link } from '@mui/material'; // <-- MUI Imports

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link component={RouterLink} to="/" color="inherit" underline="none">
                        REMS
                    </Link>
                </Typography>
                
                <Box>
                    {user ? (
                        <>
                            <Button component={RouterLink} to="/dashboard" color="inherit">Dashboard</Button>
                            <Button component={RouterLink} to="/billing" color="inherit">Billing</Button>
                            <Button onClick={handleLogout} color="inherit">Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button component={RouterLink} to="/login" color="inherit">Login</Button>
                            <Button component={RouterLink} to="/register" color="inherit">Register</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;