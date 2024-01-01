// src/components/Timer.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function Timer() {
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  useEffect(() => {
    let timer;

    // Listen for updates on the current round from the server
    socket.on('roundUpdate', () => {
      // Reset the timer when a new round starts
      setSecondsRemaining(60);
    });

    // Start the timer
    if (secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prevSeconds) =>
          prevSeconds > 0 ? prevSeconds - 1 : 0
        );
      }, 1000);
    }

    // Stop the timer when it reaches zero
    if (secondsRemaining === 0) {
      clearInterval(timer);
      // Automatically start a new round when the timer reaches zero
      socket.emit('correctGuess');
    }

    // Cleanup function
    return () => {
      clearInterval(timer);
      socket.off('roundUpdate');
    };
  }, [secondsRemaining]);

  return (
    <div>
      <h2>Timer</h2>
      <p>Time Remaining: {secondsRemaining} seconds</p>
    </div>
  );
}

export default Timer;
