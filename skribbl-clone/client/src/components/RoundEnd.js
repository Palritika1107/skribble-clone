// src/components/RoundEnd.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function RoundEnd() {
  const [roundEnd, setRoundEnd] = useState(false);
  const [winner, setWinner] = useState([]);

  useEffect(() => {
    // Listen for updates on round end from the server
    socket.on('roundEnd', (player) => {
      setRoundEnd(true);
      setWinner(player);
    });

    socket.on('roundStart',()=>{
      setRoundEnd(false)
    })

    // Cleanup function
    return () => {
      socket.off('roundEnd');
      socket.off('roundStart')
    };
  }, []);

  return (
    <div>
      {roundEnd && (
        <div>
          <h2>Round Over!</h2>
          <p>Winner: {winner}</p>
        </div>
      )}
    </div>
  );
}

export default RoundEnd;
