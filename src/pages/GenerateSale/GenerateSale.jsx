import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import './GenerateSale.css';

const GenerateSale = () => {
  const { userId } = useUser();
  const [kounenCode, setKounenCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [message, setMessage] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleKounenPayment = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/sell/kounen-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, kounen_code: kounenCode })
      });
      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error("Error processing Kounen code payment:", error);
      setMessage("Payment failed. Try again.");
    }
  };

  const handleRazorpayPayment = () => {
    // Integration with Razorpay will go here
    alert("Razorpay payment feature coming soon!");
  };

  return (
    <div className="generate-sale">
      <h2>Generate Sale</h2>
      <div className="payment-options">
        <button onClick={() => setPaymentMethod('kounen')}>Pay Using Kounen Code</button>
        <button onClick={handleRazorpayPayment}>Pay Using Razorpay</button>
      </div>
      {paymentMethod === 'kounen' && (
        <div className="kounen-section">
          <input
            type="text"
            placeholder="Enter 12-digit Kounen Code"
            value={kounenCode}
            onChange={(e) => setKounenCode(e.target.value)}
            maxLength={12}
          />
          <button onClick={handleKounenPayment}>Submit</button>
        </div>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default GenerateSale;
