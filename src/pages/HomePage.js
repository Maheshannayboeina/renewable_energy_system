// ...existing code...
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';

// Import MUI components for a rich layout
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Link,
  Avatar,
  Stack,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BoltIcon from '@mui/icons-material/Bolt';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function HomePage() {
  const { user } = useAuth();
  const theme = useTheme();

  const username = user?.username ?? 'Guest';
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Box sx={{ pb: 6 }}>
      {/* Hero */}
      <Paper
        elevation={3}
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          display: 'flex',
          gap: 3,
          alignItems: 'center',
          background:
            'linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(134,239,172,0.06) 100%)',
        }}
      >
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 72,
            height: 72,
            fontSize: 28,
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {username}!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Monitor generation, track consumption, and manage billing — all from one place.
            Your system insights are a click away.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<BoltIcon />}
              component={RouterLink}
              to="/dashboard"
            >
              View Dashboard
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ReceiptIcon />}
              component={RouterLink}
              to="/billing"
            >
              Open Billing
            </Button>
            <Button
              component={RouterLink}
              to="/help"
              startIcon={<HelpOutlineIcon />}
              sx={{ alignSelf: 'center' }}
            >
              Help & Docs
            </Button>
          </Stack>
        </Box>

        <Stack spacing={1} sx={{ minWidth: 160, textAlign: 'right' }}>
          <Chip label="Live" color="success" size="small" />
          <Typography variant="caption" color="text.secondary">
            Last sync: a few seconds ago
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Quick Actions
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              component={RouterLink}
              to="/dashboard#add"
              size="small"
              variant="contained"
            >
              Add Reading
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Feature cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DashboardIcon color="primary" sx={{ fontSize: 36, mr: 2 }} />
              <Typography variant="h6">Energy Dashboard</Typography>
            </Box>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Visualize production vs consumption, inspect trends, and export your data for reporting.
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                component={RouterLink}
                to="/dashboard"
                startIcon={<BarChartIcon />}
              >
                Open Dashboard
              </Button>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/dashboard"
                onClick={() => {
                  /* optional pre-focus action */
                }}
              >
                View Chart
              </Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Chip label="Real-time chart" icon={<BoltIcon />} />
              <Chip label="CSV export" />
              <Chip label="Responsive" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ReceiptIcon color="secondary" sx={{ fontSize: 36, mr: 2 }} />
              <Typography variant="h6">Billing Center</Typography>
            </Box>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Generate monthly bills based on consumption, review past invoices, and download statements.
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                component={RouterLink}
                to="/billing"
              >
                Manage Bills
              </Button>
              <Button variant="outlined" component={RouterLink} to="/billing/history">
                Billing History
              </Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Tips:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li style={{ color: theme.palette.text.secondary }}>
                Regularly log readings for accurate billing.
              </li>
              <li style={{ color: theme.palette.text.secondary }}>
                Use CSV export to analyze data offline.
              </li>
            </ul>
          </Paper>
        </Grid>

        {/* Shortcuts / Quick Links */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1">Quick Links</Typography>
              <Link component={RouterLink} to="/settings" underline="hover">
                Settings
              </Link>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={RouterLink} to="/dashboard#reports" startIcon={<BarChartIcon />}>
                Reports
              </Button>
              <Button component={RouterLink} to="/billing/new" startIcon={<ReceiptIcon />}>
                Create Bill
              </Button>
              <Button component={RouterLink} to="/support" startIcon={<HelpOutlineIcon />}>
                Contact Support
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;
// ...existing code...