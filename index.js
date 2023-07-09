let board;
let cellSize = 25; //px
let rows;
let columns;
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
let aliveCells = new Set();

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

    let sizeSlider = document.getElementById("sizeSlider");
    sizeSlider.addEventListener("input", updateSize);
}

function clearBoard() {
    aliveCells.clear();
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
        aliveCells.add(`${row},${col}`);
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

function updateSize() {
    let sizeSlider = document.getElementById("sizeSlider");
    cellSize = parseInt(sizeSlider.value);
    remakeBoard();
}

function remakeBoard() {
    clearBoard();

    //re-size board
    board.style.width = `95vw`;
    board.style.height = `90vh`;

    // clear the board
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }
    
    updateBoard();
    fillCells();
}

//fill the cells in the board
function fillCells() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cells")
            cell.style.height = `${cellSize}px`;
            let isAlive = false;
            cell.addEventListener("click", () => {
                isAlive = !isAlive;
                if (isAlive) {
                    aliveCells.add(`${i},${j}`);
                    cell.classList.add("alive");
                } else {
                    aliveCells.delete(`${i},${j}`);
                    cell.classList.remove("alive");
                }
            });
            board.appendChild(cell);
        }
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
    let newAliveCells = new Set();
    let cellsToCheck = new Set();
    
    // add all the alive cells and their neighbors to the cellsToCheck Set
    for (let cell of aliveCells) {
        let [row, col] = cell.split(",").map(Number);
        cellsToCheck.add(cell);
        for (let op of operations) {
            let r = row + op[0];
            let c = col + op[1];
            if (r >= 0 && r < rows && c >= 0 && c < columns) {
                cellsToCheck.add(`${r},${c}`);
            }
        }
    }
    
    // check only the cells in the cellsToCheck Set
    for (let cell of cellsToCheck) {
        let [row, col] = cell.split(",").map(Number);
        let isAlive = aliveCells.has(cell);
        let neighbors = countNeighbors(row, col);
        if (isAlive && neighbors < 2) {
            isAlive = false;
        } else if (isAlive && neighbors > 3) {
            isAlive = false;
        } else if (!isAlive && neighbors === 3) {
            isAlive = true;
        }
        if (isAlive) {
            newAliveCells.add(cell);
        }
    }

    // update the game state and render it
    aliveCells = newAliveCells;
    renderGame();
}


function countNeighbors(row, col) {
    let count = 0;
    for (let i = 0; i < operations.length; i++) {
        let op = operations[i];
        let r = row + op[0];
        let c = col + op[1];
        if (r >= 0 && r < rows && c >= 0 && c < columns) {
            count += aliveCells.has(`${r},${c}`) ? 1 : 0;
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
            let isAlive = aliveCells.has(`${i},${j}`);
            if (isAlive) {
                cellElement.classList.add("alive");
            } else {
                cellElement.classList.remove("alive");
            }
        }
    }
}