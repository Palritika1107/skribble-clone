// src/components/WordListSelection.js
import React, { useState, useEffect } from 'react';
import socket from './Socket';// Replace with your server URL

function WordListSelection() {
  const [wordList, setWordList] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');


  useEffect(() => {
    // Listen for updates on word list from the server
    socket.on('wordList', (list) => {
        setWordList(list)
    });

    // Cleanup function
    return () => {
      socket.off('wordList');
    };
  }, []);

  const handleSelectWord = (word) => {
    // Emit a selected word to the server
    socket.emit('selectWord', word);
    setSelectedWord(word);
  };

  return (
      wordList ? (<div>
      <h2>Select a Word</h2>
      <ul>
        {wordList.map((word) => (
          <li key={word} onClick={() => handleSelectWord(word)}>
            <button>{word}</button>
          </li>
        ))}
      </ul>
      <h4>{selectedWord && <p>You selected: {selectedWord}</p>}</h4>
    </div>) : <></>
  );
}

export default WordListSelection;
