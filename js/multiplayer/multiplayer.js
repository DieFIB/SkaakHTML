import { initLobby } from "./lobby.js";
import { subscribeToGame, updateGame } from "./firestore.js";

// Basic board setup
let board = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R']
];

const piecesUnicode = { 'r':'♜','n':'♞','b':'♝','q':'♛','k':'♚','p':'♟',
                        'R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔','P':'♙','':'' };

let selectedSquare=null, currentPlayer='white', gameId=null;
let timerInterval=null, seconds=0;

function renderBoard(){
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML='';
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const sq = document.createElement('div');
      sq.className = 'square ' + ((r+c)%2===0?'light':'dark');
      sq.dataset.r = r; sq.dataset.c = c;
      sq.innerText = piecesUnicode[board[r][c]];
      sq.addEventListener('click', onSquareClick);
      boardDiv.appendChild(sq);
    }
  }
  highlightSelection();
  updateStatus();
}

function onSquareClick(e){
  const r=parseInt(e.target.dataset.r);
  const c=parseInt(e.target.dataset.c);
  if(!selectedSquare && board[r][c] && pieceColor(board[r][c])===currentPlayer){
    selectedSquare={r,c};
  } else if(selectedSquare){
    board[r][c]=board[selectedSquare.r][selectedSquare.c];
    board[selectedSquare.r][selectedSquare.c]='';
    selectedSquare=null;
    currentPlayer = currentPlayer==='white'?'black':'white';
    updateGame(gameId,{ board, turn:currentPlayer });
  }
  renderBoard();
}

function pieceColor(p){ return p.toUpperCase()===p?'white':'black'; }
function highlightSelection(){
  if(!selectedSquare) return;
  document.querySelectorAll('.square').forEach(sq=>{
    if(parseInt(sq.dataset.r)===selectedSquare.r && parseInt(sq.dataset.c)===selectedSquare.c){
      sq.classList.add('selected');
    }
  });
}
function updateStatus(){ document.getElementById('status').innerText = `${currentPlayer}'s turn`; }

function startClock(){
  if(timerInterval) return;
  timerInterval=setInterval(()=>{
    seconds++;
    const m=Math.floor(seconds/60).toString().padStart(2,'0');
    const s=(seconds%60).toString().padStart(2,'0');
    document.getElementById('game-clock').innerText=`${m}:${s}`;
  },1000);
}

window.addEventListener('load', ()=>{
  initLobby((id,isCreator)=>{
    gameId=id;
    if(isCreator){
      renderBoard();
    }
    subscribeToGame(gameId,(data)=>{
      if(data.board) board=data.board;
      currentPlayer=data.turn;
      renderBoard();
      startClock();
    });
  });
});
