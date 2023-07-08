let board;
let cellSize = 30; //px
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
    
    let clearButton = document.getElementById("clear");
    clearButton.addEventListener("click", clearBoard);
    
    let randomButton = document.getElementById("random");
    randomButton.addEventListener("click", randomBoard);
}

function clearBoard() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            cells[i][j] = false;
        }
    }
    renderGame();
}

function randomBoard() {
    let randomInput = document.querySelector(".randomInpt");
    let percentage = parseInt(randomInput.value) || 50;
    let numCells = Math.floor((rows * columns * percentage) / 100);
    
    clearBoard();
    
    for (let i = 0; i < numCells; i++) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * columns);
        cells[row][col] = true;
    }
    
    renderGame();
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
                isAlive = !isAlive;
                row[j] = isAlive;
                cells[i][j] = isAlive;
                if (isAlive) {
                    cell.classList.add("alive");
                } else {
                    cell.classList.remove("alive");
                }
            });
            board.appendChild(cell);
        }
        cells.push(row);
    }
}


let intervalId;
function startGame() {
    if (gameStarted) {
        clearInterval(intervalId);
        gameStarted = false;
        document.getElementById("start").innerText="Start";
    } else {
        gameStarted = true;
        document.getElementById("start").innerText="Stop";
        intervalId = setInterval(updateGame, 100); // update the game state every 100ms
    }
}


function updateGame() {
    // create a new array to store the updated game state
    let newCells = [];
    for (let i = 0; i < rows; i++) {
        let newRow = [];
        for (let j = 0; j < columns; j++) {
            let isAlive = cells[i][j];
            if (isAlive || countNeighbors(i, j) > 0) { // only update cells that are alive or have alive neighbors
                let neighbors = countNeighbors(i, j);
                if (isAlive && neighbors < 2) {
                    isAlive = false;
                } else if (isAlive && neighbors > 3) {
                    isAlive = false;
                } else if (!isAlive && neighbors === 3) {
                    isAlive = true;
                }
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
    for (let i = 0; i < operations.length; i++) {
        let op = operations[i];
        let r = row + op[0];
        let c = col + op[1];
        if (r >= 0 && r < rows && c >= 0 && c < columns) {
            count += cells[r][c] ? 1 : 0;
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
