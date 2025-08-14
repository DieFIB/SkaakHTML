// js/chessboard/chessboard.js
import { getLegalMoves, isInCheck } from './moves.js';
import { isMoveAllowed, updateCastlingRights, isGameOver } from '../rules.js';
import { updateGame, subscribeToGame } from '../multiplayer/firestore.js';

window.board = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R']
];

const piecesUnicode = {
  'r':'♜','n':'♞','b':'♝','q':'♛','k':'♚','p':'♟',
  'R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔','P':'♙','':''
};

window.selectedSquare = null;
window.currentPlayer = 'white';
window.castlingRights = {whiteK:true,whiteQ:true,blackK:true,blackQ:true};
window.enPassantTarget = null;
let gameId = null;

window.renderBoard = function(){
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML='';

  let legalSquares=[];
  if(window.selectedSquare){
    const {r,c}=window.selectedSquare;
    legalSquares = getLegalMoves(window.board,r,c,window.currentPlayer,window.castlingRights,window.enPassantTarget);
  }

  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const sq=document.createElement('div');
      sq.className='square '+((r+c)%2===0?'light':'dark');
      sq.dataset.r=r;
      sq.dataset.c=c;
      sq.innerText=piecesUnicode[window.board[r][c]];

      if(window.selectedSquare && window.selectedSquare.r===r && window.selectedSquare.c===c) sq.classList.add('selected');
      if(legalSquares.some(m=>m[0]===r && m[1]===c)) sq.classList.add('highlight');

      sq.addEventListener('click',onSquareClick);
      boardDiv.appendChild(sq);
    }
  }

  updateStatus();
};

function onSquareClick(e){
  const r=parseInt(e.target.dataset.r);
  const c=parseInt(e.target.dataset.c);
  const piece = window.board[r][c];

  if(!window.selectedSquare){
    if(piece && isMoveAllowed(piece,window.currentPlayer)) window.selectedSquare={r,c};
  } else {
    const moves = getLegalMoves(window.board, window.selectedSquare.r, window.selectedSquare.c, window.currentPlayer, window.castlingRights, window.enPassantTarget);
    const legal = moves.some(m=>m[0]===r && m[1]===c);

    if(legal){
      makeMove(window.selectedSquare, {r,c});
      window.selectedSquare=null;
      window.currentPlayer = window.currentPlayer==='white'?'black':'white';
      renderBoard();

      const status=isGameOver(window.board,window.currentPlayer,window.castlingRights,window.enPassantTarget);
      if(status.over) setTimeout(()=>alert(status.result==='checkmate'?`Checkmate! ${status.winner} wins!`:'Stalemate!'),100);

      if(gameId) updateGame(gameId,{board:window.board, turn:window.currentPlayer, castlingRights:window.castlingRights, enPassantTarget:window.enPassantTarget});
    } else {
      window.selectedSquare=null;
    }
  }
  renderBoard();
}

function makeMove(from,to){
  const moving = window.board[from.r][from.c];

  // Castling
  if(moving.toLowerCase()==='k' && Math.abs(to.c-from.c)===2){
    if(to.c===6){ window.board[to.r][5]=window.board[to.r][7]; window.board[to.r][7]=''; }
    if(to.c===2){ window.board[to.r][3]=window.board[to.r][0]; window.board[to.r][0]=''; }
  }

  // En passant
  if(moving.toLowerCase()==='p' && window.enPassantTarget && to.r===window.enPassantTarget.r && to.c===window.enPassantTarget.c){
    const dir = (window.currentPlayer==='white')?1:-1;
    window.board[to.r+dir][to.c]='';
  }

  window.board[to.r][to.c]=moving;
  window.board[from.r][from.c]='';

  // Update en passant
  window.enPassantTarget=null;
  if(moving.toLowerCase()==='p' && Math.abs(to.r-from.r)===2){
    window.enPassantTarget={r:(from.r+to.r)/2|0, c:from.c};
  }

  window.castlingRights = updateCastlingRights(window.castlingRights,moving,from);
}

function updateStatus(){
  document.getElementById('status').innerText = `${window.currentPlayer.charAt(0).toUpperCase()+window.currentPlayer.slice(1)}'s turn`;
}

// Multiplayer init
window.initGame=function(id, creator=true){
  gameId=id;
  if(creator) renderBoard();
  subscribeToGame(gameId,(data)=>{
    if(data.board){
      window.board=data.board;
      window.currentPlayer=data.turn;
      window.castlingRights=data.castlingRights;
      window.enPassantTarget=data.enPassantTarget;
      renderBoard();
    }
  });
};
