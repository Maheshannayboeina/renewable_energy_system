import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/apiConfig';

import { Box, Paper, Typography, Button, Alert, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';

function BillingPage() {
    const { token } = useAuth();
    const [billingHistory, setBillingHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchBillingHistory = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/billing/history`, { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch billing history.');
            setBillingHistory(data.bills);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => { if (token) fetchBillingHistory(); }, [token, fetchBillingHistory]);

    const handleGenerateBill = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/billing/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ year: selectedYear, month: selectedMonth })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to generate bill.');
            setSuccess(data.message);
            fetchBillingHistory();
        } catch (err) {
            setError(err.message);
        }
        setTimeout(() => setSuccess(null), 3000);
    };

    const handlePayBill = async (billId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/billing/pay/${billId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to process payment.');
            setSuccess(data.message);
            fetchBillingHistory();
        } catch (err) {
            setError(err.message);
        }
        setTimeout(() => setSuccess(null), 3000);
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const monthOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('default', { month: 'long' }) }));

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Billing Center</Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} lg={4}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Generate New Bill</Typography>
                        <Box component="form" onSubmit={handleGenerateBill}>
                            <FormControl fullWidth margin="normal"><InputLabel>Month</InputLabel><Select value={selectedMonth} label="Month" onChange={(e) => setSelectedMonth(e.target.value)}>{monthOptions.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}</Select></FormControl>
                            <FormControl fullWidth margin="normal"><InputLabel>Year</InputLabel><Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(e.target.value)}>{yearOptions.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}</Select></FormControl>
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Generate Bill</Button>
                        </Box>
                        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={8}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Billing History</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead><TableRow><TableCell>Billing Period</TableCell><TableCell align="right">Amount</TableCell><TableCell>Status</TableCell><TableCell>Action</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {billingHistory.map((bill) => (
                                        <TableRow key={bill.id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{new Date(bill.period_start).toLocaleString('default', { month: 'long', year: 'numeric' })}</TableCell>
                                            <TableCell align="right">${bill.amount.toFixed(2)}</TableCell>
                                            <TableCell><Chip label={bill.is_paid ? 'Paid' : 'Unpaid'} color={bill.is_paid ? 'success' : 'warning'} size="small" /></TableCell>
                                            <TableCell>{!bill.is_paid && <Button variant="contained" size="small" onClick={() => handlePayBill(bill.id)}>Pay Now</Button>}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {billingHistory.length === 0 && <Typography sx={{ mt: 2, textAlign: 'center' }} color="text.secondary">No billing history found.</Typography>}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default BillingPage;