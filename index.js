let board;
let cellSize = 23; //px
let boardHeight=78;
let boardWidth=95;
let rows;
let columns;
let gameStarted = false;
let selectedTemplate=[];
let selection=false;
let animTime=100;
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

    let cellSlider = document.getElementById("cellSlider");
    cellSlider.addEventListener("input", updateSize);

    let rowSlider = document.getElementById("rowSlider");
    rowSlider.addEventListener("input", updateSize);

    let columnSlider = document.getElementById("columnSlider");
    columnSlider.addEventListener("input", updateSize);

    let saveButton = document.getElementById("save");
    saveButton.addEventListener("click", nameTemplate);
    let overlay=document.getElementById("overlay");

    let templateSelect = document.getElementById("template-select");
    templateSelect.addEventListener("click", function() {
        selectedTemplate = templateSelect.value;
        selection=true;
    });
}

const nameTemplate=()=>{
    let name=prompt("enter template name")
    saveTemplate(name)
}

function loadTemplate(template, startRow, startCol) {
    let pattern;
    console.log(startCol,startRow)

    if (template === "saved") {
        let aliveCellsString = localStorage.getItem("template");
        pattern = JSON.parse(aliveCellsString);
        pattern=pattern[1,pattern.length]
    }

    else if(template === "GosperGun"){
        pattern = [
            "5,1", "5,2", "6,1", "6,2",
            "5,11", "6,11", "7,11", "4,12", "3,13", "3,14", "8,12", "9,13", "9,14", "6,15", "4,16", "5,17", "6,17", "7,17", "6,18", "8,16",
            "3,21", "4,21", "5,21", "3,22", "4,22", "5,22", "2,23", "6,23", "1,25", "2,25", "6,25", "7,25",
            "3,35", "4,35", "3,36", "4,36"
        ];
    }

    else if(template === "glider"){
        pattern = [
            "1,0",
            "2,1",
            "0,2", "1,2", "2,2"
        ];
    }

    else if (template === "lwssV") {
        pattern = [
            "3,2", "4,2", "5,2", "6,2",
            "2,3","6,3",
            "6,4",
            "2,5", "5,5"
        ];
    }

    else if(template === "lwssH"){
        pattern=[
            "5,6","2,3","4,3","5,4","5,5","5,7","4,7","3,7","2,6"
        ]
    }

    else if (template === "pulsar") {
        pattern = [
            "9,10","8,10","7,10","13,10","14,10","15,10","15,12","14,12","13,12","9,12","8,12","7,12","10,13","10,14","10,15","12,13","12,14","12,15","10,9","10,8","10,7","12,9","12,8","12,7","5,8","5,7","7,5","8,5","5,9","9,5","5,13","5,14","5,15","9,17","8,17","7,17","13,17","15,17","17,13","17,14","17,15","14,17","17,8","17,7","17,9","14,5","15,5","13,5"
        ]
    }

    else if(template === "period15"){
        pattern=[
            "3,3","3,4","3,5","4,4","5,4","6,4","6,3","6,5","8,3","9,5","9,3","9,4","8,5","8,4","11,3","11,4","11,5","12,4","13,4","14,3","14,4","14,5"
        ]
    }

    else if(template === "oscillator"){
        pattern=[
            "10,26","10,27","9,28","9,27","11,27","11,28","10,28","8,30","7,30","7,31","8,31","12,30","12,31","13,31","13,30","10,20","9,20","9,19","10,19","10,39","11,39","11,40","10,40"
        ]
    }

    else if(template==="wallV"){
        pattern=[
            "3,8","3,9","4,8","4,9","5,8","5,9","6,8","6,9","7,8","7,9","8,8","8,9","9,8","9,9","10,8","10,9","11,8","11,9","12,8","12,9"
        ]
    }

    else if(template==="wallH"){
        pattern=[
            "3,15","4,16","3,16","4,15","4,17","3,18","3,17","4,18","3,19","4,20","3,20","4,19","3,21","4,21","3,22","4,22","3,23","4,23","3,24","4,24"
        ]
    }
    else{
        pattern=[];
    }

    let templateStartRow = Infinity;
    let templateStartCol = Infinity;
    for (let cell of pattern) {
        let [row, col] = cell.split(",").map(Number);
        templateStartRow = Math.min(templateStartRow, row);
        templateStartCol = Math.min(templateStartCol, col);
    }

    console.log(templateStartRow,templateStartCol);

    if(overlay.checked  == false){
        aliveCells.clear();
    }
    

    for (let cell of pattern) {
        let [row, col] = cell.split(",").map(Number);
        row += startRow -templateStartRow;
        col += startCol -templateStartCol;
        aliveCells.add(`${row},${col}`);
    }
    
    renderGame();
}

function saveTemplate(name) {
    let aliveCellsArray = [name,...aliveCells];
    let aliveCellsString = JSON.stringify(aliveCellsArray);

    //save to localStorage
    localStorage.setItem("template", aliveCellsString);
}

if (localStorage.getItem("template") !== null) {
    let templateSelect = document.getElementById("template-select");
    let savedOption = document.createElement("option");
    savedOption.value = "saved";
    savedOption.text = "Saved Template";
    templateSelect.add(savedOption);
}

function clearBoard() {
    aliveCells.clear();
    renderGame();
}

function randomBoard() {
    let randomInput = document.querySelector(".randomInpt");
    let percentage = parseInt(randomInput.value);
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
    let cellSlider = document.getElementById("cellSlider");
    cellSize = parseInt(cellSlider.value);

    let rowSlider = document.getElementById("rowSlider");
    boardHeight = parseInt(rowSlider.value);

    let columnSlider = document.getElementById("columnSlider");
    boardWidth = parseInt(columnSlider.value);
    remakeBoard();
}

function remakeBoard() {
    clearBoard();

    //re-size board
    board.style.width = `${boardWidth}vw`;
    board.style.height = `${boardHeight}vh`;

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
                if(selection){
                    loadTemplate(selectedTemplate, i, j);
                    selection=false;
                }
                else{
                    if (isAlive) {
                        aliveCells.add(`${i},${j}`);
                        cell.classList.add("alive");
                    } else {
                        aliveCells.delete(`${i},${j}`);
                        cell.classList.remove("alive");
                    }
                }
            });
            board.appendChild(cell);
        }
    }
}

//render time
let intervalId;
function startGame() {
    animTime = parseInt(document.querySelector("#animationTime").value);
    if (gameStarted) {
        clearInterval(intervalId);
        gameStarted = false;
        document.getElementById("start").innerText="Start";
    } else {
        gameStarted = true;
        document.getElementById("start").innerText="Stop";
        intervalId = setInterval(updateGame, animTime); // update the game state every 100ms
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

    //console log current alive cells
    let aliveCellsArray = [...aliveCells];
    console.log(JSON.stringify(aliveCellsArray));

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
