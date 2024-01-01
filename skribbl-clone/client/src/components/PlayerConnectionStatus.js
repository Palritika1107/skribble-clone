// src/components/PlayerConnectionStatus.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function PlayerConnectionStatus() {
  const [playersConnected, setPlayersConnected] = useState(0);

  useEffect(() => {
    // Listen for updates on the number of players connected from the server
    socket.on('updatePlayersConnected', (count) => {
      setPlayersConnected(count);
    });

    // Cleanup function
    return () => {
      socket.off('updatePlayersConnected');
    };
  }, []);

  return (
    <div>
      <p>Players Connected: {playersConnected}</p>
    </div>
  );
}

export default PlayerConnectionStatus;
