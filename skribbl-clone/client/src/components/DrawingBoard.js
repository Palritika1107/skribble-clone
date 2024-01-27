// src/components/DrawingBoard.js
import React, { useEffect, useRef, useState } from "react";
import socket from "./Socket"; // Replace with your server URL

function DrawingBoard() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [allowDrawing, setAllowDrawing] = useState(false);

  const handleClearDrawing = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clearDrawing");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set up initial drawing styles
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = 5;
    context.strokeStyle = "#990000";

    socket.on("playerTurn", ({ id: currentPlayerID }) => {
      if (socket.id === currentPlayerID) {
        setAllowDrawing(true);
      } else {
        setAllowDrawing(false);
      }
    });

    socket.on("clearDrawingForAll", () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

    const startDrawing = (event) => {
      if (allowDrawing) {
        setIsDrawing(true);
        draw(event);
      }
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      socket.emit("newPath");
      context.beginPath(); // Start a new path for the next stroke
    };

    const draw = (event) => {
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      context.lineTo(offsetX, offsetY);
      context.stroke();
      context.beginPath();
      context.moveTo(offsetX, offsetY);

      // Emit the drawing data to the server
      socket.emit("draw", {
        x: offsetX,
        y: offsetY,
        color: context.strokeStyle,
        lineWidth: context.lineWidth,
      });
    };

    // Event listeners for drawing
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    socket.on("drawing", (data) => {
      context.strokeStyle = data.color;
      context.lineWidth = data.lineWidth;
      context.lineTo(data.x, data.y);
      context.stroke();
      context.beginPath();
      context.moveTo(data.x, data.y);
    });

    socket.on("newStroke", () => {
      context.beginPath();
    });

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
      socket.off("draw");
      socket.off("drawing");
      socket.off("newStroke");
    };
  }, [isDrawing, allowDrawing]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ border: "1px solid #000000" }}
      ></canvas>
      {allowDrawing ? (
        <button onClick={handleClearDrawing}>Clear Drawing Board</button>
      ) : (
        <></>
      )}
    </div>
  );
}

export default DrawingBoard;
