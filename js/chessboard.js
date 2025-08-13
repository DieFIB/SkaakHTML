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

const piecesUnicode = {
  'r':'♜','n':'♞','b':'♝','q':'♛','k':'♚','p':'♟',
  'R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔','P':'♙','':''
};

let selectedSquare = null;
let currentPlayer = 'white';
let castlingRights = {whiteK:true, whiteQ:true, blackK:true, blackQ:true};
let enPassantTarget = null;

function _renderBoardInternal(){
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const sq = document.createElement('div');
      sq.className = 'square ' + ((r+c)%2===0 ? 'light':'dark');
      sq.dataset.r = r;
      sq.dataset.c = c;
      sq.innerText = piecesUnicode[board[r][c]];
      sq.addEventListener('click', onSquareClick);
      boardDiv.appendChild(sq);
    }
  }
  highlightSelection();
  updateStatus();
}

function pieceColor(p){ return p.toUpperCase() === p ? 'white' : 'black'; }

function makeMove(from,to){
  const moving = board[from.r][from.c];

  // Castling
  if(moving.toLowerCase()==='k' && Math.abs(to.c-from.c)===2){
    if(to.c===6){ board[to.r][5]=board[to.r][7]; board[to.r][7]=''; }
    if(to.c===2){ board[to.r][3]=board[to.r][0]; board[to.r][0]=''; }
  }

  // En passant
  if(moving.toLowerCase()==='p' && enPassantTarget && to.r===enPassantTarget.r && to.c===enPassantTarget.c){
    const dir = (currentPlayer==='white') ? 1:-1;
    board[to.r+dir][to.c]='';
  }

  board[to.r][to.c]=moving;
  board[from.r][from.c]='';

  // Update en passant
  enPassantTarget=null;
  if(moving.toLowerCase()==='p' && Math.abs(to.r-from.r)===2){
    enPassantTarget={r:(from.r+to.r)/2|0, c:from.c};
  }
}

function onSquareClick(e){
  const r=parseInt(e.target.dataset.r);
  const c=parseInt(e.target.dataset.c);
  const piece = board[r][c];

  if(!selectedSquare){
    if(piece && pieceColor(piece)===currentPlayer){
      selectedSquare={r,c};
    }
  } else {
    const moves = getLegalMoves(board, selectedSquare.r, selectedSquare.c, currentPlayer, castlingRights, enPassantTarget);
    const legal = moves.some(m=>m[0]===r && m[1]===c);
    if(legal){
      makeMove(selectedSquare,{r,c});
      currentPlayer = (currentPlayer==='white')?'black':'white';
    }
    selectedSquare=null;
  }

  _renderBoardInternal();
}

function highlightSelection(){
  if(!selectedSquare) return;
  const squares=document.querySelectorAll('.square');
  squares.forEach(sq=>{
    if(parseInt(sq.dataset.r)===selectedSquare.r && parseInt(sq.dataset.c)===selectedSquare.c){
      sq.classList.add('selected');
    }
  });
}

function updateStatus(){
  document.getElementById('status').innerText = `${currentPlayer.charAt(0).toUpperCase()+currentPlayer.slice(1)}'s turn`;
}

// Public API
window.initBoard = function(){
  selectedSquare=null;
  currentPlayer='white';
  castlingRights={whiteK:true, whiteQ:true, blackK:true, blackQ:true};
  enPassantTarget=null;
};

window.renderBoard=function(){ _renderBoardInternal(); };
