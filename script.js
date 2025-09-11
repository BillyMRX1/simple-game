// Game Navigation
class GameManager {
    constructor() {
        this.currentGame = null;
        this.initializeNavigation();
    }

    initializeNavigation() {
        // Main menu buttons
        document.getElementById('tictactoe-btn').addEventListener('click', () => this.showGame('tictactoe'));
        document.getElementById('sudoku-btn').addEventListener('click', () => this.showGame('sudoku'));
        document.getElementById('game2048-btn').addEventListener('click', () => this.showGame('2048'));
        document.getElementById('snake-btn').addEventListener('click', () => this.showGame('snake'));
        document.getElementById('tetris-btn').addEventListener('click', () => this.showGame('tetris'));


        // Back buttons
        document.getElementById('back-from-ttt').addEventListener('click', () => this.showMainMenu());
        document.getElementById('back-from-sudoku').addEventListener('click', () => this.showMainMenu());
        document.getElementById('back-from-2048').addEventListener('click', () => this.showMainMenu());
        document.getElementById('back-from-snake').addEventListener('click', () => this.showMainMenu());
        document.getElementById('back-from-tetris').addEventListener('click', () => this.showMainMenu());

    }

    showGame(gameType) {
        document.getElementById('main-menu').style.display = 'none';

        if (gameType === 'tictactoe') {
            document.getElementById('tictactoe-game').style.display = 'block';
            if (!this.currentGame || this.currentGame.constructor.name !== 'TicTacToe') {
                this.currentGame = new TicTacToe();
            }
        } else if (gameType === 'sudoku') {
            document.getElementById('sudoku-game').style.display = 'block';
            if (!this.currentGame || this.currentGame.constructor.name !== 'Sudoku') {
                this.currentGame = new Sudoku();
            }
        } else if (gameType === '2048') {
            document.getElementById('game2048').style.display = 'block';
            if (!this.currentGame || this.currentGame.constructor.name !== 'Game2048') {
                this.currentGame = new Game2048();
            }
        } else if (gameType === 'snake') {
            document.getElementById('snake-game').style.display = 'block';
            if (!this.currentGame || this.currentGame.constructor.name !== 'Snake') {
                this.currentGame = new Snake();
            }
        } else if (gameType === 'tetris') {
            document.getElementById('tetris-game').style.display = 'block';
            if (!this.currentGame || this.currentGame.constructor.name !== 'Tetris') {
                this.currentGame = new Tetris();
            }
        } else if (gameType === 'checkers') {
            document.getElementById('checkers-game').style.display = 'block';
            if (!this.currentGame || this.currentGame.constructor.name !== 'Checkers') {
                this.currentGame = new Checkers();
            }
        }
    }

    showMainMenu() {
        document.getElementById('main-menu').style.display = 'block';
        document.getElementById('tictactoe-game').style.display = 'none';
        document.getElementById('sudoku-game').style.display = 'none';
        document.getElementById('game2048').style.display = 'none';
        document.getElementById('snake-game').style.display = 'none';
        document.getElementById('tetris-game').style.display = 'none';
        document.getElementById('checkers-game').style.display = 'none';

        // Pause any running games
        if (this.currentGame && (this.currentGame.constructor.name === 'Snake' || this.currentGame.constructor.name === 'Tetris')) {
            this.currentGame.pause();
        }
    }
}

