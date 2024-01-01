// src/components/GameStatus.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function GameStatus() {
  const [gameStatus, setGameStatus] = useState(null);

  useEffect(() => {
    // Listen for updates on game status from the server
    socket.on('gameStatus', (status) => {
      setGameStatus(status);
    });

    // Cleanup function
    return () => {
      socket.off('gameStatus');
    };
  }, []);

  return (
    <div>
      {gameStatus !== null && (
        <div>
          <h2>Game Status</h2>
          <p>{gameStatus}</p>
        </div>
      )}
    </div>
  );
}

export default GameStatus;
