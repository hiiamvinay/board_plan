// Updated JSX with new classnames
import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import './GenerateSale.css';

const GenerateSale = () => {
  const { userId } = useUser();
  const [kounenCode, setKounenCode] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const validatePhone = (phone) => /^[1-9]\d{9}$/.test(phone);
  const validateKounenCode = (code) => code.length === 12;

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
  };

  const handleKounenPayment = async () => {
    if (!buyerName.trim()) {
      setMessage('Please enter buyer name');
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setMessage('Please enter valid 10-digit phone number');
      return;
    }

    if (!validateKounenCode(kounenCode)) {
      setMessage('Kounen code must be 12 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/sell/kounen-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          kounen_code: kounenCode,
          buyer_name: buyerName,
          buyer_phone: `+91${phoneNumber}`
        })
      });
      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error("Error processing Kounen code payment:", error);
      setMessage("Payment failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="generate-sale-container">
      <div className="generate-sale-card">
        <h2>Generate Sale</h2>
        <div className="generate-sale-section">
          <div className="generate-sale-input-group">
            <label>Buyer Name</label>
            <input
              type="text"
              placeholder="Enter buyer's full name"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className={buyerName.trim() ? 'valid' : ''}
            />
            <span className="generate-sale-input-icon">👤</span>
          </div>
          
          <div className="generate-sale-input-group generate-sale-phone-input">
            <label>Phone Number</label>
            <div className="generate-sale-phone-field">
              <span className="generate-sale-prefix">+91</span>
              <input
                type="tel"
                placeholder="10-digit number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                maxLength="10"
                className={validatePhone(phoneNumber) ? 'valid' : ''}
              />
              <span className="generate-sale-input-icon">📱</span>
            </div>
          </div>

          <div className="generate-sale-input-group">
            <label>Kounen Code</label>
            <input
              type="text"
              placeholder="Enter 12-character code"
              value={kounenCode}
              onChange={(e) => setKounenCode(e.target.value)}
              maxLength="12"
              className={kounenCode && validateKounenCode(kounenCode) ? 'valid' : ''}
            />
            <span className="generate-sale-char-counter">{kounenCode.length}/12</span>
            <span className="generate-sale-input-icon">🔑</span>
          </div>

          <button 
            onClick={handleKounenPayment}
            disabled={isLoading}
            className={`generate-sale-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Process Payment'}
          </button>
        </div>
        {message && (
          <div className={`generate-sale-message ${message.includes('failed') ? 'error' : 'success'}`}>
            <span className="generate-sale-message-icon">
              {message.includes('failed') ? '❌' : '✅'}
            </span>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateSale;