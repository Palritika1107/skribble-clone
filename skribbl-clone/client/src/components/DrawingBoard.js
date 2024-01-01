// src/components/DrawingBoard.js
import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:300'); // Replace with your server URL

function DrawingBoard() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set up initial drawing styles
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = 5;
    context.strokeStyle = '#000000';

    let isDrawing = false;

    const startDrawing = (event) => {
      isDrawing = true;
      draw(event);
    };

    const stopDrawing = () => {
      isDrawing = false;
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

    socket.on('clearDrawing', handleClearDrawing);

    // Cleanup function
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      socket.off('clearDrawing');
    };
  }, []);

  const handleClearDrawing = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div>
      <h2>Drawing Board</h2>
      <canvas ref={canvasRef} width={800} height={500} style={{ border: '1px solid #000000' }}></canvas>
      <button onClick={handleClearDrawing}>Clear Drawing Board</button>
    </div>
  );
}

export default DrawingBoard;
