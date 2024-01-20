// server/Game.js
class Game {
  constructor(io) {
    this.io = io;
    this.players = [];
    this.currentPlayerIndex = 0;
    this.currentWordIndex = 0;
    this.words = ["apple", "banana", "cherry"]; // Add more words as needed
    this.timer = 20;
    this.gameStarted = false;
    this.currentWord = ''
    this.currentPlayer =''
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
      return this.players.map(({ id, name, score }) => ({ id, name , score}));
    }
  
    startGame() {
      this.io.emit('gameStarted', true);
      this.sendPlayerTurn();
      this.sendNewWord();
      this.startTurnTimer();
      this.handleWordGuess('')
    }
  
    endGame() {
      // Handle end of the game logic
      let tempScore = 0
      let player = ''
      this.players.map(({id, name,score},idx)=>{
        if (tempScore < score){
          tempScore = score
          player = name
        }
      })

      this.io.emit('roundEnd', [player])
      this.gameStarted = false;
    }

    clearDrawingBoard() {
      this.emitToAll('clearDrawing');
    }
  
    startTurnTimer() {
      this.io.emit('roundUpdate')
      const intervalId = setInterval(() => {
        this.timer--;
        
        if (this.timer === 0) {
          this.nextTurn();
        }
        console.log(this.timer)
        this.sendTimerUpdate();
      }, 1000);
  
      setTimeout(() => {
        clearInterval(intervalId);
      }, this.timer * 10000);
    }

    nextTurn() {
      console.log("triggering next turn");
      this.currentWordIndex++;
      this.currentPlayerIndex++;
  
      if (this.currentPlayerIndex >= this.players.length) {
        this.currentPlayerIndex = 0;
      }
  
      if (this.currentWordIndex >= this.words.length) {
        this.endGame();
        return;
      } else {
        this.sendPlayerTurn();
        this.sendNewWord();
        this.timer = 20;
        this.startTurnTimer();
        this.handleWordGuess('');
      }
    }
  
    sendNewWord() {
      this.newWord = this.words[this.currentWordIndex];
      this.io.emit('updateCurrentWord', this.newWord);
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
      this.currentPlayer = this.players[this.currentPlayerIndex].name;
      this.io.emit('playerTurn', this.currentPlayer);
    }
  
    sendTimerUpdate() {
      this.emitToAll('updateTimer', this.timer);
    }

    handleWordGuess(guessedWord){
      var updateScores = [];
      if (guessedWord && guessedWord.toLowerCase() === this.newWord.toLowerCase()) {
        this.players.map(({id, name,score},idx)=>{
          if (name === this.currentPlayer){
            let obj = {
              id:id,
              name: name,
              score: score+1
            }
            updateScores.push(obj)
            this.players[idx].score = score + 1
          }
          else{
            let obj = {
              id: id,
              name: name,
              score: score
            }
            updateScores.push(obj)
          }
        });
        this.io.emit('correctWordGuess', updateScores);
        this.nextTurn()
      }
      else {
        this.players.map(({id, name,score},idx)=>{
            let obj = {
              id:id,
              name: name,
              score: score
            }
            updateScores.push(obj)
      })
      this.io.emit('correctWordGuess', updateScores);
    }
  }

  
    emitToAll(event, data) {
      this.players.forEach((player) => {
        player.socket.emit(event, data);
      });
    }
  }
  
  module.exports = Game;
  