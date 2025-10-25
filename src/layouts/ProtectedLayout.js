import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Toolbar, Typography, Avatar, AppBar } from '@mui/material';
import Sidebar from '../components/Sidebar'; // We will create this next

const drawerWidth = 240;

function ProtectedLayout({ children }) {
  const { user } = useAuth();
  const username = user?.username ?? 'User';
  const initials = username.charAt(0).toUpperCase();

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar width={drawerWidth} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: (theme) => theme.palette.background.default,
          minHeight: '100vh'
        }}
      >
        <AppBar position="fixed" elevation={0} sx={{ 
            width: { sm: `calc(100% - ${drawerWidth}px)` }, 
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'inset 0px -1px 1px rgba(0, 0, 0, 0.05)'
        }}>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }} />
                <Typography color="text.secondary" sx={{ mr: 2 }}>
                    Welcome, {username}
                </Typography>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{initials}</Avatar>
            </Toolbar>
        </AppBar>

        {/* This Toolbar is a spacer to push content below the fixed AppBar */}
        <Toolbar /> 
        
        {/* The actual page content will be rendered here */}
        {children}
      </Box>
    </Box>
  );
}

export default ProtectedLayout;