// src/components/WaitingScreen.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function WaitingScreen() {
  const [waiting, setWaiting] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [startGameVisible, setStartGameVisible] = useState(false);

  useEffect(() => {
    // Listen for updates on whether the game is in the waiting state from the server
    socket.on('updateWaiting', (isWaiting) => {
      setWaiting(isWaiting);
    });

    // Listen for updates on whether to show the "Start Game" button from the server
    socket.on('showStartGameButton', (show) => {
      setStartGameVisible(show);
    });

    // Cleanup function
    return () => {
      socket.off('updateWaiting');
      socket.off('showStartGameButton');
    };
  }, []);

  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  const handleSubmitName = (event) => {
    event.preventDefault();
    // Emit the player name to the server
    socket.emit('submitName', playerName);
    setIsNameSubmitted(true);
  };

  const handleStartGame = () => {
    // Emit a request to start the game to the server
    console.log("hanlded start game in client")
    socket.emit('startGame');
  };

  return (
    <div>
      {waiting && (
        <div>
          <h2>Players Lobby</h2>
          {!isNameSubmitted ? (
            <form onSubmit={handleSubmitName}>
              <label>
                Enter your name:
                <input
                  type="text"
                  value={playerName}
                  onChange={handleNameChange}
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          ) : (
            <div>
              {startGameVisible ? <button onClick={handleStartGame}>Start Game</button> 
              : <p>Waiting for other players...</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WaitingScreen;
