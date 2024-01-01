// server/Game.js
class Game {
    constructor() {
      this.players = [];
      this.words = [];
      this.currentWordIndex = 0;
      this.currentPlayerIndex = 0;
      this.gameStatus = 'waiting';
      this.timer = 60; // Initial timer value in seconds
    }
  
    addPlayer(player) {
      this.players.push(player);
    }
  
    removePlayer(playerId) {
      this.players = this.players.filter((player) => player.id !== playerId);
    }
  
    updatePlayerList() {
      return this.players.map(({ id, name }) => ({ id, name }));
    }
  
    startGame() {
      this.gameStatus = 'playing';
      this.shuffleWords();
      this.sendWordList();
      this.sendGameStatus();
      this.startTurnTimer();
    }
  
    endGame() {
      this.gameStatus = 'gameover';
      this.sendGameStatus();
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
        this.sendWordHint();
        this.timer = 60; // Reset the timer for the next turn
        this.startTurnTimer();
      }
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
      this.emitToAll('playerTurn', currentPlayer);
    }
  
    sendTimerUpdate() {
      this.emitToAll('updateTimer', this.timer);
    }
  
    sendGameStatus() {
      this.emitToAll('gameStatus', this.gameStatus);
    }
  
    emitToAll(event, data) {
      this.players.forEach((player) => {
        player.socket.emit(event, data);
      });
    }
  }
  
  module.exports = Game;
  