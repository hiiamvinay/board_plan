import React, { useState, useEffect } from 'react';
import { generateKoupens, fetchKoupens, deleteKoupen } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [showKoupenForm, setShowKoupenForm] = useState(false);
  const [koupenCount, setKoupenCount] = useState('');
  const [activeKoupens, setActiveKoupens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateKoupen = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await generateKoupens(parseInt(koupenCount));
      const updatedKoupens = await fetchKoupens();
      setActiveKoupens(updatedKoupens);
      setShowKoupenForm(false);
    } catch (err) {
      setError('Failed to generate Koupens. Please try again.');
    } finally {
      setIsLoading(false);
      setKoupenCount('');
    }
  };

  const handleDeleteKoupen = async (code) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteKoupen(code);
      const updatedKoupens = await fetchKoupens();
      setActiveKoupens(updatedKoupens);
    } catch (err) {
      setError('Failed to delete Koupen. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadKoupens = async () => {
      setIsLoading(true);
      try {
        const data = await fetchKoupens();
        setActiveKoupens(data);
      } catch (err) {
        setError('Failed to load Koupens');
      } finally {
        setIsLoading(false);
      }
    };
    loadKoupens();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => window.location.href='/users'}>
          <h2>See Users</h2>
          <p>View and manage user accounts</p>
        </div>
        
        <div className="dashboard-card" onClick={() => setShowKoupenForm(true)}>
          <h2>Generate Koupen</h2>
          <p>Create new Koupen codes</p>
        </div>
      </div>

      {showKoupenForm && (
        <div className="koupen-form">
          <h3>Generate Koupen</h3>
          <form onSubmit={handleGenerateKoupen}>
            <input
              type="number"
              value={koupenCount}
              onChange={(e) => setKoupenCount(e.target.value)}
              placeholder="Enter number of Koupens"
              min="1"
              max="100"
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}
        </div>
      )}

      <div className="active-koupens">
        <h3>Active Koupens</h3>
        {isLoading && <div className="loading">Loading...</div>}
        <div className="koupen-list">
          {activeKoupens.map((koupen) => (
            <div key={koupen.id} className="koupen-item">
              <span className="koupen-code">{koupen.koupean_code}</span>
              <div className="koupen-id">ID: {koupen.id}</div>
              <button 
                className="delete-button"
                onClick={() => handleDeleteKoupen(koupen.koupean_code)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
