// js/chessboard/rules.js

// Check for checkmate or stalemate
window.isGameOver = function(board, turn, castling, enPassant){
  let hasMoves = false;

  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const piece = board[r][c];
      if(!piece || (piece.toUpperCase()===piece?'white':'black')!==turn) continue;
      const moves = window.getLegalMoves(board,r,c,turn,castling,enPassant);
      if(moves.length>0) {
        hasMoves = true;
        break;
      }
    }
    if(hasMoves) break;
  }

  if(!hasMoves){
    if(window.isInCheck(board,turn)) return {over:true, result:'checkmate', winner:(turn==='white'?'black':'white')};
    else return {over:true, result:'stalemate', winner:null};
  }

  return {over:false, result:null, winner:null};
};

// Validate if a move is allowed (turn + piece color)
window.isMoveAllowed = function(piece, currentTurn){
  if(!piece) return false;
  return (piece.toUpperCase()===piece?'white':'black') === currentTurn;
};

// Handle castling updates after a king/rook move
window.updateCastlingRights = function(castling, fromPiece, fromPos){
  if(fromPiece.toLowerCase()==='k'){
    if(fromPiece.toUpperCase()==='K') castling.whiteK=false, castling.whiteQ=false;
    else castling.blackK=false, castling.blackQ=false;
  }
  if(fromPiece.toLowerCase()==='r'){
    if(fromPos.r===7 && fromPos.c===0) castling.whiteQ=false;
    if(fromPos.r===7 && fromPos.c===7) castling.whiteK=false;
    if(fromPos.r===0 && fromPos.c===0) castling.blackQ=false;
    if(fromPos.r===0 && fromPos.c===7) castling.blackK=false;
  }
  return castling;
};
