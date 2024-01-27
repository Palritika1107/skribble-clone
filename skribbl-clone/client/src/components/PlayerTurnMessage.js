// src/components/PlayerTurnMessage.js
import React, { useState, useEffect } from 'react';
import socket from './Socket'; // Replace with your server URL

function PlayerTurnMessage() {
  const [playerTurn, setPlayerTurn] = useState(null);

  useEffect(() => {
    // Listen for updates on the current player's turn from the server
    socket.on('playerTurn', ({name: playerName}) => {
      setPlayerTurn(playerName);
    });

    // Cleanup function
    return () => {
      socket.off('playerTurn');
    };
  }, []);

  return (
    <div>
      {playerTurn !== null && (
        <div>
          <h2>Player's Turn</h2>
          <p>It's Player {playerTurn}'s turn to draw!</p>
        </div>
      )}
    </div>
  );
}

export default PlayerTurnMessage;
