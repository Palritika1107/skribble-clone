// src/App.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import DrawingBoard from './components/DrawingBoard';
import WordList from './components/WordList';
import PlayerList from './components/PlayerList';
import GameStatus from './components/GameStatus';
import Timer from './components/Timer';
import GameOver from './components/GameOver';
import WaitingScreen from './components/WaitingScreen';
import CurrentWord from './components/CurrentWord';
import CorrectGuessHandling from './components/CorrectGuessHandling';
import Scoring from './components/Scoring';
import RestartGame from './components/RestartGame';
import WordListSelection from './components/WordListSelection';
import PlayerTurnMessage from './components/PlayerTurnMessage';
import TurnTimer from './components/TurnTimer';
import WordHint from './components/WordHint';
import PlayerConnectionStatus from './components/PlayerConnectionStatus';
import RoundEnd from './components/RoundEnd';
// import LoginPage from './components/LoginPage';

const socket = io('http://localhost:3001'); // Replace with your server URL

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [players, setPlayers] = useState([]);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user);

    // Inform the server that a new player has joined
    socket.emit('newPlayer', user);

    // Listen for initial game state from the server
    socket.on('initialGameState', (initialState) => {
      setPlayers(initialState.players);
      // Additional logic to handle initial game state (current player, current word, timer, etc.)
    });

    // Listen for updated player list from the server
    socket.on('updatePlayerList', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });


  };



  useEffect(() => {
    // Socket.io setup
    socket.on('gameStarted', (state) => {
      setIsLoggedIn(state);
    });

    return () => {
      //socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h1>Skribbl.io Clone</h1>
      <div>
        {isLoggedIn ? (
          <>
          
          <PlayerConnectionStatus />
          <PlayerList />
          
          <PlayerTurnMessage />
          <TurnTimer />
          <CurrentWord />
          <CorrectGuessHandling />
          <WordHint />
          <WordListSelection />
          <DrawingBoard username={username} players={players} />
          <WordList />
          
          <GameStatus />
          <Timer />
          <Scoring />
          <RoundEnd />
          <RestartGame />
          <GameOver />
          </>
        ):(<>
        {/* <LoginPage onLogin={handleLogin} /> */}
        <WaitingScreen onLogin={handleLogin}/>
        <PlayerConnectionStatus />
        <PlayerList />
        </>)}
      </div>
      
    </div>
  );
}

export default App;
