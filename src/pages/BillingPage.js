// frontend/src/pages/BillingPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

function BillingPage() {
    const { token } = useAuth();
    const [billingHistory, setBillingHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // State for the generation form
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // State for feedback messages
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchBillingHistory = useCallback(async () => {
        setIsLoading(true);
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
        if (token) {
            fetchBillingHistory();
        }
    }, [token, fetchBillingHistory]);

    const handleGenerateBill = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/billing/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ year: selectedYear, month: selectedMonth })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to generate bill.');
            
            setSuccess(data.message);
            fetchBillingHistory(); // Refresh the history to show the new bill
        } catch (err) {
            setError(err.message);
        }
    };

    // Helper to create year options for the dropdown
    const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="dashboard-container">
            <h2>Billing Center</h2>

            {/* Bill Generation Form */}
            <div className="form-container">
                <h3>Generate New Bill</h3>
                <form onSubmit={handleGenerateBill}>
                    <div className="form-group">
                        <label>Month:</label>
                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Year:</label>
                        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                    <button type="submit">Generate Bill</button>
                </form>
                {success && <div className="result-container success">{success}</div>}
                {error && <div className="result-container error">{error}</div>}
            </div>

            {/* Billing History Table */}
            <div className="data-history-container">
                <h3>Billing History</h3>
                {isLoading ? <p>Loading history...</p> : billingHistory.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Billing Period</th>
                                <th>Amount</th>
                                <th>Generated On</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billingHistory.map(bill => (
                                <tr key={bill.id}>
                                    <td>{new Date(bill.period_start).toLocaleString('default', { month: 'long', year: 'numeric' })}</td>
                                    <td>${bill.amount.toFixed(2)}</td>
                                    <td>{new Date(bill.created_at).toLocaleDateString()}</td>
                                    <td>{bill.is_paid ? 'Paid' : 'Unpaid'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No billing history found.</p>
                )}
            </div>
        </div>
    );
}

export default BillingPage;