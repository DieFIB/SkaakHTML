import { createGame, joinGame, subscribeToGame } from "./firestore.js";

export async function initLobby(callback) {
  const params = new URLSearchParams(window.location.search);
  let mode = params.get('mode');
  let gameId = params.get('code');

  if(mode === 'generate') {
    // Generate 4-digit numeric code
    gameId = Math.floor(1000 + Math.random() * 9000).toString();
    document.getElementById('game-code').innerText = gameId;

    await createGame(gameId);
    callback(gameId, true); // true = creator
  }
  else if(mode === 'join' && gameId) {
    const exists = await joinGame(gameId);
    if(!exists){
      alert("Game code not found!");
      window.location.href = 'index.html';
      return;
    }
    document.getElementById('game-code').innerText = gameId;
    callback(gameId, false); // false = joiner
  } else {
    alert("Invalid mode or code.");
    window.location.href = 'index.html';
  }
}
