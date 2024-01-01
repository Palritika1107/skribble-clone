const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const Game = require('./Game');
const PORT = process.env.PORT || 3001;

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

server.listen(PORT);
const game = new Game();

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
