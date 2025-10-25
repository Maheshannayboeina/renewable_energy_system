import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import EnergyChart from '../components/EnergyChart';
import { API_BASE_URL } from '../config/apiConfig';

import { Box, Grid, Paper, Typography, TextField, Button, Alert, CircularProgress, Stack, Divider, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import EvStationIcon from '@mui/icons-material/EvStation';
import PowerIcon from '@mui/icons-material/Power';
import BalanceIcon from '@mui/icons-material/Balance';
import NotesIcon from '@mui/icons-material/Notes';
import HistoryIcon from '@mui/icons-material/History';
import DateRangeIcon from '@mui/icons-material/DateRange';


const KpiCard = ({ title, value, unit, icon, color }) => (
  <Paper elevation={0} sx={{ p: 2.5, display: 'flex', alignItems: 'center', background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`, color: 'white' }}>
    <Box sx={{ mr: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="body2">{title}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value} <span style={{ fontSize: '0.9rem' }}>{unit}</span></Typography>
    </Box>
  </Paper>
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function DashboardPage() {
    const { token } = useAuth();
    const [energyData, setEnergyData] = useState([]);
    const [generatedKwh, setGeneratedKwh] = useState('');
    const [consumedKwh, setConsumedKwh] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => setTabValue(newValue);

    const fetchEnergyData = useCallback(async () => {
      setIsLoading(true);
      let url = `${API_BASE_URL}/energy`;
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
  
      try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await response.json();
        setEnergyData(Array.isArray(data.data) ? data.data.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)) : []);
      } catch (err) { setError(err.message); } 
      finally { setIsLoading(false); }
    }, [token, startDate, endDate]);
  
    useEffect(() => { if (token) fetchEnergyData(); }, [token, fetchEnergyData]);
  
    const totals = energyData.reduce((acc, row) => {
      acc.generated += Number(row.generated_kwh || 0);
      acc.consumed += Number(row.consumed_kwh || 0);
      return acc;
    }, { generated: 0, consumed: 0 });
  
    const net = totals.generated - totals.consumed;
    const formatNumber = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setIsSubmitting(true);
      try {
        const response = await fetch(`${API_BASE_URL}/energy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ generated_kwh: parseFloat(generatedKwh), consumed_kwh: parseFloat(consumedKwh) }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setSuccess('Reading submitted!');
        setGeneratedKwh('');
        setConsumedKwh('');
        fetchEnergyData();
      } catch (err) { setError(err.message); } 
      finally {
        setIsSubmitting(false);
        setTimeout(() => setSuccess(null), 3000);
      }
    };
  
    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Dashboard</Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}><KpiCard title="Total Generated" value={formatNumber(totals.generated)} unit="kWh" icon={<EvStationIcon sx={{fontSize: 40}}/>} color="#2E7D32" /></Grid>
          <Grid item xs={12} md={4}><KpiCard title="Total Consumed" value={formatNumber(totals.consumed)} unit="kWh" icon={<PowerIcon sx={{fontSize: 40}}/>} color="#D32F2F" /></Grid>
          <Grid item xs={12} md={4}><KpiCard title="Net Energy" value={formatNumber(net)} unit="kWh" icon={<BalanceIcon sx={{fontSize: 40}}/>} color="#1976D2" /></Grid>
        </Grid>
  
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, height: '500px', display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Energy Overview</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <DateRangeIcon color="action" />
                  <TextField type="date" size="small" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }}/>
                  <TextField type="date" size="small" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }}/>
                </Stack>
              </Stack>
              <Divider sx={{ mb: 2 }}/>
              <Box sx={{ flexGrow: 1 }}>
                <EnergyChart energyData={energyData} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab icon={<NotesIcon />} iconPosition="start" label="Record New Reading" />
                  <Tab icon={<HistoryIcon />} iconPosition="start" label="Historical Data" />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={5}><TextField label="Energy Generated (kWh)" type="number" value={generatedKwh} onChange={(e) => setGeneratedKwh(e.target.value)} required fullWidth /></Grid>
                    <Grid item xs={12} sm={5}><TextField label="Energy Consumed (kWh)" type="number" value={consumedKwh} onChange={(e) => setConsumedKwh(e.target.value)} required fullWidth /></Grid>
                    <Grid item xs={12} sm={2}><Button type="submit" variant="contained" size="large" fullWidth sx={{height: '100%'}} disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : 'Submit'}</Button></Grid>
                  </Grid>
                </Box>
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader>
                    <TableHead><TableRow><TableCell>Date & Time</TableCell><TableCell align="right">Generated (kWh)</TableCell><TableCell align="right">Consumed (kWh)</TableCell></TableRow></TableHead>
                    <TableBody>
                      {energyData.slice().reverse().map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                          <TableCell align="right" sx={{ color: 'secondary.main', fontWeight: 500 }}>{formatNumber(row.generated_kwh)}</TableCell>
                          <TableCell align="right" sx={{ color: 'error.main', fontWeight: 500 }}>{formatNumber(row.consumed_kwh)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
}

export default DashboardPage;