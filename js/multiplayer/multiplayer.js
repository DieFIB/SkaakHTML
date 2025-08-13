// js/multiplayer/multiplayer.js
import { initLobby } from "./lobby.js";
import { createGame, subscribeToGame, updateGame } from "./firestore.js";

// Use existing single-player board logic
// Assume window.initBoard() and window.renderBoard() exist (from chessboard.js)

let gameId;
let currentPlayerColor;
let localTurn = "white";

async function startMultiplayer() {
  await initLobby(async (id, isCreator) => {
    gameId = id;
    currentPlayerColor = isCreator ? "white" : "black";

    if (isCreator) {
      // initialize Firestore board
      initBoard();
      renderBoard();
      const initialBoard = JSON.parse(JSON.stringify(window.board));
      await createGame(gameId, initialBoard);
    }

    // subscribe to real-time updates
    subscribeToGame(gameId, (data) => {
      if (!data) return;
      window.board = data.board;
      localTurn = data.turn;
      renderBoard();
      document.getElementById("status").innerText = 
        localTurn === currentPlayerColor ? "Your turn" : "Opponent's turn";
    });

    // attach click handler for moves
    attachBoardClicks();
  });
}

function attachBoardClicks() {
  const boardDiv = document.getElementById("board");
  boardDiv.querySelectorAll(".square").forEach(sq => {
    sq.addEventListener("click", async (e) => {
      const r = parseInt(e.target.dataset.r);
      const c = parseInt(e.target.dataset.c);

      if (!window.selectedSquare) {
        const piece = window.board[r][c];
        if (piece && window.pieceColor(piece) === currentPlayerColor && localTurn === currentPlayerColor) {
          window.selectedSquare = { r, c };
          window.highlightSelection();
        }
      } else {
        const moves = window.getLegalMoves(window.board, window.selectedSquare.r, window.selectedSquare.c, localTurn, window.castlingRights, window.enPassantTarget);
        const isLegal = moves.some(m => m[0] === r && m[1] === c);

        if (isLegal && localTurn === currentPlayerColor) {
          // make move locally
          window.makeMove(window.selectedSquare, { r, c });
          // push update to Firestore
          await updateGame(gameId, JSON.parse(JSON.stringify(window.board)), localTurn === "white" ? "black" : "white", { from: window.selectedSquare, to: { r, c } });
          localTurn = localTurn === "white" ? "black" : "white";
        }
        window.selectedSquare = null;
        renderBoard();
      }
    });
  });
}

// Start multiplayer after page load
window.addEventListener("load", () => {
  startMultiplayer();
});
