// src/components/WordList.js
import React, { useState, useEffect } from 'react';
import socket from './Socket'; // Replace with your server URL

function WordList() {
  // const [currentWord, setCurrentWord] = useState('');
  //const [guessValue, setGuessValue] = useState('');

  const handleGuess = (event) => {
    // Send the player's guess to the server
    event.preventDefault();
    console.log(socket)
    socket.emit('guessWord', event.target.guessedWord.value);
    // setGuessValue('')
  };
  
  

  return (
    <div>
      <h2>Guess the Word</h2>
      {/* Add UI for inputting and submitting guesses */}
      <form id = "guessForm" onSubmit={handleGuess}>
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
