const GameBoard = (() => {
  const rows = 3;
  const columns = 3;
  let board = [];

  function initBoard() {
    for (let i = 0; i < rows; i++) {
      board.push([]);
      for (let j = 0; j < columns; j++) {
        board[i].push("");
      }
    }
  }

  const addToken = (token, board, row, column) => {
    board[row][column] = `${token}`;
  };

  const checkCell = (row, column, board) => {
    const position = board[row][column];
    return position.includes("x" || "o") ? true : false;
  };

  const checkWin = (row, column, board, token) => {
    let rowMatch = 0;
    let columnMatch = 0;
    let diagAMatch = 0;
    let diagBMatch = 0;
    //Check horizontal
    for (let i = 0; i < board[row].length; i++) {
      if (board[row][i].includes(token) === false) {
        break;
      } else {
        rowMatch += 1;
      }
    }
    //check vertical
    for (let i = 0; i < board.length; i++) {
      if (board[i][column].includes(token) === false) {
        break;
      } else {
        columnMatch += 1;
      }
    }

    //check diagonal
    if (row == column) {
      for (let i = 0; i < board.length; i++) {
        if (board[i][i].includes(token) === false) {
          break;
        } else {
          diagAMatch += 1;
        }
      }
    }

    if (row + column == 2) {
      for (let i = 0; i < board.length; i++) {
        if (board[i][2 - i].includes(token) === false) {
          break;
        } else {
          diagBMatch += 1;
        }
      }
    }
    if (rowMatch === 3 || columnMatch === 3 || diagAMatch === 3 || diagBMatch) {
      return true;
    }
  };

  const getBoard = () => board;

  return { initBoard, getBoard, addToken, checkCell, checkWin };
})();

const Player = () => {
  let activePlayer = true;
  let playerToken;
  let playerName;
  const getName = () => playerName;
  const setName = (name) => (playerName = name);
  const getToken = () => playerToken;
  const setToken = (token) => (playerToken = token);
  const getActive = () => activePlayer;
  const setActive = () => (activePlayer = !activePlayer);
  return { getName, getToken, getActive, setActive, setToken, setName };
};

//renders window
const DisplayController = (() => {
  const renderBoard = (board, boardContainer) => {
    boardContainer.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const btn = document.createElement("button");
        btn.textContent = board[i][j];
        btn.dataset.row = i;
        btn.dataset.column = j;
        boardContainer.appendChild(btn);
      }
    }
  };

  const renderTurn = (player) => {
    const turnText = document.querySelector(".turn-order");
    turnText.textContent = `${player.getName()}'s turn: ${player.getToken()}`;
  };

  const winScreen = (player) => {
    const winOverlay = document.querySelector(".win-overlay");
    const winText = winOverlay.querySelector("span");
    winOverlay.classList.toggle("active");
    winText.classList.toggle("active");
    winText.textContent = `${player.getName()} WINS!`;
  };

  return { renderBoard, winScreen, renderTurn };
})();

//Controls game flow
const GameController = (() => {
  const boardContainer = document.querySelector(".board-container");
  const p1NameBtn = document.querySelector(".p1NameBtn");
  const p2NameBtn = document.querySelector(".p2NameBtn");
  const p1Form = document.querySelector(".p1Form");
  const p2Form = document.querySelector(".p2Form");
  const p1Label = document.querySelector(".p1Label");
  const p2Label = document.querySelector(".p2Label");
  const p1Input = document.querySelector("#p1Name");
  const p2Input = document.querySelector("#p2Name");

  GameBoard.initBoard();
  const board = GameBoard.getBoard();
  const player1 = Player();
  const player2 = Player();
  const display = DisplayController;
  display.renderBoard(board, boardContainer);
  //player2.setActive();
  let chosen = false;
  let currentPlayer = player1;

  const inputEvent = () => {
    p1Form.addEventListener("submit", (e) => {
      setName(e, p1Input.id, p1Label, p1NameBtn, player1);
    });
    p2Form.addEventListener("submit", (e) => {
      setName(e, p2Input.id, p2Label, p2NameBtn, player2);
    });
  };

  const setName = (e, id, label, btn, player) => {
    e.preventDefault();
    const input = e.target.querySelector(`#${id}`);
    const inputValue = input.value;
    input.disabled = true;
    btn.disabled = true;
    label.innerHTML = `Player ${
      id.includes("1") ? "1" : "2"
    } Name: ${inputValue}`;
    player.setName(inputValue);
  };

  const chooseToken = () => {
    const tokenBtn = document.querySelectorAll(".tokenBtn");
    tokenBtn.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        if (chosen === true) {
          return;
        }
        tokenBtn.forEach((btn) => btn.classList.remove("selected"));
        e.target.classList.add("selected");
        if (e.target.textContent == "o") {
          player1.setToken("o");
          player2.setToken("x");
        } else {
          player1.setToken("x");
          player2.setToken("o");
        }
        chosen = true;
        tokenBtn.forEach((btn) =>
          btn.removeEventListener("click", chooseToken)
        );
        const chosenBtnClass = e.target.classList.item(1);
        const otherBtn = Array.from(tokenBtn).find((btn) => {
          return (
            !btn.classList.contains(chosenBtnClass) &&
            btn.textContent !== e.target.textContent
          );
        });
        if (otherBtn) {
          otherBtn.classList.add("selected");
        }
      })
    );
  };

  boardContainer.addEventListener("click", (e) => {
    if (chosen === false || p1Input.value == "" || p2Input.value == "") {
      return;
    }
    playCell(e, currentPlayer);
  });

  const playRound = () => {
    currentPlayer = player1.getActive() ? player1 : player2;
    console.log(`${currentPlayer.getName()} turn:`, currentPlayer.getToken());
    display.renderTurn(currentPlayer);
    console.table(board);
  };

  const playCell = (e, currentPlayer) => {
    if (!e.target.matches("button")) {
      return;
    }
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    if (GameBoard.checkCell(row, column, board) == true) {
      return;
    }

    GameBoard.addToken(currentPlayer.getToken(), board, row, column);
    console.log(currentPlayer.getName() + ` Played ${row} , ${column}`);
    const win = GameBoard.checkWin(
      row,
      column,
      board,
      currentPlayer.getToken()
    );
    player1.setActive();
    player2.setActive();
    DisplayController.renderBoard(board, boardContainer);
    if (win) {
      display.winScreen(currentPlayer);
      return;
    }
    boardContainer.removeEventListener("click", playCell);
    playRound();
  };

  return { playRound, playCell, chooseToken, inputEvent };
})();

GameController.chooseToken();
GameController.inputEvent();
