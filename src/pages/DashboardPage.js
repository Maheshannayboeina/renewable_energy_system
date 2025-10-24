// ...existing code...
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import EnergyChart from '../components/EnergyChart';

import {
    Box, Grid, Paper, Typography, TextField, Button, Alert, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Card, CardContent, IconButton, Divider, Stack, Tooltip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';

function DashboardPage() {
    const { token } = useAuth();
    const [energyData, setEnergyData] = useState([]);
    const [generatedKwh, setGeneratedKwh] = useState('');
    const [consumedKwh, setConsumedKwh] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchEnergyData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/energy', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch energy data.');
            const data = await response.json();
            setEnergyData(Array.isArray(data.data) ? data.data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchEnergyData();
    }, [token, fetchEnergyData]);

    // Derived KPIs
    const totals = energyData.reduce((acc, row) => {
        acc.generated += Number(row.generated_kwh || 0);
        acc.consumed += Number(row.consumed_kwh || 0);
        acc.latestTimestamp = (!acc.latestTimestamp || new Date(row.timestamp) > new Date(acc.latestTimestamp)) ? row.timestamp : acc.latestTimestamp;
        return acc;
    }, { generated: 0, consumed: 0, latestTimestamp: null });

    const net = totals.generated - totals.consumed;

    const formatNumber = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const gen = parseFloat(generatedKwh);
        const con = parseFloat(consumedKwh);
        if (Number.isNaN(gen) || Number.isNaN(con)) {
            setError('Please enter valid numeric values for generated and consumed energy.');
            setTimeout(() => setError(null), 4000);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/energy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    generated_kwh: gen,
                    consumed_kwh: con,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to submit data.');
            setSuccess('Energy data recorded successfully!');
            setGeneratedKwh('');
            setConsumedKwh('');
            await fetchEnergyData();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSuccess(null), 3000);
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleExportCSV = () => {
        if (!energyData.length) return;
        const header = ['id', 'timestamp', 'generated_kwh', 'consumed_kwh'];
        const rows = energyData.map(r => [r.id, r.timestamp, r.generated_kwh, r.consumed_kwh]);
        const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `energy_data_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <CircularProgress size={64} />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">Your Energy Dashboard</Typography>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Refresh data">
                        <IconButton onClick={fetchEnergyData} size="small">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Download CSV">
                        <IconButton onClick={handleExportCSV} size="small" disabled={!energyData.length}>
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">Total Generated</Typography>
                            <Typography variant="h6" color="success.main">{formatNumber(totals.generated)} kWh</Typography>
                            <Typography variant="caption" color="text.secondary">Since first recorded</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">Total Consumed</Typography>
                            <Typography variant="h6" color="error.main">{formatNumber(totals.consumed)} kWh</Typography>
                            <Typography variant="caption" color="text.secondary">Since first recorded</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">Net (Generated - Consumed)</Typography>
                            <Typography variant="h6" sx={{ color: net >= 0 ? 'success.main' : 'error.main' }}>{formatNumber(net)} kWh</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {totals.latestTimestamp ? `Last update: ${new Date(totals.latestTimestamp).toLocaleString()}` : 'No updates yet'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                {/* Chart - full width */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, height: { xs: '300px', md: '420px' }, display: 'flex', flexDirection: 'column' }} elevation={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6">Production vs Consumption</Typography>
                            <Typography variant="caption" color="text.secondary">{energyData.length} records</Typography>
                        </Box>
                        <Divider sx={{ mb: 1 }} />
                        <Box sx={{ flexGrow: 1 }}>
                            {energyData.length > 0 ? (
                                <EnergyChart energyData={energyData} />
                            ) : (
                                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color="text.secondary">No chart data. Add a reading to populate the chart.</Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Data Entry Card */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }} elevation={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AddCircleOutlineIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Record New Data</Typography>
                        </Box>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                label="Energy Generated (kWh)"
                                type="number"
                                inputProps={{ step: '0.01', min: '0' }}
                                value={generatedKwh}
                                onChange={(e) => setGeneratedKwh(e.target.value)}
                                required
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Energy Consumed (kWh)"
                                type="number"
                                inputProps={{ step: '0.01', min: '0' }}
                                value={consumedKwh}
                                onChange={(e) => setConsumedKwh(e.target.value)}
                                required
                                fullWidth
                                margin="normal"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Submit Reading'}
                            </Button>
                        </Box>

                        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </Paper>
                </Grid>

                {/* Historical Data Table */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3 }} elevation={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <HistoryIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Historical Data</Typography>
                        </Box>
                        {energyData.length > 0 ? (
                            <TableContainer sx={{ maxHeight: 380 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date & Time</TableCell>
                                            <TableCell align="right">Generated (kWh)</TableCell>
                                            <TableCell align="right">Consumed (kWh)</TableCell>
                                            <TableCell align="right">Net (kWh)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {energyData.map((row) => {
                                            const generated = Number(row.generated_kwh || 0);
                                            const consumed = Number(row.consumed_kwh || 0);
                                            const rowNet = generated - consumed;
                                            return (
                                                <TableRow key={row.id} hover>
                                                    <TableCell sx={{ minWidth: 180 }}>{row.timestamp ? new Date(row.timestamp).toLocaleString() : '—'}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600 }}>{formatNumber(generated)}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 600 }}>{formatNumber(consumed)}</TableCell>
                                                    <TableCell align="right" sx={{ color: rowNet >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>{formatNumber(rowNet)}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography sx={{ mt: 2 }}>No energy data found. Submit a new reading to get started.</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default DashboardPage;
// ...existing code...