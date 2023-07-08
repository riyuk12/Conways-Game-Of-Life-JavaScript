let board;
let cellSize = 12; //px
let rows;
let columns;
let cells = [];
let gameStarted = false;
const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
];

window.onload = function() {
    board = document.getElementById("board");
    updateBoard();
    fillCells();
    let startButton = document.getElementById("start");
    startButton.addEventListener("click", startGame);
}

function updateBoard() {
    let boardWidth = board.offsetWidth;
    let boardHeight = board.offsetHeight;
    columns = Math.floor(boardWidth / cellSize);
    rows = Math.floor(boardHeight / cellSize);

    //set the size of the board to fit the cells
    board.style.width = `${columns * cellSize}px`;
    board.style.height = `${(rows * cellSize)+1}px`;

    //set number of columns and rows in grid
    board.style.gridTemplateColumns = `repeat(${columns}, ${cellSize}px)`;
    board.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
}

//fill the cells in the board
function fillCells() {
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cells")
            cell.style.height = `${cellSize}px`;
            let isAlive = false;
            row.push(isAlive);
            cell.addEventListener("click", () => {
                if (!gameStarted) {
                    isAlive = !isAlive;
                    row[j] = isAlive;
                    if (isAlive) {
                        cell.classList.add("alive");
                    } else {
                        cell.classList.remove("alive");
                    }
                }
            });
            board.appendChild(cell);
        }
        cells.push(row);
    }
}

function startGame() {
    gameStarted = true;
    setInterval(updateGame, 100); // update the game state every 100ms
}

function updateGame() {
    // create a new array to store the updated game state
    let newCells = [];
    for (let i = 0; i < rows; i++) {
        let newRow = [];
        for (let j = 0; j < columns; j++) {
            let isAlive = cells[i][j];
            let neighbors = countNeighbors(i, j);
            if (isAlive && neighbors < 2) {
                isAlive = false;
            } else if (isAlive && neighbors > 3) {
                isAlive = false;
            } else if (!isAlive && neighbors === 3) {
                isAlive = true;
            }
            newRow.push(isAlive);
        }
        newCells.push(newRow);
    }

    // update the game state and render it
    cells = newCells;
    renderGame();
}

function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            let r = row + i;
            let c = col + j;
            if (r >= 0 && r < rows && c >= 0 && c < columns) {
                count += cells[r][c] ? 1 : 0;
            }
        }
    }
    return count;
}

function renderGame() {
    let cellElements = document.querySelectorAll(".cells");
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let index = i * columns + j;
            let cellElement = cellElements[index];
            let isAlive = cells[i][j];
            if (isAlive) {
                cellElement.classList.add("alive");
            } else {
                cellElement.classList.remove("alive");
            }
        }
    }
}
