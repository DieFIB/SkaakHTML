// js/chessboard/moves.js

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function cloneBoard(board) {
  return board.map(row => row.slice());
}

function colorOf(p) {
  if (!p) return null;
  return p.toUpperCase() === p ? 'white' : 'black';
}

function opponent(color) {
  return color === 'white' ? 'black' : 'white';
}

function squareAttacked(board, r, c, attacker) {
  const dir = attacker === 'white' ? -1 : 1;
  const pawn = attacker === 'white' ? 'P' : 'p';
  for (const dc of [-1, 1]) {
    const rr = r + dir, cc = c + dc;
    if (inBounds(rr, cc) && board[rr][cc] === pawn) return true;
  }

  const knights = attacker === 'white' ? 'N' : 'n';
  const km = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
  for (const [dr, dc] of km) {
    const rr = r + dr, cc = c + dc;
    if (inBounds(rr, cc) && board[rr][cc] === knights) return true;
  }

  const rookPieces = attacker === 'white' ? ['R','Q'] : ['r','q'];
  const rookDirs = [[1,0],[-1,0],[0,1],[0,-1]];
  for (const [dr, dc] of rookDirs) {
    let rr = r + dr, cc = c + dc;
    while (inBounds(rr, cc)) {
      const p = board[rr][cc];
      if (p !== '') {
        if (rookPieces.includes(p)) return true;
        break;
      }
      rr += dr;
      cc += dc;
    }
  }

  const bishopPieces = attacker === 'white' ? ['B','Q'] : ['b','q'];
  const bishopDirs = [[1,1],[1,-1],[-1,1],[-1,-1]];
  for (const [dr, dc] of bishopDirs) {
    let rr = r + dr, cc = c + dc;
    while (inBounds(rr, cc)) {
      const p = board[rr][cc];
      if (p !== '') {
        if (bishopPieces.includes(p)) return true;
        break;
      }
      rr += dr;
      cc += dc;
    }
  }

  const king = attacker === 'white' ? 'K' : 'k';
  for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++) {
    if (dr===0 && dc===0) continue;
    const rr = r+dr, cc=c+dc;
    if (inBounds(rr, cc) && board[rr][cc] === king) return true;
  }

  return false;
}

function findKing(board, color) {
  const k = color==='white'?'K':'k';
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]===k) return [r,c];
  return null;
}

function inCheck(board, color) {
  const kingPos = findKing(board, color);
  if(!kingPos) return false;
  return squareAttacked(board, kingPos[0], kingPos[1], opponent(color));
}

function pseudoLegalMoves(board, r, c, turn, castling, enPassant) {
  const p = board[r][c];
  if (!p || colorOf(p) !== turn) return [];
  const moves = [];
  const type = p.toLowerCase();

  if (type === 'p') {
    const dir = turn==='white'?-1:1;
    // forward 1
    if (inBounds(r+dir,c) && board[r+dir][c]==='') moves.push([r+dir,c]);
    // forward 2
    const startRow = turn==='white'?6:1;
    if (r===startRow && board[r+dir][c]==='' && board[r+2*dir][c]==='') moves.push([r+2*dir,c]);
    // captures
    for (const dc of [-1,1]) {
      const rr=r+dir, cc=c+dc;
      if(inBounds(rr,cc)){
        if(board[rr][cc]!=='' && colorOf(board[rr][cc])===opponent(turn)) moves.push([rr,cc]);
        if(enPassant && rr===enPassant.r && cc===enPassant.c) moves.push([rr,cc]);
      }
    }
  }

  if (type==='n') {
    const km=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
    for(const [dr,dc] of km){
      const rr=r+dr, cc=c+dc;
      if(inBounds(rr,cc) && (board[rr][cc]===''||colorOf(board[rr][cc])===opponent(turn))) moves.push([rr,cc]);
    }
  }

  if(type==='b'||type==='r'||type==='q'){
    const dirs=[];
    if(type==='b'||type==='q') dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
    if(type==='r'||type==='q') dirs.push([1,0],[-1,0],[0,1],[0,-1]);
    for(const [dr,dc] of dirs){
      let rr=r+dr, cc=c+dc;
      while(inBounds(rr,cc)){
        const t=board[rr][cc];
        if(t==='') moves.push([rr,cc]);
        else { if(colorOf(t)===opponent(turn)) moves.push([rr,cc]); break; }
        rr+=dr; cc+=dc;
      }
    }
  }

  if(type==='k'){
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
      if(dr===0 && dc===0) continue;
      const rr=r+dr, cc=c+dc;
      if(inBounds(rr,cc) && (board[rr][cc]===''||colorOf(board[rr][cc])===opponent(turn))) moves.push([rr,cc]);
    }
    // TODO: add castling later if needed
  }

  return moves;
}

function getLegalMoves(board, r, c, turn, castling, enPassant){
  const moves = pseudoLegalMoves(board, r, c, turn, castling, enPassant);
  const legal = [];
  for(const [tr,tc] of moves){
    const nb = cloneBoard(board);
    nb[tr][tc] = nb[r][c];
    nb[r][c]='';
    if(!inCheck(nb, turn)) legal.push([tr,tc]);
  }
  return legal;
}

export { getLegalMoves, inCheck as isInCheck };
