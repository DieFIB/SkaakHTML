import { createGame, gameExists } from "./firestore.js";
import { initBoard, renderBoard } from "../chessboard.js";

export async function initLobby(){
  const code = localStorage.getItem('gameCode');
  const isCreator = localStorage.getItem('isCreator') === 'true';

  document.getElementById('game-code').innerText = `Code: ${code}`;

  if(isCreator){
    const initialState = {
      board: [
        ['r','n','b','q','k','b','n','r'],
        ['p','p','p','p','p','p','p','p'],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['P','P','P','P','P','P','P','P'],
        ['R','N','B','Q','K','B','N','R']
      ],
      currentPlayer: 'white',
      castlingRights: {whiteK:true, whiteQ:true, blackK:true, blackQ:true},
      enPassantTarget: null,
      clock: {white:0, black:0},
      started: false
    };
    await createGame(code, initialState);
  } else {
    const exists = await gameExists(code);
    if(!exists){
      alert("Game code not found. Go back and check code.");
      window.location.href = "landing.html";
      return;
    }
  }
}
