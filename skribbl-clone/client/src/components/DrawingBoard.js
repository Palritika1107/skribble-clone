// src/components/DrawingBoard.js
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function DrawingBoard({ username, players }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState('');

  const handleClearDrawing = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clearDrawing');
  };

  useEffect(() => {    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set up initial drawing styles
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = 5;
    context.strokeStyle = '#000000';


    const startDrawing = (event) => {
      setIsDrawing(true);
      draw(event);
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      context.beginPath(); // Start a new path for the next stroke
    };


    const draw = (event) => {
      if (!isDrawing) return;

      // Draw a line from the previous point to the current point
      context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
      context.stroke();
      context.beginPath();
      context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);

      // Emit the drawing data to the server
      socket.emit('draw', {
        x: event.clientX - canvas.offsetLeft,
        y: event.clientY - canvas.offsetTop,
        color: context.strokeStyle,
        lineWidth: context.lineWidth,
      });
    };

    socket.on('correctGuess', () => {
      // Handle the logic for correct guesses
      console.log('captured Correct guess!');

      // You might want to update the UI, reset the drawing board, etc.
    });

    // Event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Listen for updates on drawing data from the server
    socket.on('draw', (data) => {
      context.strokeStyle = data.color;
      context.lineWidth = data.lineWidth;
      context.lineTo(data.x, data.y);
      context.stroke();
      context.beginPath();
      context.moveTo(data.x, data.y);
    });
    // Listen for updates on clearing the drawing board from the server
    socket.on('clearDrawing', handleClearDrawing);

    // Listen for updates on player turn from the server
    socket.on('playerTurn', (currentPlayer) => {
      setCurrentPlayer(currentPlayer);
      if (currentPlayer === username) {
        // It's the current player's turn
        console.log(`${username}, it's your turn!`);
      } else {
        // It's not the current player's turn
        console.log(`${currentPlayer}'s turn`);
      }
    });

    // Listen for updates on the current word from the server
    socket.on('updateCurrentWord', (newWord) => {
      setCurrentWord(newWord);
      console.log(`Current word: ${newWord}`);
    });

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      socket.off('clearDrawing');
      socket.off('updatePlayerTurn');
      socket.off('updateCurrentWord');
      socket.off('correctGuess');
    };
  }, [isDrawing, username]);

  return (
    <div>
      <h2>{`Player: ${username}`}</h2>
      <h3>{`Current Player: ${currentPlayer}`}</h3>
      <h3>{`Current Word: ${currentWord}`}</h3>
      <canvas ref={canvasRef} width={800} height={500} style={{ border: '1px solid #000000' }}></canvas>
      <button onClick={handleClearDrawing}>Clear Drawing Board</button>
    </div>
  );
}

export default DrawingBoard;
