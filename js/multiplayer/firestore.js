// js/multiplayer/firestore.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function createGame(gameId, initialData) {
  await setDoc(doc(db,"games",gameId), initialData);
}

export function subscribeToGame(gameId, callback){
  return onSnapshot(doc(db,"games",gameId),(docSnap)=>{
    if(docSnap.exists()) callback(docSnap.data());
  });
}

export async function updateGame(gameId, data){
  await updateDoc(doc(db,"games",gameId), data);
}