class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X'; // Player is X, Computer is O
        this.gameActive = true;
        this.playerScore = 0;
        this.computerScore = 0;

        this.cells = document.querySelectorAll('.cell');
        this.statusElement = document.getElementById('game-status');
        this.resetBtn = document.getElementById('reset-btn');
        this.clearScoreBtn = document.getElementById('clear-score-btn');
        this.playerScoreElement = document.getElementById('player-score');
        this.computerScoreElement = document.getElementById('computer-score');

        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.initializeGame();
        this.loadScore();
    }

    initializeGame() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });

        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.clearScoreBtn.addEventListener('click', () => this.clearScore());

        this.updateDisplay();
    }

    handleCellClick(index) {
        if (this.board[index] !== '' || !this.gameActive || this.currentPlayer !== 'X') {
            return;
        }

        this.makeMove(index, 'X');

        if (this.gameActive && this.currentPlayer === 'O') {
            setTimeout(() => this.computerMove(), 500);
        }
    }

    makeMove(index, player) {
        this.board[index] = player;
        this.cells[index].textContent = player;
        this.cells[index].classList.add(player.toLowerCase());

        if (this.checkWinner()) {
            this.gameActive = false;
            this.highlightWinningLine();

            if (player === 'X') {
                this.playerScore++;
                this.statusElement.textContent = 'You win! 🎉';
            } else {
                this.computerScore++;
                this.statusElement.textContent = 'Computer wins! 🤖';
            }

            this.saveScore();
            this.updateScoreDisplay();
        } else if (this.board.every(cell => cell !== '')) {
            this.gameActive = false;
            this.statusElement.textContent = "It's a tie! 🤝";
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.statusElement.textContent = this.currentPlayer === 'X' ? 'Your turn (X)' : 'Computer thinking...';
        }
    }

    computerMove() {
        if (!this.gameActive) return;

        // Try to win
        let move = this.findBestMove('O');
        if (move !== -1) {
            this.makeMove(move, 'O');
            return;
        }

        // Try to block player from winning
        move = this.findBestMove('X');
        if (move !== -1) {
            this.makeMove(move, 'O');
            return;
        }

        // Take center if available
        if (this.board[4] === '') {
            this.makeMove(4, 'O');
            return;
        }

        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(index => this.board[index] === '');
        if (availableCorners.length > 0) {
            const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            this.makeMove(randomCorner, 'O');
            return;
        }

        // Take any available spot
        const availableMoves = this.board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        if (availableMoves.length > 0) {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            this.makeMove(randomMove, 'O');
        }
    }

    findBestMove(player) {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            const line = [this.board[a], this.board[b], this.board[c]];

            if (line.filter(cell => cell === player).length === 2 && line.includes('')) {
                return condition[line.indexOf('')];
            }
        }
        return -1;
    }

    checkWinner() {
        return this.winningConditions.some(condition => {
            const [a, b, c] = condition;
            return this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c];
        });
    }

    highlightWinningLine() {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.cells[a].classList.add('winning-line');
                this.cells[b].classList.add('winning-line');
                this.cells[c].classList.add('winning-line');
                break;
            }
        }
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;

        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-line');
        });

        this.statusElement.textContent = 'Your turn (X)';
    }

    clearScore() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.saveScore();
        this.updateScoreDisplay();
    }

    updateDisplay() {
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        this.playerScoreElement.textContent = this.playerScore;
        this.computerScoreElement.textContent = this.computerScore;
    }

    saveScore() {
        localStorage.setItem('ticTacToePlayerScore', this.playerScore.toString());
        localStorage.setItem('ticTacToeComputerScore', this.computerScore.toString());
    }

    loadScore() {
        const savedPlayerScore = localStorage.getItem('ticTacToePlayerScore');
        const savedComputerScore = localStorage.getItem('ticTacToeComputerScore');

        if (savedPlayerScore !== null) {
            this.playerScore = parseInt(savedPlayerScore);
        }

        if (savedComputerScore !== null) {
            this.computerScore = parseInt(savedComputerScore);
        }

        this.updateScoreDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

class Sudoku {
    constructor() {
        this.board = Array(81).fill(0);
        this.solution = Array(81).fill(0);
        this.selectedCell = null;
        this.mistakes = 0;
        this.maxMistakes = 3;
        this.timer = 0;
        this.timerInterval = null;
        this.gameActive = true;

        this.boardElement = document.getElementById('sudoku-board');
        this.timerElement = document.getElementById('timer');
        this.mistakesElement = document.getElementById('mistakes');
        this.difficultySelect = document.getElementById('difficulty-select');
        this.newPuzzleBtn = document.getElementById('new-sudoku-btn');

        this.initializeGame();
    }

    initializeGame() {
        this.createBoard();
        this.generatePuzzle();
        this.startTimer();

        // Event listeners
        this.newPuzzleBtn.addEventListener('click', () => this.newPuzzle());
        this.difficultySelect.addEventListener('change', () => this.newPuzzle());

        // Number pad listeners
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const number = parseInt(btn.dataset.number);
                this.inputNumber(number);
            });
        });
    }

    createBoard() {
        this.boardElement.innerHTML = '';

        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.dataset.index = i;

            cell.addEventListener('click', () => this.selectCell(i));

            this.boardElement.appendChild(cell);
        }

        this.cells = document.querySelectorAll('.sudoku-cell');
    }

    generatePuzzle() {
        // Generate a complete valid sudoku solution
        this.solution = this.generateCompleteSudoku();

        // Create puzzle by removing numbers based on difficulty
        const difficulty = this.difficultySelect.value;
        const cellsToRemove = {
            'easy': 40,
            'medium': 50,
            'hard': 60
        }[difficulty];

        this.board = [...this.solution];

        // Randomly remove numbers
        const indicesToRemove = [];
        while (indicesToRemove.length < cellsToRemove) {
            const index = Math.floor(Math.random() * 81);
            if (!indicesToRemove.includes(index)) {
                indicesToRemove.push(index);
            }
        }

        indicesToRemove.forEach(index => {
            this.board[index] = 0;
        });

        this.updateDisplay();
    }

    generateCompleteSudoku() {
        const board = Array(81).fill(0);

        // Fill diagonal 3x3 boxes first
        for (let box = 0; box < 9; box += 4) {
            this.fillBox(board, Math.floor(box / 3) * 3, (box % 3) * 3);
        }

        // Solve the rest
        this.solveSudoku(board);

        return board;
    }

    fillBox(board, row, col) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.shuffleArray(numbers);

        let index = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[(row + i) * 9 + (col + j)] = numbers[index++];
            }
        }
    }

    solveSudoku(board) {
        for (let i = 0; i < 81; i++) {
            if (board[i] === 0) {
                const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                this.shuffleArray(numbers);

                for (let num of numbers) {
                    if (this.isValidMove(board, i, num)) {
                        board[i] = num;
                        if (this.solveSudoku(board)) {
                            return true;
                        }
                        board[i] = 0;
                    }
                }
                return false;
            }
        }
        return true;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    isValidMove(board, index, num) {
        const row = Math.floor(index / 9);
        const col = index % 9;

        // Check row
        for (let c = 0; c < 9; c++) {
            if (board[row * 9 + c] === num) return false;
        }

        // Check column
        for (let r = 0; r < 9; r++) {
            if (board[r * 9 + col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;

        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (board[r * 9 + c] === num) return false;
            }
        }

        return true;
    }

    selectCell(index) {
        if (!this.gameActive) return;

        // Remove previous selection
        this.cells.forEach(cell => cell.classList.remove('selected'));

        // Select new cell if it's not a given number
        if (this.board[index] === 0 || !this.cells[index].classList.contains('given')) {
            this.selectedCell = index;
            this.cells[index].classList.add('selected');
        }
    }

    inputNumber(number) {
        if (!this.gameActive || this.selectedCell === null) return;

        const cell = this.cells[this.selectedCell];

        if (number === 0) {
            // Erase
            this.board[this.selectedCell] = 0;
            cell.textContent = '';
            cell.classList.remove('error', 'completed');
        } else {
            // Input number
            if (this.solution[this.selectedCell] === number) {
                this.board[this.selectedCell] = number;
                cell.textContent = number;
                cell.classList.remove('error');
                cell.classList.add('completed');

                // Check if puzzle is complete
                if (this.isPuzzleComplete()) {
                    this.gameWon();
                }
            } else {
                // Wrong number
                this.mistakes++;
                this.mistakesElement.textContent = this.mistakes;
                cell.classList.add('error');

                if (this.mistakes >= this.maxMistakes) {
                    this.gameOver();
                }
            }
        }
    }

    isPuzzleComplete() {
        return this.board.every((cell, index) => cell === this.solution[index]);
    }

    updateDisplay() {
        this.cells.forEach((cell, index) => {
            const value = this.board[index];

            if (value !== 0) {
                cell.textContent = value;
                cell.classList.add('given');
            } else {
                cell.textContent = '';
                cell.classList.remove('given', 'error', 'completed');
            }
        });

        this.mistakes = 0;
        this.mistakesElement.textContent = this.mistakes;
    }

    startTimer() {
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer++;
            const minutes = Math.floor(this.timer / 60);
            const seconds = this.timer % 60;
            this.timerElement.textContent =
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    newPuzzle() {
        this.stopTimer();
        this.gameActive = true;
        this.selectedCell = null;
        this.cells.forEach(cell => {
            cell.classList.remove('selected', 'given', 'error', 'completed');
        });
        this.generatePuzzle();
        this.startTimer();
    }

    gameWon() {
        this.gameActive = false;
        this.stopTimer();
        setTimeout(() => {
            alert(`Congratulations! You completed the puzzle in ${this.timerElement.textContent}!`);
        }, 500);
    }

    gameOver() {
        this.gameActive = false;
        this.stopTimer();
        setTimeout(() => {
            alert('Game Over! Too many mistakes. Try again!');
        }, 500);
    }
}

class
    Game2048 {
    constructor() {
        this.board = Array(16).fill(0);
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('2048-best-score')) || 0;
        this.gameOver = false;
        this.won = false;

        this.boardElement = document.getElementById('game2048-board');
        this.scoreElement = document.getElementById('current-score');
        this.bestScoreElement = document.getElementById('best-score');
        this.statusElement = document.getElementById('game2048-status');
        this.newGameBtn = document.getElementById('new-2048-btn');

        this.initializeGame();
    }

    initializeGame() {
        this.createBoard();
        this.updateBestScore();
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();

        // Event listeners
        this.newGameBtn.addEventListener('click', () => this.newGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Mobile controls
        document.getElementById('up-btn').addEventListener('click', () => this.move('up'));
        document.getElementById('down-btn').addEventListener('click', () => this.move('down'));
        document.getElementById('left-btn').addEventListener('click', () => this.move('left'));
        document.getElementById('right-btn').addEventListener('click', () => this.move('right'));

        // Touch controls
        this.addTouchControls();
    }

    createBoard() {
        this.boardElement.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.index = i;
            this.boardElement.appendChild(tile);
        }
        this.tiles = document.querySelectorAll('.tile');
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < 16; i++) {
            if (this.board[i] === 0) {
                emptyCells.push(i);
            }
        }

        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateDisplay() {
        for (let i = 0; i < 16; i++) {
            const tile = this.tiles[i];
            const value = this.board[i];

            tile.textContent = value === 0 ? '' : value;
            tile.className = 'tile' + (value > 0 ? ` tile-${value}` : '');
        }

        this.scoreElement.textContent = this.score;

        if (this.isGameOver()) {
            this.gameOver = true;
            this.statusElement.textContent = 'Game Over! No more moves available.';
            this.showGameOverOverlay();
        } else if (this.hasWon() && !this.won) {
            this.won = true;
            this.statusElement.textContent = 'You reached 2048! Keep going for a higher score.';
        }
    }

    handleKeyPress(e) {
        if (this.gameOver) return;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.move('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.move('down');
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.move('left');
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.move('right');
                break;
        }
    }

    move(direction) {
        if (this.gameOver) return;

        const previousBoard = [...this.board];
        let moved = false;

        if (direction === 'left') {
            moved = this.moveLeft();
        } else if (direction === 'right') {
            moved = this.moveRight();
        } else if (direction === 'up') {
            moved = this.moveUp();
        } else if (direction === 'down') {
            moved = this.moveDown();
        }

        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            this.updateBestScore();
        }
    }

    moveLeft() {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            const rowArray = [];
            for (let col = 0; col < 4; col++) {
                rowArray.push(this.board[row * 4 + col]);
            }

            const newRow = this.processRow(rowArray);
            for (let col = 0; col < 4; col++) {
                if (this.board[row * 4 + col] !== newRow[col]) {
                    moved = true;
                }
                this.board[row * 4 + col] = newRow[col];
            }
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            const rowArray = [];
            for (let col = 3; col >= 0; col--) {
                rowArray.push(this.board[row * 4 + col]);
            }

            const newRow = this.processRow(rowArray);
            for (let col = 0; col < 4; col++) {
                if (this.board[row * 4 + (3 - col)] !== newRow[col]) {
                    moved = true;
                }
                this.board[row * 4 + (3 - col)] = newRow[col];
            }
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            const colArray = [];
            for (let row = 0; row < 4; row++) {
                colArray.push(this.board[row * 4 + col]);
            }

            const newCol = this.processRow(colArray);
            for (let row = 0; row < 4; row++) {
                if (this.board[row * 4 + col] !== newCol[row]) {
                    moved = true;
                }
                this.board[row * 4 + col] = newCol[row];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            const colArray = [];
            for (let row = 3; row >= 0; row--) {
                colArray.push(this.board[row * 4 + col]);
            }

            const newCol = this.processRow(colArray);
            for (let row = 0; row < 4; row++) {
                if (this.board[(3 - row) * 4 + col] !== newCol[row]) {
                    moved = true;
                }
                this.board[(3 - row) * 4 + col] = newCol[row];
            }
        }
        return moved;
    }

    processRow(row) {
        // Remove zeros
        const filtered = row.filter(val => val !== 0);

        // Merge adjacent equal values
        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] *= 2;
                this.score += filtered[i];
                filtered[i + 1] = 0;
            }
        }

        // Remove zeros again and pad with zeros
        const merged = filtered.filter(val => val !== 0);
        while (merged.length < 4) {
            merged.push(0);
        }

        return merged;
    }

    isGameOver() {
        // Check for empty cells
        if (this.board.includes(0)) return false;

        // Check for possible merges
        for (let i = 0; i < 16; i++) {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const current = this.board[i];

            // Check right neighbor
            if (col < 3 && current === this.board[i + 1]) return false;

            // Check bottom neighbor
            if (row < 3 && current === this.board[i + 4]) return false;
        }

        return true;
    }

    hasWon() {
        return this.board.includes(2048);
    }

    showGameOverOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        overlay.innerHTML = `
            <div class="game-over-text">Game Over!</div>
            <button class="try-again-btn" onclick="this.parentElement.remove(); window.gameManager.currentGame.newGame()">Try Again</button>
        `;
        this.boardElement.appendChild(overlay);
    }

    updateBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('2048-best-score', this.bestScore.toString());
        }
        this.bestScoreElement.textContent = this.bestScore;
    }

    newGame() {
        this.board = Array(16).fill(0);
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.statusElement.textContent = 'Use arrow keys or swipe to move tiles';

        // Remove any overlays
        const overlay = this.boardElement.querySelector('.game-over-overlay');
        if (overlay) overlay.remove();

        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }

    addTouchControls() {
        let startX, startY;

        this.boardElement.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.boardElement.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    this.move('left');
                } else {
                    this.move('right');
                }
            } else {
                if (diffY > 0) {
                    this.move('up');
                } else {
                    this.move('down');
                }
            }

            startX = null;
            startY = null;
        });
    }
}

