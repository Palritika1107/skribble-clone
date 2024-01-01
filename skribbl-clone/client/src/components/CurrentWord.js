// src/components/CurrentWord.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function CurrentWord() {
  const [currentWord, setCurrentWord] = useState('');

  useEffect(() => {
    // Listen for updates on the current word from the server
    socket.on('updateCurrentWord', (word) => {
      setCurrentWord(word);
    });

    // Cleanup function
    return () => {
      socket.off('updateCurrentWord');
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
