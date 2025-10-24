// frontend/src/pages/BillingPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

// Import MUI components for the new UI
import {
    Box,
    Paper,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';

function BillingPage() {
    const { token } = useAuth();
    const [billingHistory, setBillingHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchBillingHistory = useCallback(async () => {
        // Don't show main loader on refresh, only initial load
        // setIsLoading(true); 
        try {
            const response = await fetch('http://127.0.0.1:5000/api/billing/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch billing history.');
            setBillingHistory(data.bills);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchBillingHistory();
    }, [token, fetchBillingHistory]);

    const handleGenerateBill = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/billing/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ year: selectedYear, month: selectedMonth })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to generate bill.');
            setSuccess(data.message);
            fetchBillingHistory(); // Refresh the history
        } catch (err) {
            setError(err.message);
        }
        setTimeout(() => setSuccess(null), 3000);
        setTimeout(() => setError(null), 5000);
    };

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(0, i).toLocaleString('default', { month: 'long' })
    }));

    return (
        <Box>
            <Typography variant="h4" gutterBottom component="h1">
                Billing Center
            </Typography>
            <Grid container spacing={3}>
                {/* Bill Generation Card */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Generate New Bill</Typography>
                        <Box component="form" onSubmit={handleGenerateBill}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="month-select-label">Month</InputLabel>
                                <Select
                                    labelId="month-select-label"
                                    value={selectedMonth}
                                    label="Month"
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    {monthOptions.map(month => (
                                        <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="year-select-label">Year</InputLabel>
                                <Select
                                    labelId="year-select-label"
                                    value={selectedYear}
                                    label="Year"
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    {yearOptions.map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                                Generate Bill
                            </Button>
                        </Box>
                        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </Paper>
                </Grid>

                {/* Billing History Card */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Billing History</Typography>
                        {billingHistory.length > 0 ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Billing Period</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Generated On</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {billingHistory.map((bill) => (
                                            <TableRow key={bill.id} hover>
                                                <TableCell component="th" scope="row">
                                                    {new Date(bill.period_start).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell align="right">${bill.amount.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: bill.is_paid ? 'success.main' : 'warning.main',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {bill.is_paid ? 'Paid' : 'Unpaid'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{new Date(bill.created_at).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography sx={{ mt: 2 }}>No billing history found. Generate a bill to get started.</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default BillingPage;