// src/components/PlayerList.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function PlayerList() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Listen for updates on the player list from the server
    socket.on('updatePlayerList', (playerList) => {
      setPlayers(playerList);
    });

    // Cleanup function
    return () => {
      socket.off('updatePlayerList');
    };
  }, []);

  return (
    <div>
      <h2>Players List</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerList;
