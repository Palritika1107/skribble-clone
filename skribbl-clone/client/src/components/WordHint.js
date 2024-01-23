// src/components/WordHint.js
import React, { useState, useEffect } from 'react';
import socket from './Socket'; // Replace with your server URL

function WordHint() {
  const [wordHint, setWordHint] = useState('');

  useEffect(() => {
    // Listen for updates on the word hint from the server
    socket.on('wordHint', (hint) => {
      setWordHint(hint);
    });

    // Cleanup function
    return () => {
      socket.off('wordHint');
    };
  }, []);

  return (
    wordHint ? (
    <div>
      {wordHint && (
        <div>
          <h2>Word Hint</h2>
          <p>{wordHint}</p>
        </div>
      )}
    </div>) : <></>
  );
}

export default WordHint;
