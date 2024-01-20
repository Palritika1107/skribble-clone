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

  const handleGuess = (event) => {
    // Send the player's guess to the server
    event.preventDefault();
    socket.emit('guessWord', event.target.guessedWord.value);
  };

  return (
    <div>
      <h2>Guess the Word</h2>
      <p>Current Word: {currentWord}</p>
      {/* Add UI for inputting and submitting guesses */}
      <form onSubmit={handleGuess}>
        <input
          type="text"
          placeholder="Your Guess"
          id="guessedWord"
          name="guessedWord"
        />
        <button type='submit'>Submit Guess</button>

      </form>
      
    </div>
  );
}

export default WordList;
