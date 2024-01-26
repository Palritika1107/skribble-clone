// src/components/WordListSelection.js
import React, { useState, useEffect } from 'react';
import WordListSelectionModal from './WordListModal';
import socket from './Socket';// Replace with your server URL

function WordListSelection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wordList, setWordList] = useState([]);

  useEffect(() => {
    // Listen for updates on word list from the server
    socket.on('wordList', (list) => {
      setWordList(list);
      setIsModalOpen(true)
    });

    // Cleanup function
    return () => {
      socket.off('wordList');
    };
  }, []);


  const handleCloseModal = () => {
    
    setIsModalOpen(false);
  };

  return (
    wordList ? 
    <div>
      <WordListSelectionModal isOpen={isModalOpen} onClose={handleCloseModal} wordList={wordList}/>
    </div> : <> </>
  );
};

export default WordListSelection;