class Snake {
    constructor() {
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;

        this.snake = [{ x: 10, y: 10 }];
        this.food = {};
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snake-high-score')) || 0;
        this.speed = 1;
        this.gameRunning = false;
        this.gameLoop = null;

        this.scoreElement = document.getElementById('snake-score');
        this.highScoreElement = document.getElementById('snake-high-score');
        this.speedElement = document.getElementById('snake-speed');
        this.statusElement = document.getElementById('snake-status');
        this.startBtn = document.getElementById('start-snake-btn');
        this.pauseBtn = document.getElementById('pause-snake-btn');

        this.initializeGame();
    }

    initializeGame() {
        this.updateDisplay();
        this.generateFood();
        this.drawGame();

        // Event listeners
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.pauseGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Mobile controls
        document.getElementById('snake-up-btn').addEventListener('click', () => this.changeDirection(0, -1));
        document.getElementById('snake-down-btn').addEventListener('click', () => this.changeDirection(0, 1));
        document.getElementById('snake-left-btn').addEventListener('click', () => this.changeDirection(-1, 0));
        document.getElementById('snake-right-btn').addEventListener('click', () => this.changeDirection(1, 0));
    }

    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.startBtn.style.display = 'none';
            this.pauseBtn.style.display = 'inline-block';
            this.statusElement.textContent = 'Use arrow keys or buttons to control the snake';
            this.gameLoop = setInterval(() => this.update(), 200 - (this.speed - 1) * 20);
        }
    }

    pauseGame() {
        this.pause();
    }

    pause() {
        if (this.gameRunning) {
            this.gameRunning = false;
            clearInterval(this.gameLoop);
            this.startBtn.style.display = 'inline-block';
            this.pauseBtn.style.display = 'none';
            this.statusElement.textContent = 'Game paused. Click Start to continue';
        }
    }

    handleKeyPress(e) {
        if (!this.gameRunning) {
            if (e.code === 'Space') {
                e.preventDefault();
                this.startGame();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.changeDirection(0, -1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.changeDirection(0, 1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.changeDirection(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.changeDirection(1, 0);
                break;
            case ' ':
                e.preventDefault();
                this.pauseGame();
                break;
        }
    }

    changeDirection(newDx, newDy) {
        // Prevent reversing direction
        if (this.dx === -newDx && this.dy === -newDy) return;

        this.dx = newDx;
        this.dy = newDy;
    }

    update() {
        this.moveSnake();

        if (this.checkCollision()) {
            this.gameOver();
            return;
        }

        if (this.checkFoodCollision()) {
            this.eatFood();
        }

        this.drawGame();
    }

    moveSnake() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        this.snake.unshift(head);

        // Remove tail if no food eaten
        if (!this.checkFoodCollision()) {
            this.snake.pop();
        }
    }

    checkCollision() {
        const head = this.snake[0];

        // Wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }

        // Self collision
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }

        return false;
    }

    checkFoodCollision() {
        const head = this.snake[0];
        return head.x === this.food.x && head.y === this.food.y;
    }

    eatFood() {
        this.score += 10;
        this.speed = Math.min(10, Math.floor(this.score / 50) + 1);
        this.updateDisplay();
        this.generateFood();

        // Increase game speed
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), 200 - (this.speed - 1) * 20);
    }

    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }

    drawGame() {
        // Clear canvas
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#2E7D32';
            } else {
                this.ctx.fillStyle = '#4CAF50';
            }
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        });

        // Draw food
        this.ctx.fillStyle = '#F44336';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.highScoreElement.textContent = this.highScore;
        this.speedElement.textContent = this.speed;
    }

    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snake-high-score', this.highScore.toString());
            this.updateDisplay();
        }

        this.statusElement.textContent = `Game Over! Final Score: ${this.score}`;
        this.startBtn.textContent = 'New Game';
        this.startBtn.style.display = 'inline-block';
        this.pauseBtn.style.display = 'none';

        // Reset game state
        setTimeout(() => {
            this.snake = [{ x: 10, y: 10 }];
            this.dx = 0;
            this.dy = 0;
            this.score = 0;
            this.speed = 1;
            this.updateDisplay();
            this.generateFood();
            this.drawGame();
            this.startBtn.textContent = 'Start Game';
            this.statusElement.textContent = 'Press Space or tap Start to begin';
        }, 2000);
    }
}

