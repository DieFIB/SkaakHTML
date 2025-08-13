// multiplayer.js
import { initLobby } from "./lobby.js";
import { createGame, joinGame, subscribeToGame, updateGame } from "./firestore.js";

// Ensure we use the existing board logic
import { initBoard, renderBoard, board, makeMove, currentPlayer, _renderBoardInternal } from "../chessboard.js";

let gameId;
let isCreator;
let playerColor;

// Initialize lobby and game
initLobby(async (id, creator) => {
  gameId = id;
  isCreator = creator;

  if (isCreator) {
    // Creator = white
    playerColor = "white";
    initBoard();
    await createGame(gameId, board);
    renderBoard();
  } else {
    // Joiner = black
    playerColor = "black";
    await joinGame(gameId);
    const data = await (await fetchGameOnce(gameId));
    Object.assign(board, data.board); // Copy board state
    _renderBoardInternal();
  }

  subscribeToGame(gameId, (data) => {
    // Update local board and current player
    Object.assign(board, data.board);
    window.currentPlayer = data.currentPlayer;
    _renderBoardInternal();
    updateStatus();
  });
});

async function fetchGameOnce(id) {
  return await (await import("./firestore.js")).getGame(id);
}

// Override makeMove to sync with Firestore
const originalMakeMove = makeMove;
window.makeMove = async function(from, to) {
  if (playerColor !== currentPlayer) return; // Only allow your turn
  originalMakeMove(from, to);
  // Update Firestore
  await updateGame(gameId, {
    board: board,
    currentPlayer: (currentPlayer === "white") ? "black" : "white"
  });
  updateStatus();
};

function updateStatus() {
  const statusDiv = document.getElementById("status");
  if (currentPlayer === playerColor) {
    statusDiv.innerText = "Your turn (" + playerColor + ")";
  } else {
    statusDiv.innerText = "Opponent's turn";
  }
}
