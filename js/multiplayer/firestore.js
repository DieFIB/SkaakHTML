import { doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

export async function createGame(gameId){
  const gameRef = doc(window.db, "games", gameId);
  await setDoc(gameRef, { board:null, turn:'white', started:false, lastMove:null, timestamp:Date.now() });
}

export async function joinGame(gameId){
  const gameRef = doc(window.db, "games", gameId);
  const snap = await getDoc(gameRef);
  return snap.exists();
}

export function subscribeToGame(gameId, callback){
  const gameRef = doc(window.db, "games", gameId);
  return onSnapshot(gameRef, (docSnap)=>{
    if(docSnap.exists()){
      callback(docSnap.data());
    }
  });
}

export async function updateGame(gameId, data){
  const gameRef = doc(window.db, "games", gameId);
  await setDoc(gameRef, data, { merge:true });
}
