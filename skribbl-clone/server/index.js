const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const Game = require("./Game");
const PORT = 3001;

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

server.listen(PORT);
const game = new Game(io);

io.on("connection", (socket) => {
  const userId = socket.id;
  socket.userId = userId;
  socket.on("newPlayer", (player) => {
    // socket.join('roomName')
    game.addPlayer(player);

    // Send initial game state to the player
    socket.emit("initialGameState", {
      players: game.players,
      currentPlayer: game.players[game.currentPlayerIndex],
      currentWord: game.words[game.currentWordIndex],
      timer: game.timer,
    });

    io.emit("updatePlayerList", game.players);
  });

  socket.on("submitName", (name) => {
    console.log("A Player connected: ", name);
    game.addPlayer({ id: userId, name, score: 0, socket });
    updateGameStatus();
  });

  socket.on("startGame", () => {
    game.startGame();
    updateGameStatus();
  });

  socket.on("disconnect", () => {
    game.removePlayer(socket.id);
    updateGameStatus();
    console.log("A user disconnected");
  });

  socket.on("draw", (data) => {
    // io.to('roomName').emit('draw', data);
    // Broadcast to all clients in the room
    game.emitDrawing(data);
  });

  socket.on("newPath", () => {
    game.emitNewStroke();
  });

  socket.on("newTurn", () => {
    updateGameStatus();
    // updateGameStatus();
  });

  socket.on("guessWord", ({ guessedWord, socketID }) => {
    game.handleWordGuess(guessedWord, socketID);
    updateGameStatus();
  });

  socket.on("restartGame", () => {
    game.restartGame();
    updateGameStatus();
  });

  socket.on("selectWord", (word) => {
    game.selectWord(word);
  });

  socket.on("clearDrawing", () => {
    game.clearDrawingBoard();
  });
});

function updateGameStatus() {
  io.emit("updatePlayersConnected", game.players.length);

  const playerList = game.updatePlayerList();
  io.emit("updatePlayerList", playerList);

  if (game.players.length >= 2) {
    io.emit("showStartGameButton", true);
  } else {
    io.emit("showStartGameButton", false);
  }
}
