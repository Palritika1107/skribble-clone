// src/components/CorrectGuessHandling.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function CorrectGuessHandling() {
  const [correctGuess, setCorrectGuess] = useState('');

  useEffect(() => {
    // Listen for updates on correct guesses from the server
    socket.on('updateCorrectGuess', (guess) => {
      setCorrectGuess(guess);
    });

    // Cleanup function
    return () => {
      socket.off('updateCorrectGuess');
    };
  }, []);

  return (
    <div>
      {correctGuess && (
        <div>
          <h2>Correct Guess</h2>
          <p>{correctGuess}</p>
        </div>
      )}
    </div>
  );
}

export default CorrectGuessHandling;
