// firestore.js
import { doc, setDoc, getDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

export async function createGame(gameId, boardState) {
  const gameRef = doc(db, "games", gameId);
  await setDoc(gameRef, {
    board: boardState,
    currentPlayer: "white",
    playerWhite: true,
    playerBlack: false
  });
}

export async function joinGame(gameId) {
  const gameRef = doc(db, "games", gameId);
  await updateDoc(gameRef, { playerBlack: true });
}

export async function getGame(gameId) {
  const gameRef = doc(db, "games", gameId);
  const snap = await getDoc(gameRef);
  return snap.exists() ? snap.data() : null;
}

export function subscribeToGame(gameId, callback) {
  const gameRef = doc(db, "games", gameId);
  return onSnapshot(gameRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  });
}

export async function updateGame(gameId, newState) {
  const gameRef = doc(db, "games", gameId);
  await updateDoc(gameRef, newState);
}

export async function gameExists(gameId) {
  const gameRef = doc(db, "games", gameId);
  const snap = await getDoc(gameRef);
  return snap.exists();
}
