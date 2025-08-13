import { doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

export async function createGame() {
  const code = String(Math.floor(Math.random()*10000)).padStart(4,'0');
  const gameRef = doc(db, "games", code);
  await setDoc(gameRef, {board: window.board, turn: 'white'});
  return code;
}

export async function joinGame(code) {
  const gameRef = doc(db, "games", code);
  const snap = await getDoc(gameRef);
  return snap.exists();
}

export function subscribeToGame(code, callback) {
  const gameRef = doc(db, "games", code);
  return onSnapshot(gameRef, (docSnap) => {
    if(docSnap.exists()) {
      callback(docSnap.data().board, docSnap.data().turn);
    }
  });
}
