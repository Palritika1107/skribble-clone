// src/components/GameOver.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function GameOver() {
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Listen for updates on the game over status from the server
    socket.on('gameOver', (status) => {
      setGameOver(status);
    });

    // Cleanup function
    return () => {
      socket.off('gameOver');
    };
  }, []);

  return (
    <div>
      {gameOver && (
        <div>
          <h2>Game Over</h2>
          <p>The game has ended. Thank you for playing!</p>
        </div>
      )}
    </div>
  );
}

export default GameOver;
