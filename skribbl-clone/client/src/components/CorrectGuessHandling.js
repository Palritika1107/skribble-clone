// src/components/CorrectGuessHandling.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function CorrectGuessHandling() {
  const [correctGuess, setCorrectGuess] = useState('');

  useEffect(() => {
    // Listen for updates on correct guesses from the server
    socket.on('correctGuess', (player) => {
      setCorrectGuess(`Player ${player} correctly guessed the word!`);
      
      // Clear the correct guess message after a delay
      setTimeout(() => {
        setCorrectGuess('');
      }, 5000); // Adjust the delay as needed
    });

    // Cleanup function
    return () => {
      socket.off('correctGuess');
    };
  }, []);

  return (
    <div>
      {correctGuess && (
        <div>
          <h2>Correct Guess!</h2>
          <p>{correctGuess}</p>
        </div>
      )}
    </div>
  );
}

export default CorrectGuessHandling;
