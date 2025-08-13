// js/chessboard.js

// Board initialization
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
window.castlingRights = {whiteK:true, whiteQ:true, blackK:true, blackQ:true};
window.enPassantTarget = null;

// Render the board
window._renderBoardInternal = function(){
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const sq = document.createElement('div');
      sq.className = 'square ' + ((r+c)%2===0 ? 'light':'dark');
      sq.dataset.r = r;
      sq.dataset.c = c;
      sq.innerText = piecesUnicode[window.board[r][c]];
      sq.addEventListener('click', window.onSquareClick);
      boardDiv.appendChild(sq);
    }
  }
  highlightSelection();
  updateStatus();
}

function pieceColor(p){ return p.toUpperCase() === p ? 'white' : 'black'; }

window.makeMove = function(from,to){
  const moving = window.board[from.r][from.c];

  // Castling
  if(moving.toLowerCase()==='k' && Math.abs(to.c-from.c)===2){
    if(to.c===6){ window.board[to.r][5]=window.board[to.r][7]; window.board[to.r][7]=''; }
    if(to.c===2){ window.board[to.r][3]=window.board[to.r][0]; window.board[to.r][0]=''; }
  }

  // En passant
  if(moving.toLowerCase()==='p' && window.enPassantTarget && to.r===window.enPassantTarget.r && to.c===window.enPassantTarget.c){
    const dir = (window.currentPlayer==='white') ? 1:-1;
    window.board[to.r+dir][to.c]='';
  }

  window.board[to.r][to.c]=moving;
  window.board[from.r][from.c]='';

  // Update en passant
  window.enPassantTarget=null;
  if(moving.toLowerCase()==='p' && Math.abs(to.r-from.r)===2){
    window.enPassantTarget={r:(from.r+to.r)/2|0, c:from.c};
  }
}

window.onSquareClick = function(e){
  const r=parseInt(e.target.dataset.r);
  const c=parseInt(e.target.dataset.c);
  const piece = window.board[r][c];

  if(!window.selectedSquare){
    if(piece && pieceColor(piece)===window.currentPlayer){
      window.selectedSquare={r,c};
    }
  } else {
    const moves = getLegalMoves(window.board, window.selectedSquare.r, window.selectedSquare.c, window.currentPlayer, window.castlingRights, window.enPassantTarget);
    const legal = moves.some(m=>m[0]===r && m[1]===c);
    if(legal){
      window.makeMove(window.selectedSquare,{r,c});
      window.currentPlayer = (window.currentPlayer==='white')?'black':'white';
    }
    window.selectedSquare=null;
  }

  window._renderBoardInternal();
}

function highlightSelection(){
  if(!window.selectedSquare) return;
  const squares=document.querySelectorAll('.square');
  squares.forEach(sq=>{
    if(parseInt(sq.dataset.r)===window.selectedSquare.r && parseInt(sq.dataset.c)===window.selectedSquare.c){
      sq.classList.add('selected');
    }
  });
}

function updateStatus(){
  document.getElementById('status').innerText = `${window.currentPlayer.charAt(0).toUpperCase()+window.currentPlayer.slice(1)}'s turn`;
}

// Public API
window.initBoard = function(){
  window.selectedSquare=null;
  window.currentPlayer='white';
  window.castlingRights={whiteK:true, whiteQ:true, blackK:true, blackQ:true};
  window.enPassantTarget=null;
};

window.renderBoard=function(){ window._renderBoardInternal(); };
