/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** gameBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function gameBoard() {
  for (let i = 0; i < HEIGHT; i++) { //Build row for each width
    board.push(boardWidth());
  }
}

//Builds WIDTH of gameboard
function boardWidth() {
  const row = []
  for (let i = 0; i < WIDTH; i++) {
    row.push(null);
  }
  return row;
}

/** renderGameBoard: make HTML table and row of column tops. */

function renderGameBoard() {

  const htmlBoard = document.getElementById('board');

  //Creates top section of board where user clicks to insert game piece
  renderTopOfGameBoard(htmlBoard);

  //Build rest of game of game board
  renderBodyOfGameBoard(htmlBoard);
}

/** renderTopOfGameBoard: builds top section of board where user clicks to insert game piece*/
function renderTopOfGameBoard(board) {
  const top = document.createElement("tr");

  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick); //Event listener when user clicks

  for (var x = 0; x < WIDTH; x++) { //Adding cells into top row
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  board.append(top); //Append top portion to htmlBoard
}

/** renderBodyOfGameBoard: builds body section of game board where pieces display*/
function renderBodyOfGameBoard(board) {
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) { //y = HEIGHT - 1
    if (!board[y][x]) {
      return y; //return y if it's not filled
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const tableCell = document.getElementById(`${y}-${x}`);
  const piece = document.createElement('div');
  piece.classList.add('piece', `p${currPlayer}`);

  tableCell.append(piece); //Places piece into spot
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  /** check game conditions to see if game is over */
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }

  // switch players when turn is over
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
      y >= 0 &&
      y < HEIGHT &&
      x >= 0 &&
      x < WIDTH &&
      board[y][x] === currPlayer
    );
  }

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3]
      ];
      var vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x]
      ];
      var diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3]
      ];
      var diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3]
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

/** Restart Game  */
document.getElementById("restart").addEventListener("click", () => window.location.reload())

gameBoard();
renderGameBoard();