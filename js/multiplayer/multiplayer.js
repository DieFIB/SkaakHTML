import { createGame, joinGame, subscribeToGame } from './firestore.js';

// Elements
const landing = document.getElementById('landing-screen');
const gameScreen = document.getElementById('game-screen');
const codeDisplay = document.getElementById('code-display');
const clockEl = document.getElementById('clock');
const statusEl = document.getElementById('status');
const generateBtn = document.getElementById('generate-btn');
const joinBtn = document.getElementById('join-btn');
const joinInput = document.getElementById('join-code');

let gameId = null;
let currentPlayerColor = 'white';
let timerInterval = null;
let secondsElapsed = 0;

// --- Event Listeners ---
generateBtn.addEventListener('click', async () => {
  gameId = await createGame();
  currentPlayerColor = 'white';
  startGame();
});

joinBtn.addEventListener('click', async () => {
  const input = joinInput.value.trim();
  if(!input || input.length !== 4) return alert("Enter a 4-digit code");
  const exists = await joinGame(input);
  if(!exists) return alert("Game not found");
  gameId = input;
  currentPlayerColor = 'black';
  startGame();
});

// --- Game Setup ---
function startGame() {
  landing.style.display = 'none';
  gameScreen.style.display = 'block';
  codeDisplay.innerText = gameId;

  window.initBoard();   // existing chessboard init
  window.renderBoard(); // render initial board

  subscribeToGame(gameId, (boardState, turn) => {
    if(boardState) {
      window.board = boardState;
      window.currentPlayer = turn;
      window.renderBoard();
    }
  });

  statusEl.innerText = "Waiting for player...";

  // Start clock on first move
  document.getElementById('board').addEventListener('click', startClockOnce, {once:true});
}

function startClockOnce() {
  timerInterval = setInterval(() => {
    secondsElapsed++;
    const mins = String(Math.floor(secondsElapsed/60)).padStart(2,'0');
    const secs = String(secondsElapsed%60).padStart(2,'0');
    clockEl.innerText = `${mins}:${secs}`;
  }, 1000);
}
