// lobby.js
import { createGame, joinGame, gameExists } from "./firestore.js";

export async function initLobby(callback) {
  let gameId = prompt("Enter a game code to join or leave blank to create new game:");

  if (!gameId) {
    // Create new game ID
    gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    alert("New game created! Share this code with opponent: " + gameId);

    callback(gameId, true); // true = creator
  } else {
    const exists = await gameExists(gameId);
    if (!exists) {
      alert("Game ID not found. Refresh and try again.");
      return;
    }
    callback(gameId, false); // false = joiner
  }
}
