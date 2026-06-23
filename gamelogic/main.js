class Game {
  constructor() {
    this.state = 'START';
    this.turnCount = 0;
    this.level = 1;
  }
//TODO: Convert to iterate over players based on init 
  async run() {
    while (this.state !== 'GAME_OVER') {
      switch (this.state) {
        case 'START':
          this.initializeGame();
          break;

        case 'PLAYER_TURN':
          await this.handlePlayerTurn();
          break;

//TODO: Change win condition to escalation check
        case 'CHECK_WIN_CONDITION':
          this.checkWinCondition();
          break;
      }
    }
    console.log("Game Over.");
  }
//TODO: Convert to initialize players and add to the game opts
  initializeGame() {
    console.log("Game started! Player goes first.");
    this.state = 'PLAYER_TURN';
  }
//TODO: Build logic for player turn here
  handlePlayerTurn() {
    return new Promise((resolve) => {
      console.log("Waiting for player input...");
      
      // Simulate input event (e.g., a button click)
      const onActionSelected = () => {
        console.log("Player attacked!");
        document.getElementById('action-btn').removeEventListener('click', onActionSelected);
        
        resolve(); // Resolves the promise to resume the loop
      };

      document.getElementById('action-btn').addEventListener('click', onActionSelected);
    });
  }

  checkWinCondition() {
    const isGameOver = Math.random() > 0.8; // Random 20% chance to end game
    if (isGameOver) {
      this.state = 'GAME_OVER';
    } else {
      this.turnCount++;
      this.state = 'PLAYER_TURN';
      this.run(); // Continue the loop
    }
  }
}
//TODO: Move game start to button
// Start the game
const game = new Game();
game.run();