import React, { useState, useEffect } from 'react';
import LogoutButton from '../../components/Logout/LogoutButton';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Home = () => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [salesData, setSalesData] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (userId) {
      fetchSalesData();
    }
  }, [userId]);

  const fetchSalesData = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/sell/sales/${userId}`);
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const generateSale = () => {
    navigate('/sell');
  };

  return (
    <>
      <div className='logout'>
        <LogoutButton />
      </div>
      <div className='home'>
        {salesData && (
          <>
            <h1 className='welcome_heading'>Welcome, {salesData.name}! 👋</h1>
            <h2 className='level_heading'>Your Current Level: {salesData.level} 🚀</h2>

            <h2 className='sell_heading'>Sales Done This Month: {salesData.sales_done}</h2>
            {/*  
            <h2 className='sell_heading'>Sales Required for Next Level: {salesData.sales_needed_for_next_level}</h2>
            */}
            <h2 className='sell_heading'>
              {salesData.sales_needed_for_salary === -1
                ? "Upgrade the level for salary 🎉"
                : `Sales Required for Salary: ${salesData.sales_needed_for_salary}`}
            </h2>
            <button className='sell_button' onClick={generateSale}>Generate Sale</button>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
