// src/components/RestartGame.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function RestartGame() {
  const [showRestartButton, setShowRestartButton] = useState(false);

  useEffect(() => {
    // Listen for updates on whether to show the restart button from the server
    socket.on('showRestartButton', (show) => {
      setShowRestartButton(show);
    });

    socket.on('roundStart',()=>{
      setShowRestartButton(false)
    })

    // Cleanup function
    return () => {
      socket.off('showRestartButton');
      socket.off('roundStart')
    };
  }, []);

  const handleRestartGame = () => {
    // Emit a request to restart the game to the server
    socket.emit('restartGame');
  };

  return (
    <div>
      {showRestartButton && (
        <div>
          <button onClick={handleRestartGame}>Restart Game</button>
        </div>
      )}
    </div>
  );
}

export default RestartGame;
