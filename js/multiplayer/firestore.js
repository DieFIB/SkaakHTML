// js/multiplayer/firestore.js
import { doc, setDoc, getDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Create a new game document
export async function createGame(gameId) {
  const gameRef = doc(window.db, "games", gameId);
  await setDoc(gameRef, {
    board: null,
    turn: "white",
    started: false,
    lastMove: null,
    timestamp: Date.now(),
    whiteClock: 0,
    blackClock: 0,
    whitePlayerId: null,
    blackPlayerId: null
  });
}

// Join an existing game
export async function joinGame(gameId) {
  const gameRef = doc(window.db, "games", gameId);
  const snap = await getDoc(gameRef);
  return snap.exists();
}

// Listen for updates
export function subscribeToGame(gameId, callback){
  const gameRef = doc(window.db, "games", gameId);
  return onSnapshot(gameRef, (docSnap)=>{
    if(docSnap.exists()){
      callback(docSnap.data());
    }
  });
}

// Update game data
export async function updateGame(gameId, data){
  const gameRef = doc(window.db, "games", gameId);
  await updateDoc(gameRef, data);
}
