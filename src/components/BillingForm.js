// frontend/src/components/BillingForm.js

import React, { useState } from 'react';

function BillingForm() {
    // useState hooks to manage component state
    const [consumption, setConsumption] = useState(''); // Holds the value of the input field
    const [result, setResult] = useState(null);       // Holds the successful API response
    const [error, setError] = useState(null);         // Holds any error message from the API

    const handleSubmit = async (event) => {
        // This function is called when the form is submitted
        event.preventDefault(); // Prevents the browser from reloading the page
        
        // Reset previous results and errors
        setResult(null);
        setError(null);

        try {
            // Call our backend API endpoint
            const response = await fetch('http://127.0.0.1:5000/api/billing/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send the consumption value in the request body
                body: JSON.stringify({ consumed_kwh: parseFloat(consumption) }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If the server returns an error (like 400), handle it
                throw new Error(data.error || 'Something went wrong');
            }

            // If the call was successful, store the result
            setResult(data);

        } catch (err) {
            // If there was an error, store the error message
            setError(err.message);
        }
    };

    return (
        <div className="billing-form-container">
            <h2>Calculate Your Bill</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Energy Consumed (kWh):</label>
                    <input
                        type="number"
                        value={consumption}
                        onChange={(e) => setConsumption(e.target.value)}
                        placeholder="e.g., 100"
                        required
                    />
                </div>
                <button type="submit">Calculate</button>
            </form>

            {/* Conditionally render the result or error message */}
            {result && (
                <div className="result-container success">
                    <h3>Calculation Successful</h3>
                    <p>Calculated Bill Amount: ${result.calculated_bill_amount.toFixed(2)}</p>
                </div>
            )}

            {error && (
                <div className="result-container error">
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

export default BillingForm;