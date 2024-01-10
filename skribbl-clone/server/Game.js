// server/Game.js
class Game {
  constructor(io) {
    this.io = io;
    this.players = [];
    this.currentPlayerIndex = 0;
    this.currentWordIndex = 0;
    this.words = ["apple", "banana", "cherry"]; // Add more words as needed
    this.timer = 60;
    this.gameStarted = false;
  }

  addPlayer(player) {
    this.players.push(player);

    // Check if the required number of players is reached to start the game
    // if (this.players.length === 2 && this.gameStarted) {
    //   this.startGame();
    // }
  }
  removePlayer(playerId) {
    const index = this.players.findIndex((player) => player.id === playerId);
    if (index !== -1) {
      this.players.splice(index, 1);
    }

    // Check if there are still players in the game
    if (this.players.length === 0) {
      this.gameStarted = false;
    }
  }
  
    updatePlayerList() {
      return this.players.map(({ id, name }) => ({ id, name }));
    }
  
    startGame() {
      this.io.emit('gameStarted', true);
      this.sendPlayerTurn();
      this.sendNewWord();
      this.startTurnTimer();
    }
  
    endGame() {
      // Handle end of the game logic
      console.log('Game ended');
      this.gameStarted = false;
    }

    clearDrawingBoard() {
      this.emitToAll('clearDrawing');
    }
  
    startTurnTimer() {
      const intervalId = setInterval(() => {
        this.timer--;
  
        if (this.timer === 0) {
          this.nextTurn();
        }
  
        this.sendTimerUpdate();
      }, 1000);
  
      setTimeout(() => {
        clearInterval(intervalId);
      }, this.timer * 1000);
    }

    nextTurn() {
      this.currentWordIndex++;
      this.currentPlayerIndex++;
  
      if (this.currentPlayerIndex >= this.players.length) {
        this.currentPlayerIndex = 0;
      }
  
      if (this.currentWordIndex >= this.words.length) {
        this.endGame();
      } else {
        this.sendPlayerTurn();
        this.sendNewWord();
        this.timer = 60;
        this.startTurnTimer();
      }
    }
  
    sendNewWord() {
      const newWord = this.words[this.currentWordIndex];
      this.io.emit('updateCurrentWord', newWord);
    }

    shuffleWords() {
      // Shuffle the array of words (Fisher-Yates algorithm)
      for (let i = this.words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
      }
    }
  
    sendWordList() {
      const wordList = this.words.slice(this.currentWordIndex, this.currentWordIndex + 3);
      this.emitToAll('updateWordList', wordList);
    }
  
    sendWordHint() {
      const currentWord = this.words[this.currentWordIndex];
      const hint = currentWord.substring(0, 2) + '_'.repeat(currentWord.length - 2);
      this.emitToAll('updateWordHint', hint);
    }
  
    sendPlayerTurn() {
      const currentPlayer = this.players[this.currentPlayerIndex].name;
      this.io.emit('playerTurn', currentPlayer);
    }
  
    sendTimerUpdate() {
      this.emitToAll('updateTimer', this.timer);
    }

  
    emitToAll(event, data) {
      this.players.forEach((player) => {
        player.socket.emit(event, data);
      });
    }
  }
  
  module.exports = Game;
  