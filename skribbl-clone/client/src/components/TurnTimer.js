// src/components/TurnTimer.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function TurnTimer() {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Listen for updates on the timer from the server
    socket.on('turnTimer', (time) => {
      setTimeLeft(time);

      // Clear the timer when it reaches 0
      if (time === 0) {
        setTimeLeft(0);
      }
    });

    // Cleanup function
    return () => {
      socket.off('turnTimer');
    };
  }, []);

  return (
    <div>
      {timeLeft > 0 && (
        <div>
          <h2>Time Left: {timeLeft} seconds</h2>
        </div>
      )}
    </div>
  );
}

export default TurnTimer;
