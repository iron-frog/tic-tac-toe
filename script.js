const GameBoard = (() => {
  const rows = 3;
  const columns = 3;
  let board = [];

  function initBoard() {
    for (let i = 0; i < rows; i++) {
      board.push([]);
      for (let j = 0; j < columns; j++) {
        board[i].push("[ ]");
      }
    }
  }

  const addToken = (token, board, row, column) => {
    const position = board[row][column];
    position.includes("x" || "o")
      ? console.log("something inside")
      : (board[row][column] = `[${token}]`);
    // board[row][column] = `[${token}]`;
  };

  const getBoard = () => board;

  return { initBoard, getBoard, addToken };
})();

GameBoard.initBoard();
let board = GameBoard.getBoard();
console.log(board);

const Player = (name, token) => {
  const getName = () => name;
  const getToken = () => token;
  return { getName, getToken };
};

const player1 = Player("Anthony", "x");
const player2 = Player("bob", "o");

GameBoard.addToken(player1.getToken(), board, 0, 1);
console.log(board);
GameBoard.addToken(player2.getToken(), board, 0, 1);
console.log(board);
