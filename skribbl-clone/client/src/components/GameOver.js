// src/components/GameOver.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function GameOver() {
  const [gameOver, setGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState([]);

  useEffect(() => {
    // Listen for updates on game over from the server
    socket.on('gameOver', (scores) => {
      setGameOver(true);
      setFinalScores(scores);
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
          <h2>Game Over!</h2>
          <h3>Final Scores:</h3>
          <ul>
            {finalScores.map((score) => (
              <li key={score.id}>
                Player {score.id}: {score.score} points
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GameOver;
