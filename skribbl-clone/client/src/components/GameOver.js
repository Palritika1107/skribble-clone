// src/components/GameOver.js
import React, { useState, useEffect } from 'react';
import socket from './Socket'; // Replace with your server URL

function GameOver() {
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Listen for updates on the game over status from the server
    socket.on('gameOver', (status) => {
      setGameOver(status);
    });

    socket.on('roundStart', ()=>{
      setGameOver(false)
    })

    // Cleanup function
    return () => {
      socket.off('gameOver');
      socket.off('roundStart')
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
