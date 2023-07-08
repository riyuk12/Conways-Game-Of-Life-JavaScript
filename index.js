let board;
let cellSize = 12//px;
let rows;
let columns

window.onload = function() {
    board = document.getElementById("board");
    updateBoard();
}

function update(){
    
}

function updateBoard() {
    let boardWidth = board.offsetWidth;
    let boardHeight = board.offsetHeight;
    columns = Math.floor(boardWidth / cellSize);
    rows = Math.floor(boardHeight / cellSize);

    //set the size of the board to fit the cells
    board.style.width = `${columns * cellSize}px`;
    board.style.height = `${rows * cellSize+1}px`;

    //set number of columns and rows in grid
    board.style.gridTemplateColumns = `repeat(${columns}, ${cellSize}px)`;
    board.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

    fillCells();
}

//fill the cells in the board
function fillCells(){
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cells")
            cell.style.height = `${cellSize}px`;
            board.appendChild(cell);
        }
    }
}
