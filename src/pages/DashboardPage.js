// frontend/src/pages/DashboardPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import EnergyChart from '../components/EnergyChart';

function DashboardPage() {
    const { token } = useAuth(); // Get the auth token from our context

    // State for the list of energy readings
    const [energyData, setEnergyData] = useState([]);
    // State for the form inputs
    const [generatedKwh, setGeneratedKwh] = useState('');
    const [consumedKwh, setConsumedKwh] = useState('');
    
    // State for loading and feedback messages
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // useCallback ensures this function is not recreated on every render,
    // which is good practice for functions used in useEffect.
    const fetchEnergyData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/energy', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch energy data.');
            }
            const data = await response.json();
            setEnergyData(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]); // This function depends on the token

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        if (token) {
            fetchEnergyData();
        }
    }, [token, fetchEnergyData]); // Re-run if token or the function changes

    // Handler for the form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/energy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    generated_kwh: parseFloat(generatedKwh),
                    consumed_kwh: parseFloat(consumedKwh),
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit data.');
            }
            setSuccess('Energy data recorded successfully!');
            // Clear form and refetch data to show the new entry
            setGeneratedKwh('');
            setConsumedKwh('');
            fetchEnergyData(); 
        } catch (err) {
            setError(err.message);
        }
    };

    return (
      <div className="dashboard-container">
        <h2>User Dashboard</h2>

        {/* Form for submitting new data */}
        <div className="form-container">
          <h3>Record New Energy Data</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Energy Generated (kWh):</label>
              <input
                type="number"
                step="0.1"
                value={generatedKwh}
                onChange={(e) => setGeneratedKwh(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Energy Consumed (kWh):</label>
              <input
                type="number"
                step="0.1"
                value={consumedKwh}
                onChange={(e) => setConsumedKwh(e.target.value)}
                required
              />
            </div>
            <button type="submit">Submit Reading</button>
          </form>
          {success && <div className="result-container success">{success}</div>}
          {error && <div className="result-container error">{error}</div>}
        </div>

        {/* Section for displaying historical data */}
        <div className="data-history-container">
          {/* --- ADD THE CHART HERE --- */}
          {/* Only render the chart if there is data to display */}
          {!isLoading && energyData.length > 0 && (
            <div className="chart-container">
              <EnergyChart energyData={energyData} />
            </div>
          )}
          <h3>Historical Data</h3>
          {isLoading ? (
            <p>Loading data...</p>
          ) : energyData.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Generated (kWh)</th>
                  <th>Consumed (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {energyData.map((reading) => (
                  <tr key={reading.id}>
                    <td>{new Date(reading.timestamp).toLocaleString()}</td>
                    <td>{reading.generated_kwh.toFixed(2)}</td>
                    <td>{reading.consumed_kwh.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No energy data found. Submit a new reading to get started.</p>
          )}
        </div>
      </div>
    );
}

export default DashboardPage;