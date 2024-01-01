// src/components/ClearDrawingBoard.js
import React from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function ClearDrawingBoard() {
  const handleClearDrawingBoard = () => {
    // Emit a request to clear the drawing board to the server
    socket.emit('clearDrawingBoard');
  };

  return (
    <div>
      <button onClick={handleClearDrawingBoard}>Clear Drawing Board</button>
    </div>
  );
}

export default ClearDrawingBoard;
