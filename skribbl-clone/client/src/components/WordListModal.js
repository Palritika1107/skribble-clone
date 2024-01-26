// src/components/WordListSelection.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import socket from './Socket'; // Replace with your server URL

function WordListSelectionModal({ isOpen, onClose, wordList }) {
  const [selectedWord, setSelectedWord] = useState('');


  const handleSelectWord = (word) => {
    // Emit a selected word to the server
    //socket.emit('selectWord', word);
    setTimeout(()=>socket.emit('selectWord', word),3000);
    setSelectedWord(word);
    setTimeout(onClose, 3000);
    // Close the modal after selecting a word
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Word List Selection Modal"
      
    >
      <div style={styles.modal}>
        <h2>Select a Word</h2>
        <ul>
          {wordList.map((word) => (
            <li key={word} onClick={() => handleSelectWord(word)}>
              <button>{word}</button>
            </li>
          ))}
        </ul>
        <h4>{selectedWord && <p>You selected: {selectedWord}</p>}</h4>
      </div>
    </Modal>
  );
}


const styles = {
    modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      background: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  };

export default WordListSelectionModal;
