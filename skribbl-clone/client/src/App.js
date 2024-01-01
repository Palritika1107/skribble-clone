// src/App.js
import React, { useEffect } from 'react';
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
import ClearDrawingBoard from './components/ClearDrawingBoard';
import PlayerConnectionStatus from './components/PlayerConnectionStatus';
import RoundEnd from './components/RoundEnd';

const socket = io('http://localhost:3001'); // Replace with your server URL

function App() {
  useEffect(() => {
    // Socket.io setup

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h1>Skribbl.io Clone</h1>
      <WaitingScreen />
      <PlayerConnectionStatus />
      <PlayerTurnMessage />
      <TurnTimer />
      <CurrentWord />
      <CorrectGuessHandling />
      <WordHint />
      <WordListSelection />
      <DrawingBoard />
      <ClearDrawingBoard />
      <WordList />
      <PlayerList />
      <GameStatus />
      <Timer />
      <Scoring />
      <RoundEnd />
      <RestartGame />
      <GameOver />
    </div>
  );
}

export default App;
