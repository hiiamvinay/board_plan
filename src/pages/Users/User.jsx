// BoardStatus.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const BoardStatus = () => {
  const [boardStatus, setBoardStatus] = useState({
    isFull: false,
    userCount: 0,
    minId: null
  });

  useEffect(() => {
    const checkBoardStatus = async () => {
      try {
        
        const boardResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/board/get_board`);
        
        
        const countResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/board/board_count`);
        
        setBoardStatus({
          isFull: boardResponse.data.message === "Board is full",
          userCount: countResponse.data.user_count,
          minId: boardResponse.data.min_id
        });
      } catch (error) {
        console.error('Error fetching board status:', error);
      }
    };

    checkBoardStatus();
    // Poll every 30 seconds
    const interval = setInterval(checkBoardStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="board-status">
      <h2>Board Status</h2>
      <div className="status-info">
        <p>Total Users: {boardStatus.userCount}</p>
        <p>Status: {boardStatus.isFull ? 'Board is Full' : 'Board has space'}</p>
        {boardStatus.minId && <p>Minimum ID: {boardStatus.minId}</p>}
      </div>
    </div>
  );
};

export default BoardStatus;