// src/components/RoundEnd.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function RoundEnd() {
  const [roundEnd, setRoundEnd] = useState(false);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    // Listen for updates on round end from the server
    socket.on('roundEnd', (roundWinners) => {
      setRoundEnd(true);
      setWinners(roundWinners);
    });

    // Cleanup function
    return () => {
      socket.off('roundEnd');
    };
  }, []);

  return (
    <div>
      {roundEnd && (
        <div>
          <h2>Round Over!</h2>
          <p>Winners:</p>
          <ul>
            {winners.map((winner) => (
              <li key={winner}>{winner}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RoundEnd;
