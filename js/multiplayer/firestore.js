// js/multiplayer/firestore.js
import { doc, setDoc, getDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Create a new game in Firestore
export async function createGame(gameId, initialBoard) {
  const gameRef = doc(window.db, "chessGames", gameId);
  await setDoc(gameRef, {
    board: initialBoard,
    turn: "white",
    lastMove: null
  });
}

// Check if a game exists
export async function gameExists(gameId) {
  const gameRef = doc(window.db, "chessGames", gameId);
  const snap = await getDoc(gameRef);
  return snap.exists();
}

// Subscribe to real-time game updates
export function subscribeToGame(gameId, callback) {
  const gameRef = doc(window.db, "chessGames", gameId);
  return onSnapshot(gameRef, (snap) => {
    if (snap.exists()) callback(snap.data());
  });
}

// Update game state (board and turn)
export async function updateGame(gameId, board, turn, lastMove) {
  const gameRef = doc(window.db, "chessGames", gameId);
  await updateDoc(gameRef, { board, turn, lastMove });
}
