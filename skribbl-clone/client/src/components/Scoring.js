// src/components/Scoring.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function Scoring() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Listen for updates on player scores from the server
    socket.on('updateScores', (updatedScores) => {
      setScores(updatedScores);
    });

    // Cleanup function
    return () => {
      socket.off('updateScores');
    };
  }, []);

  return (
    <div>
      <h2>Player Scores</h2>
      <ul>
        {scores.map((player) => (
          <li key={player.name}>
            {player.name}: {player.score} points
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Scoring;
