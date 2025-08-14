// js/chessboard/rules.js

export function isMoveAllowed(piece, player) {
  if (!piece) return false;
  const color = piece.toUpperCase() === piece ? 'white' : 'black';
  return color === player;
}

export function updateCastlingRights(castling, piece, from) {
  const newRights = {...castling};
  if (piece === 'K') { newRights.whiteK=false; newRights.whiteQ=false; }
  if (piece === 'k') { newRights.blackK=false; newRights.blackQ=false; }
  if (piece === 'R') {
    if(from.r===7 && from.c===0) newRights.whiteQ=false;
    if(from.r===7 && from.c===7) newRights.whiteK=false;
  }
  if (piece === 'r') {
    if(from.r===0 && from.c===0) newRights.blackQ=false;
    if(from.r===0 && from.c===7) newRights.blackK=false;
  }
  return newRights;
}

export function isGameOver(board, turn, castling, enPassant) {
  // Check for legal moves
  let hasMoves=false;
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      if(board[r][c] && board[r][c].toUpperCase()===(turn==='white'?'P':'p') || board[r][c].toUpperCase()===board[r][c]? 'white' : 'black'===turn){
        // Use moves.js here if needed
        const moves = window.getLegalMoves(board,r,c,turn,castling,enPassant);
        if(moves.length>0) hasMoves=true;
      }
    }
  }
  if(hasMoves) return {over:false};
  // Check for checkmate/stalemate
  const inCheck = window.isInCheck(board,turn);
  return {over:true,result:inCheck?'checkmate':'stalemate',winner:inCheck?opponent(turn):null};
}

function opponent(color){ return color==='white'?'black':'white'; }
