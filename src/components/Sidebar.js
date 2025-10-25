import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import SolarPowerIcon from '@mui/icons-material/SolarPower'; // A better icon

function Sidebar({ width }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Billing', icon: <ReceiptLongIcon />, path: '/billing' },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SolarPowerIcon color="primary" sx={{ fontSize: 32 }}/>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>EcoFlow</Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={NavLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        <Button onClick={handleLogout} variant="outlined" color="secondary" fullWidth startIcon={<LogoutIcon />}>
            Logout
        </Button>
      </Box>
    </Box>
  );

  return ( <Box component="nav" sx={{ width: { sm: width }, flexShrink: { sm: 0 } }}>
      <Drawer variant="permanent" open sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
      }}>
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;