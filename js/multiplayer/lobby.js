// js/multiplayer/lobby.js
import { createGame, subscribeToGame } from './firestore.js';

export async function startNewGame(gameId){
  const initialBoard = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
  ];

  await createGame(gameId,{
    board: initialBoard,
    turn: 'white',
    castlingRights: {whiteK:true,whiteQ:true,blackK:true,blackQ:true},
    enPassantTarget: null
  });

  return subscribeToGame(gameId,(data)=>console.log("Game Updated",data));
}
