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
// let aliveCells = new Set([
//     "5,1", "5,2", "6,1", "6,2",
//     "5,11", "6,11", "7,11", "4,12", "3,13", "3,14", "8,12", "9,13", "9,14", "6,15", "4,16", "5,17", "6,17", "7,17", "6,18", "8,16",
//     "3,21", "4,21", "5,21", "3,22", "4,22", "5,22", "2,23", "6,23", "1,25", "2,25", "6,25", "7,25",
//     "3,35", "4,35", "3,36", "4,36"
// ]);
let fps = 0;
let lastFrameTime = 0;
let frameCount = 0;

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

    let templateSelect = document.getElementById("template-select");
    templateSelect.addEventListener("change", function() {
        let selectedTemplate = templateSelect.value;
        loadTemplate(selectedTemplate);
    });
}

function loadTemplate(template) {
    let pattern;

    if(template=="GosperGun"){
        pattern = [
            "5,1", "5,2", "6,1", "6,2",
            "5,11", "6,11", "7,11", "4,12", "3,13", "3,14", "8,12", "9,13", "9,14", "6,15", "4,16", "5,17", "6,17", "7,17", "6,18", "8,16",
            "3,21", "4,21", "5,21", "3,22", "4,22", "5,22", "2,23", "6,23", "1,25", "2,25", "6,25", "7,25",
            "3,35", "4,35", "3,36", "4,36"
        ];
    }

    else if(template=="glider"){
        pattern = [
            "1,0",
            "2,1",
            "0,2", "1,2", "2,2"
        ];
    }

    else if (template == "lwss") {
        pattern = [
            "6,5", "7,5", "8,5", "9,5",
            "5,6",
            "9,6",
            "9,7",
            "5,8", "8,8"
        ];
    }

    else if (template == "pulsar") {
        pattern = [
            "7,9", "8,9", "9,9",
            "7,14", "8,14", "9,14",
            "12,9", "13,9", "14,9",
            "12,14", "13,14", "14,14",
            "5,7", "5,8", "5,9",
            "10,7", "10,8", "10,9",
            "5,12", "5,13", "5,14",
            "10,12", "10,13", "10,14",
            "12,7", "12,8", "12,9",
            "17,7", "17,8", "17,9",
            "12,12", "12,13", "12,14",
            "17,12", "17,13", "17,14"
        ];
    }
    else{
        pattern=[];
    }

    aliveCells.clear();

    for (let cell of pattern) {
        aliveCells.add(cell);
    }
    
    renderGame();
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
    board.style.height = `85vh`;

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
    updateFps();
}

function updateFps() {
    let now = performance.now();
    let delta = now - lastFrameTime;
    lastFrameTime = now;
    let currentFps = 1000 / delta;
    let fpsCounter = document.getElementById("fpsCounter");
    fpsCounter.innerText = Math.round(currentFps) + " FPS";
}
