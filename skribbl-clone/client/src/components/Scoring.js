import React, { useEffect, useState } from 'react';
import socket from './Socket';// Replace with your server URL

function Scoring() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Listen for updates including correctWordGuess and scores from the server
    socket.on('correctWordGuess', (updatedPlayers) => {
      // Update the player scores
      console.log("player", updatedPlayers)
      setPlayers(updatedPlayers);
    });

    // Cleanup event listener on component unmount
    return () => {
      socket.off('correctWordGuess');
    };
  }, []);

  // Render UI using the players and their scores
  return (
    <div>
      <p>Players and Scores:</p>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name}: {player.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Scoring;
