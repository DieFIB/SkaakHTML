(function(){
  function inBounds(r,c){ return r>=0 && r<8 && c>=0 && c<8; }
  function cloneBoard(b){ return b.map(r=>r.slice()); }
  function opponent(color){ return color==='white'?'black':'white'; }
  function colorOf(p){ return p? (p.toUpperCase()===p?'white':'black') : null; }

  function squareAttacked(b,r,c,attacker){
    const pd = attacker==='white'?-1:1;
    const pawn = attacker==='white'?'P':'p';
    for(const dc of [-1,1]){ const rr=r+pd, cc=c+dc; if(inBounds(rr,cc) && b[rr][cc]===pawn) return true; }
    const knights = attacker==='white'?'N':'n';
    const km=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
    for(const [dr,dc] of km){ const rr=r+dr, cc=c+dc; if(inBounds(rr,cc)&&b[rr][cc]===knights) return true; }
    const rookPieces = attacker==='white'?['R','Q']:['r','q'];
    const rookDirs=[[1,0],[-1,0],[0,1],[0,-1]];
    for(const [dr,dc] of rookDirs){ let rr=r+dr, cc=c+dc; while(inBounds(rr,cc)){ const p=b[rr][cc]; if(p!==''){ if(rookPieces.includes(p)) return true; break;} rr+=dr; cc+=dc; } }
    const bishopPieces = attacker==='white'?['B','Q']:['b','q'];
    const bishopDirs=[[1,1],[1,-1],[-1,1],[-1,-1]];
    for(const [dr,dc] of bishopDirs){ let rr=r+dr, cc=c+dc; while(inBounds(rr,cc)){ const p=b[rr][cc]; if(p!==''){ if(bishopPieces.includes(p)) return true; break;} rr+=dr; cc+=dc; } }
    const king = attacker==='white'?'K':'k';
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ if(dr===0 && dc===0) continue; const rr=r+dr, cc=c+dc; if(inBounds(rr,cc) && b[rr][cc]===king) return true; }
    return false;
  }

  function findKing(b,color){ const k=color==='white'?'K':'k'; for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(b[r][c]===k) return [r,c]; return null; }
  function inCheck(b,color){ const kp=findKing(b,color); if(!kp) return false; return squareAttacked(b,kp[0],kp[1],opponent(color)); }

  function pseudoLegalMoves(b,r,c,turn,castling,enPassant){
    const p=b[r][c]; if(!p) return[]; if(colorOf(p)!==turn) return[]; const type=p.toLowerCase(); const moves=[];
    if(type==='p'){ const dir=(turn==='white')?-1:1; if(inBounds(r+dir,c) && b[r+dir][c]==='') moves.push([r+dir,c]); const startRow=(turn==='white')?6:1; if(r===startRow && b[r+dir][c]==='' && b[r+2*dir][c]==='') moves.push([r+2*dir,c]); for(const dc of [-1,1]){ const rr=r+dir, cc=c+dc; if(inBounds(rr,cc)){ const t=b[rr][cc]; if(t!=='' && colorOf(t)===opponent(turn)) moves.push([rr,cc]); if(enPassant && rr===enPassant.r && cc===enPassant.c) moves.push([rr,cc]); } } }
    if(type==='n'){ const km=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]; for(const [dr,dc] of km){ const rr=r+dr, cc=c+dc; if(inBounds(rr,cc)){ const t=b[rr][cc]; if(t===''||colorOf(t)===opponent(turn)) moves.push([rr,cc]); } } }
    if(type==='b'||type==='r'||type==='q'){ const dirs=[]; if(type==='b'||type==='q') dirs.push([1,1],[1,-1],[-1,1],[-1,-1]); if(type==='r'||type==='q') dirs.push([1,0],[-1,0],[0,1],[0,-1]); for(const [dr,dc] of dirs){ let rr=r+dr, cc=c+dc; while(inBounds(rr,cc)){ const t=b[rr][cc]; if(t==='') moves.push([rr,cc]); else { if(colorOf(t)===opponent(turn)) moves.push([rr,cc]); break;} rr+=dr; cc+=dc; } } }
    if(type==='k'){ for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ if(dr===0&&dc===0) continue; const rr=r+dr, cc=c+dc; if(inBounds(rr,cc)){ const t=b[rr][cc]; if(t===''||colorOf(t)===opponent(turn)) moves.push([rr,cc]); } } }
    return moves;
  }

  function legalMoves(b,r,c,turn,castling,enPassant){
    const moves=pseudoLegalMoves(b,r,c,turn,castling,enPassant);
    const legal=[];
    for(const [tr,tc] of moves){
      const nb=cloneBoard(b);
      const moving=nb[r][c];
      nb[tr][tc]=moving; nb[r][c]='';
      if(!inCheck(nb,turn)) legal.push([tr,tc]);
    }
    return legal;
  }

  window.getLegalMoves=legalMoves;
  window.isInCheck=inCheck;
})();