// Store game manager globally for overlay button access
let gameManager;

// Initialize the game manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    gameManager = new GameManager();
    window.gameManager = gameManager; // Make it globally accessible
}); class
    Tetris {
    constructor() {
        this.canvas = document.getElementById('tetris-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('next-canvas');
        this.nextCtx = this.nextCanvas.getContext('2d');

        this.blockSize = 30;
        this.boardWidth = 10;
        this.boardHeight = 20;

        this.board = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameRunning = false;
        this.gameLoop = null;
        this.dropTime = 0;
        this.dropInterval = 1000;

        this.currentPiece = null;
        this.nextPiece = null;

        this.scoreElement = document.getElementById('tetris-score');
        this.linesElement = document.getElementById('tetris-lines');
        this.levelElement = document.getElementById('tetris-level');
        this.statusElement = document.getElementById('tetris-status');
        this.startBtn = document.getElementById('start-tetris-btn');
        this.pauseBtn = document.getElementById('pause-tetris-btn');

        this.pieces = {
            I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' },
            O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
            T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' },
            S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' },
            Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' },
            J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' },
            L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' }
        };

        this.initializeGame();
    }

    initializeGame() {
        this.resizeCanvas();
        this.nextPiece = this.createPiece();
        this.spawnPiece();
        this.updateDisplay();
        this.draw();

        // Event listeners
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.pauseGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Mobile controls
        document.getElementById('tetris-left-btn').addEventListener('click', () => this.movePiece(-1, 0));
        document.getElementById('tetris-right-btn').addEventListener('click', () => this.movePiece(1, 0));
        document.getElementById('tetris-down-btn').addEventListener('click', () => this.movePiece(0, 1));
        document.getElementById('tetris-up-btn').addEventListener('click', () => this.hardDrop());
        document.getElementById('tetris-rotate-btn').addEventListener('click', () => this.rotatePiece());

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const containerWidth = this.canvas.parentElement.clientWidth;
        const maxWidth = Math.min(containerWidth * 0.7, 300);

        this.canvas.style.width = maxWidth + 'px';
        this.canvas.style.height = (maxWidth * 2) + 'px';

        this.blockSize = maxWidth / this.boardWidth;
    }

    createPiece() {
        const types = Object.keys(this.pieces);
        const type = types[Math.floor(Math.random() * types.length)];
        const piece = this.pieces[type];

        return {
            type: type,
            shape: piece.shape,
            color: piece.color,
            x: Math.floor(this.boardWidth / 2) - Math.floor(piece.shape[0].length / 2),
            y: 0
        };
    }

    spawnPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();

        if (this.checkCollision(this.currentPiece, 0, 0)) {
            this.gameOver();
        }

        this.drawNext();
    }

    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.startBtn.style.display = 'none';
            this.pauseBtn.style.display = 'inline-block';
            this.statusElement.textContent = 'Arrow keys to move, Up/X/Z to rotate, C for counter-rotate, Space to drop';
            this.gameLoop = setInterval(() => this.update(), 16);
        }
    }

    pauseGame() {
        this.pause();
    }

    pause() {
        if (this.gameRunning) {
            this.gameRunning = false;
            clearInterval(this.gameLoop);
            this.startBtn.style.display = 'inline-block';
            this.pauseBtn.style.display = 'none';
            this.statusElement.textContent = 'Game paused. Click Start to continue';
        }
    }

    handleKeyPress(e) {
        if (!this.gameRunning) {
            if (e.code === 'Space') {
                e.preventDefault();
                this.startGame();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
            case 'x':
            case 'X':
            case 'z':
            case 'Z':
                e.preventDefault();
                this.rotatePiece();
                break;
            case 'c':
            case 'C':
                e.preventDefault();
                this.rotatePieceCounterClockwise();
                break;
            case ' ':
                e.preventDefault();
                this.hardDrop();
                break;
        }
    }

    update() {
        this.dropTime += 16;

        if (this.dropTime >= this.dropInterval) {
            this.movePiece(0, 1);
            this.dropTime = 0;
        }

        this.draw();
    }

    movePiece(dx, dy) {
        if (!this.currentPiece) return;

        if (!this.checkCollision(this.currentPiece, dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
        } else if (dy > 0) {
            // Piece hit bottom or another piece
            this.placePiece();
            this.clearLines();
            this.spawnPiece();
        }
    }

    rotatePiece() {
        if (!this.currentPiece) return;

        const rotated = this.rotateMatrix(this.currentPiece.shape);
        const originalShape = this.currentPiece.shape;

        this.currentPiece.shape = rotated;

        if (this.checkCollision(this.currentPiece, 0, 0)) {
            this.currentPiece.shape = originalShape;
        }
    }

    rotatePieceCounterClockwise() {
        if (!this.currentPiece) return;

        const rotated = this.rotateMatrixCounterClockwise(this.currentPiece.shape);
        const originalShape = this.currentPiece.shape;

        this.currentPiece.shape = rotated;

        if (this.checkCollision(this.currentPiece, 0, 0)) {
            this.currentPiece.shape = originalShape;
        }
    }

    hardDrop() {
        if (!this.currentPiece) return;

        while (!this.checkCollision(this.currentPiece, 0, 1)) {
            this.currentPiece.y++;
        }

        this.placePiece();
        this.clearLines();
        this.spawnPiece();
    }

    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }

        return rotated;
    }

    rotateMatrixCounterClockwise(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[cols - 1 - j][i] = matrix[i][j];
            }
        }

        return rotated;
    }

    checkCollision(piece, dx, dy) {
        const newX = piece.x + dx;
        const newY = piece.y + dy;

        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = newX + x;
                    const boardY = newY + y;

                    if (boardX < 0 || boardX >= this.boardWidth ||
                        boardY >= this.boardHeight ||
                        (boardY >= 0 && this.board[boardY][boardX])) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    placePiece() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardX = this.currentPiece.x + x;
                    const boardY = this.currentPiece.y + y;

                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
    }

    clearLines() {
        let linesCleared = 0;

        for (let y = this.boardHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.boardWidth).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += this.calculateScore(linesCleared);
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 100);
            this.updateDisplay();
        }
    }

    calculateScore(lines) {
        const baseScore = [0, 40, 100, 300, 1200];
        return baseScore[lines] * this.level;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw board
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(x * this.blockSize, y * this.blockSize,
                        this.blockSize - 1, this.blockSize - 1);
                }
            }
        }

        // Draw current piece
        if (this.currentPiece) {
            this.ctx.fillStyle = this.currentPiece.color;
            for (let y = 0; y < this.currentPiece.shape.length; y++) {
                for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                    if (this.currentPiece.shape[y][x]) {
                        const drawX = (this.currentPiece.x + x) * this.blockSize;
                        const drawY = (this.currentPiece.y + y) * this.blockSize;
                        this.ctx.fillRect(drawX, drawY, this.blockSize - 1, this.blockSize - 1);
                    }
                }
            }
        }

        // Draw grid lines
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;

        for (let x = 0; x <= this.boardWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.boardHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(this.canvas.width, y * this.blockSize);
            this.ctx.stroke();
        }
    }

    drawNext() {
        if (!this.nextPiece) return;

        // Clear next canvas
        this.nextCtx.fillStyle = '#000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

        // Draw next piece
        const blockSize = 15;
        const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * blockSize) / 2;

        this.nextCtx.fillStyle = this.nextPiece.color;
        for (let y = 0; y < this.nextPiece.shape.length; y++) {
            for (let x = 0; x < this.nextPiece.shape[y].length; x++) {
                if (this.nextPiece.shape[y][x]) {
                    this.nextCtx.fillRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize - 1,
                        blockSize - 1
                    );
                }
            }
        }
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.linesElement.textContent = this.lines;
        this.levelElement.textContent = this.level;
    }

    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);

        this.statusElement.textContent = `Game Over! Final Score: ${this.score}`;
        this.startBtn.textContent = 'New Game';
        this.startBtn.style.display = 'inline-block';
        this.pauseBtn.style.display = 'none';

        // Reset game state
        setTimeout(() => {
            this.board = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
            this.score = 0;
            this.lines = 0;
            this.level = 1;
            this.dropInterval = 1000;
            this.currentPiece = null;
            this.nextPiece = this.createPiece();
            this.spawnPiece();
            this.updateDisplay();
            this.draw();
            this.startBtn.textContent = 'Start Game';
            this.statusElement.textContent = 'Press Space or tap Start to begin';
        }, 3000);
    }
} class
    Checkers {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'red'; // Player is red, Computer is black
        this.selectedPiece = null;
        this.possibleMoves = [];
        this.redPieces = 12;
        this.blackPieces = 12;
        this.gameOver = false;
        this.difficulty = 'medium';
        this.captureSequence = [];
        this.computerThinking = false;

        this.boardElement = document.getElementById('checkers-board');
        this.statusElement = document.getElementById('checkers-status');
        this.redCountElement = document.getElementById('red-count');
        this.blackCountElement = document.getElementById('black-count');
        this.playerRedElement = document.getElementById('player-red');
        this.playerBlackElement = document.getElementById('player-black');
        this.newGameBtn = document.getElementById('new-checkers-btn');
        this.difficultySelect = document.getElementById('checkers-difficulty');

        this.initializeGame();
    }

    initializeBoard() {
        const board = Array(8).fill().map(() => Array(8).fill(null));

        // Place black pieces (computer) on top
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    board[row][col] = { color: 'black', king: false };
                }
            }
        }

        // Place red pieces (player) on bottom
        for (let row = 5; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    board[row][col] = { color: 'red', king: false };
                }
            }
        }

        return board;
    }

    initializeGame() {
        this.createBoard();
        this.updateDisplay();

        // Event listeners
        this.newGameBtn.addEventListener('click', () => this.newGame());
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });
    }

    createBoard() {
        this.boardElement.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'checker-square';
                square.dataset.row = row;
                square.dataset.col = col;

                if ((row + col) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark', 'playable');
                    square.addEventListener('click', () => this.handleSquareClick(row, col));
                }

                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `checker-piece ${piece.color}`;
                    if (piece.king) {
                        pieceElement.classList.add('king');
                    }
                    square.appendChild(pieceElement);
                }

                this.boardElement.appendChild(square);
            }
        }
    }

    handleSquareClick(row, col) {
        if (this.gameOver || this.currentPlayer !== 'red') return;

        const piece = this.board[row][col];
        const square = this.getSquareElement(row, col);

        // If clicking on a possible move
        if (square.classList.contains('possible-move')) {
            this.makeMove(this.selectedPiece.row, this.selectedPiece.col, row, col);
            return;
        }

        // If clicking on own piece
        if (piece && piece.color === 'red') {
            this.selectPiece(row, col);
        } else {
            this.clearSelection();
        }
    }

    selectPiece(row, col) {
        this.clearSelection();

        const piece = this.board[row][col];
        if (!piece || piece.color !== 'red') return;

        // Check if this piece has valid moves
        const captures = this.getCaptureMoves(row, col);
        const hasOtherCaptures = this.hasAnyCaptures('red');
        
        if (hasOtherCaptures && captures.length === 0) {
            this.statusElement.textContent = 'You must capture when possible!';
            return;
        }

        this.selectedPiece = { row, col };
        const square = this.getSquareElement(row, col);
        square.classList.add('selected');

        this.possibleMoves = this.getPossibleMoves(row, col);
        this.highlightPossibleMoves();

        if (this.possibleMoves.length === 0) {
            this.statusElement.textContent = 'No valid moves for this piece';
        } else {
            this.statusElement.textContent = `Selected piece - Click where to move (${this.possibleMoves.length} moves available)`;
        }
    }

    clearSelection() {
        document.querySelectorAll('.checker-square').forEach(square => {
            square.classList.remove('selected', 'possible-move', 'highlighted');
        });
        this.selectedPiece = null;
        this.possibleMoves = [];
    }

    getPossibleMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];

        // Check for captures first (mandatory)
        const captures = this.getCaptureMoves(row, col);
        if (captures.length > 0) {
            return captures;
        }

        // If no captures available for this piece, check if any other piece has captures
        if (this.hasAnyCaptures(piece.color)) {
            return []; // This piece can't move if other pieces have captures
        }

        // Regular moves
        return this.getRegularMoves(row, col);
    }

    hasAnyCaptures(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const captures = this.getCaptureMoves(row, col);
                    if (captures.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getRegularMoves(row, col) {
        const piece = this.board[row][col];
        const moves = [];
        const directions = this.getMoveDirections(piece);

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (this.isValidPosition(newRow, newCol) && !this.board[newRow][newCol]) {
                moves.push({ row: newRow, col: newCol, capture: false });
            }
        }

        return moves;
    }

    getCaptureMoves(row, col) {
        const piece = this.board[row][col];
        const captures = [];
        const directions = this.getMoveDirections(piece);

        for (const [dr, dc] of directions) {
            const jumpRow = row + dr;
            const jumpCol = col + dc;
            const landRow = row + dr * 2;
            const landCol = col + dc * 2;

            if (this.isValidPosition(landRow, landCol) &&
                this.board[jumpRow] && this.board[jumpRow][jumpCol] &&
                this.board[jumpRow][jumpCol].color !== piece.color &&
                !this.board[landRow][landCol]) {

                captures.push({
                    row: landRow,
                    col: landCol,
                    capture: true,
                    capturedRow: jumpRow,
                    capturedCol: jumpCol
                });
            }
        }

        return captures;
    }

    getMoveDirections(piece) {
        if (piece.king) {
            return [[-1, -1], [-1, 1], [1, -1], [1, 1]]; // All diagonal directions
        } else if (piece.color === 'red') {
            return [[-1, -1], [-1, 1]]; // Red moves up
        } else {
            return [[1, -1], [1, 1]]; // Black moves down
        }
    }

    highlightPossibleMoves() {
        this.possibleMoves.forEach(move => {
            const square = this.getSquareElement(move.row, move.col);
            square.classList.add('possible-move');
        });
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const move = this.possibleMoves.find(m => m.row === toRow && m.col === toCol);
        if (!move) return;

        const piece = this.board[fromRow][fromCol];

        // Move piece
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        // Handle capture
        if (move.capture) {
            this.board[move.capturedRow][move.capturedCol] = null;
            if (piece.color === 'red') {
                this.blackPieces--;
            } else {
                this.redPieces--;
            }

            // Check for additional captures
            const additionalCaptures = this.getCaptureMoves(toRow, toCol);
            if (additionalCaptures.length > 0) {
                this.clearSelection();
                this.selectPiece(toRow, toCol);
                this.statusElement.textContent = 'Multiple capture! Continue capturing.';
                this.updateDisplay();
                return;
            }
        }

        // Check for king promotion
        if ((piece.color === 'red' && toRow === 0) || (piece.color === 'black' && toRow === 7)) {
            piece.king = true;
        }

        this.clearSelection();
        this.switchPlayer();
        this.updateDisplay();

        // Check for game over
        if (this.checkGameOver()) {
            this.endGame();
        } else if (this.currentPlayer === 'black' && !this.computerThinking) {
            this.computerThinking = true;
            setTimeout(() => {
                this.makeComputerMove();
                this.computerThinking = false;
            }, 500);
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';

        if (this.currentPlayer === 'red') {
            this.playerRedElement.classList.add('active');
            this.playerBlackElement.classList.remove('active');
            this.statusElement.textContent = 'Your turn - Click a red piece to move';
        } else {
            this.playerRedElement.classList.remove('active');
            this.playerBlackElement.classList.add('active');
            this.statusElement.textContent = 'Computer is thinking...';
        }
    }

    makeComputerMove() {
        console.log('makeComputerMove called');
        
        if (this.gameOver || this.currentPlayer !== 'black' || this.computerThinking === false) {
            console.log('Computer move cancelled:', { gameOver: this.gameOver, currentPlayer: this.currentPlayer, computerThinking: this.computerThinking });
            this.computerThinking = false;
            return;
        }

        try {
            // Simple approach: find all black pieces and their moves
            const moves = [];
            
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = this.board[row][col];
                    if (piece && piece.color === 'black') {
                        // Check all possible moves for this piece
                        const directions = piece.king ? 
                            [[-1, -1], [-1, 1], [1, -1], [1, 1]] : 
                            [[1, -1], [1, 1]]; // Black moves down
                        
                        for (const [dr, dc] of directions) {
                            const newRow = row + dr;
                            const newCol = col + dc;
                            
                            // Regular move
                            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && 
                                !this.board[newRow][newCol]) {
                                moves.push({
                                    fromRow: row,
                                    fromCol: col,
                                    toRow: newRow,
                                    toCol: newCol,
                                    capture: false
                                });
                            }
                            
                            // Capture move
                            const jumpRow = row + dr * 2;
                            const jumpCol = col + dc * 2;
                            if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8 &&
                                this.board[newRow][newCol] && 
                                this.board[newRow][newCol].color === 'red' &&
                                !this.board[jumpRow][jumpCol]) {
                                moves.push({
                                    fromRow: row,
                                    fromCol: col,
                                    toRow: jumpRow,
                                    toCol: jumpCol,
                                    capture: true,
                                    capturedRow: newRow,
                                    capturedCol: newCol
                                });
                            }
                        }
                    }
                }
            }
            
            console.log('Simple computer found moves:', moves.length);
            
            if (moves.length === 0) {
                console.log('No moves available for computer, ending game');
                this.endGame();
                return;
            }

            // Prefer captures
            const captures = moves.filter(m => m.capture);
            const selectedMoves = captures.length > 0 ? captures : moves;
            const bestMove = selectedMoves[Math.floor(Math.random() * selectedMoves.length)];
            
            console.log('Computer selected move:', bestMove);
            this.makeMove(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
            
        } catch (error) {
            console.error('Error in makeComputerMove:', error);
            this.statusElement.textContent = 'Computer error - your turn';
            this.currentPlayer = 'red';
            this.switchPlayer();
        }
    }

    getMediumMove(moves) {
        // Prefer captures, then king moves, then random
        const captures = moves.filter(m => m.capture);
        if (captures.length > 0) {
            return captures[Math.floor(Math.random() * captures.length)];
        }

        const kingMoves = moves.filter(m => this.board[m.fromRow][m.fromCol].king);
        if (kingMoves.length > 0) {
            return kingMoves[Math.floor(Math.random() * kingMoves.length)];
        }

        return moves[Math.floor(Math.random() * moves.length)];
    }

    getHardMove(moves) {
        // Simple evaluation: prioritize captures, avoid being captured, advance pieces
        let bestScore = -Infinity;
        let bestMoves = [];

        for (const move of moves) {
            let score = 0;

            // Prioritize captures
            if (move.capture) score += 10;

            // Prioritize king promotion
            if (move.toRow === 7) score += 5;

            // Advance pieces
            score += move.toRow - move.fromRow;

            // King moves are valuable
            if (this.board[move.fromRow][move.fromCol].king) score += 2;

            if (score > bestScore) {
                bestScore = score;
                bestMoves = [move];
            } else if (score === bestScore) {
                bestMoves.push(move);
            }
        }

        return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }

    getAllPossibleMoves(color) {
        console.log('getAllPossibleMoves called for color:', color);
        const moves = [];
        let hasCaptures = false;
        let pieceCount = 0;

        // First pass: check for captures
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    pieceCount++;
                    const captures = this.getCaptureMoves(row, col);
                    if (captures.length > 0) {
                        hasCaptures = true;
                        captures.forEach(capture => {
                            moves.push({
                                fromRow: row,
                                fromCol: col,
                                toRow: capture.row,
                                toCol: capture.col,
                                capture: true,
                                capturedRow: capture.capturedRow,
                                capturedCol: capture.capturedCol
                            });
                        });
                    }
                }
            }
        }

        console.log(`Found ${pieceCount} pieces for ${color}, ${moves.length} capture moves`);

        // If captures available, only return captures
        if (hasCaptures) {
            console.log('Returning capture moves:', moves);
            return moves;
        }

        // Second pass: regular moves
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const regularMoves = this.getRegularMoves(row, col);
                    regularMoves.forEach(move => {
                        moves.push({
                            fromRow: row,
                            fromCol: col,
                            toRow: move.row,
                            toCol: move.col,
                            capture: false
                        });
                    });
                }
            }
        }

        console.log(`Total moves for ${color}:`, moves.length);
        return moves;
    }

    checkGameOver() {
        // Check if either player has no pieces
        if (this.redPieces === 0 || this.blackPieces === 0) {
            return true;
        }

        // Check if current player has no moves
        const moves = this.getAllPossibleMoves(this.currentPlayer);
        return moves.length === 0;
    }

    endGame() {
        this.gameOver = true;
        let winner;

        if (this.redPieces === 0) {
            winner = 'Computer wins!';
        } else if (this.blackPieces === 0) {
            winner = 'You win!';
        } else {
            const redMoves = this.getAllPossibleMoves('red');
            const blackMoves = this.getAllPossibleMoves('black');

            if (redMoves.length === 0) {
                winner = 'Computer wins! (No moves available)';
            } else if (blackMoves.length === 0) {
                winner = 'You win! (Computer has no moves)';
            } else {
                winner = 'Draw!';
            }
        }

        this.statusElement.textContent = winner;

        // Show game over overlay
        const overlay = document.createElement('div');
        overlay.className = 'checkers-game-over';
        overlay.innerHTML = `
            <div class="checkers-game-over-text">${winner}</div>
            <button class="checkers-new-game-btn" onclick="this.parentElement.remove(); window.gameManager.currentGame.newGame()">New Game</button>
        `;
        this.boardElement.appendChild(overlay);
    }

    updateDisplay() {
        this.redCountElement.textContent = this.redPieces;
        this.blackCountElement.textContent = this.blackPieces;
        this.createBoard();
    }

    newGame() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.possibleMoves = [];
        this.redPieces = 12;
        this.blackPieces = 12;
        this.gameOver = false;
        this.captureSequence = [];
        this.computerThinking = false;

        // Remove any overlays
        const overlay = this.boardElement.querySelector('.checkers-game-over');
        if (overlay) overlay.remove();

        this.playerRedElement.classList.add('active');
        this.playerBlackElement.classList.remove('active');
        this.statusElement.textContent = 'Your turn - Click a red piece to move';

        this.updateDisplay();
    }

    getSquareElement(row, col) {
        return this.boardElement.children[row * 8 + col];
    }

    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
}