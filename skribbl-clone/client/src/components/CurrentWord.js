// src/components/CurrentWord.js
import React, { useState, useEffect } from 'react';
import socket from './Socket'; // Replace with your server URL

function CurrentWord() {
  const [currentWord, setCurrentWord] = useState('');

  useEffect(() => {
    // Listen for updates on the current word from the server
    socket.on('updateCurrentWord', (word) => {
      setCurrentWord(word);
    });
    
    socket.on('gameRestarted', (currWord) => {
      setCurrentWord(currWord);
      console.log(currentWord)
    });

    // Cleanup function
    return () => {
      socket.off('updateCurrentWord');
      socket.off('gameRestarted');
    };
  }, []);

  return (
    <div>
      {currentWord && (
        <div>
          <h2>Current Word</h2>
          <p>{currentWord}</p>
        </div>
      )}
    </div>
  );
}

export default CurrentWord;
