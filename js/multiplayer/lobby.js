// js/multiplayer/lobby.js
import { createGame, gameExists } from "./firestore.js";

export async function initLobby(callback) {
  let gameId = prompt("Enter a game code to join or leave blank to create a new game:");

  if (!gameId) {
    // generate new 6-character game ID
    gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    alert("New game created! Share this code with opponent: " + gameId);

    // initialize empty board
    callback(gameId, true);
  } else {
    const exists = await gameExists(gameId);
    if (!exists) {
      alert("Game ID not found. Refresh and try again.");
      return;
    }
    callback(gameId, false);
  }
}
