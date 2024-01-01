// src/components/WordList.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function WordList() {
  const [currentWord, setCurrentWord] = useState('');

  useEffect(() => {
    // Listen for updates on the current word from the server
    socket.on('currentWord', (word) => {
      setCurrentWord(word);
    });

    // Cleanup function
    return () => {
      socket.off('currentWord');
    };
  }, []);

  const handleGuess = (guess) => {
    // Send the player's guess to the server
    socket.emit('guess', guess);
  };

  return (
    <div>
      <h2>Guess the Word</h2>
      <p>Current Word: {currentWord}</p>
      {/* Add UI for inputting and submitting guesses */}
      <input
        type="text"
        placeholder="Your Guess"
        onChange={(e) => handleGuess(e.target.value)}
      />
      <button onClick={() => handleGuess()}>Submit Guess</button>
    </div>
  );
}

export default WordList;
