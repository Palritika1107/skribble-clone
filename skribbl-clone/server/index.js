// server/index.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Game = require('./Game');

const app = express();
// Middleware to enable CORS
const enableCORS = (req, res, next) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin (replace * with your specific origin if needed)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    // Preflight request. Respond successfully.
    return res.status(204).end();
  }
  console.log(res)
  // Continue to the next middleware or route handler
  next();
};

// Use the CORS middleware
app.use(enableCORS);
console.log(app)
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3001;

const game = new Game();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('submitName', (name) => {
    game.addPlayer({ id: socket.id, name, socket });
    updateGameStatus();
  });

  socket.on('startGame', () => {
    game.startGame();
    updateGameStatus();
  });

  socket.on('disconnect', () => {
    game.removePlayer(socket.id);
    updateGameStatus();
    console.log('A user disconnected');
  });
});

function updateGameStatus() {
  io.emit('updatePlayersConnected', game.players.length);

  const playerList = game.updatePlayerList();
  io.emit('updatePlayerList', playerList);

  if (game.players.length >= 2) {
    game.sendGameStatus();
    io.emit('showStartGameButton', true);
  } else {
    io.emit('showStartGameButton', false);
  }
}

