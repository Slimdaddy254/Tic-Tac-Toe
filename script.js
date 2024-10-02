 // Gameboard module
 const Gameboard = (() => {
    let board = Array(9).fill('');

    const getBoard = () => board;

    const setMark = (index, mark) => {
        if (board[index] === '') {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const reset = () => {
        board = Array(9).fill('');
    };

    return { getBoard, setMark, reset };
})();

// Player factory
const Player = (name, mark) => {
    return { name, mark };
};

// Game controller module
const GameController = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = (player1Name, player2Name) => {
        players = [
            Player(player1Name, 'X'),
            Player(player2Name, 'O')
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.reset();
    };

    const getCurrentPlayer = () => players[currentPlayerIndex];

    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const checkWinner = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            const board = Gameboard.getBoard();
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    };

    const checkDraw = () => {
        return Gameboard.getBoard().every(cell => cell !== '');
    };

    const playTurn = (index) => {
        if (gameOver) return false;

        const currentPlayer = getCurrentPlayer();
        if (Gameboard.setMark(index, currentPlayer.mark)) {
            if (checkWinner()) {
                gameOver = true;
                return { status: 'win', player: currentPlayer };
            } else if (checkDraw()) {
                gameOver = true;
                return { status: 'draw' };
            } else {
                switchPlayer();
                return { status: 'continue', nextPlayer: getCurrentPlayer() };
            }
        }
        return false;
    };

    return { start, playTurn, getCurrentPlayer };
})();

// Display controller module
const DisplayController = (() => {
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const startButton = document.getElementById('start-game');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');

    const renderBoard = () => {
        boardElement.innerHTML = '';
        Gameboard.getBoard().forEach((mark, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = mark;
            cell.addEventListener('click', () => cellClick(index));
            boardElement.appendChild(cell);
        });
    };

    const cellClick = (index) => {
        const result = GameController.playTurn(index);
        if (result) {
            renderBoard();
            if (result.status === 'win') {
                statusElement.textContent = `${result.player.name} wins!`;
            } else if (result.status === 'draw') {
                statusElement.textContent = "It's a draw!";
            } else {
                statusElement.textContent = `${result.nextPlayer.name}'s turn`;
            }
        }
    };

    const init = () => {
        resetButton.addEventListener('click', resetGame);
        startButton.addEventListener('click', startGame);
    };

    const startGame = () => {
        const player1Name = player1Input.value || 'Player 1';
        const player2Name = player2Input.value || 'Player 2';
        GameController.start(player1Name, player2Name);
        renderBoard();
        statusElement.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
    };

    const resetGame = () => {
        startGame();
    };

    return { init, renderBoard };
})();

DisplayController.init();