// js/multiplayer/multiplayer.js
let whiteTime=300; // 5 minutes
let blackTime=300;
let interval=null;

export function startTimer(renderCallback){
  if(interval) clearInterval(interval);
  interval = setInterval(()=>{
    if(window.currentPlayer==='white') whiteTime--; else blackTime--;
    renderCallback(whiteTime,blackTime);
    if(whiteTime<=0 || blackTime<=0){
      clearInterval(interval);
      alert(`${whiteTime<=0?'Black':'White'} wins on time!`);
    }
  },1000);
}

export function resetTimer(){
  whiteTime=300; blackTime=300;
  if(interval) clearInterval(interval);
}

export function renderClocks(whiteEl, blackEl){
  whiteEl.innerText = `${Math.floor(whiteTime/60).toString().padStart(2,'0')}:${(whiteTime%60).toString().padStart(2,'0')}`;
  blackEl.innerText = `${Math.floor(blackTime/60).toString().padStart(2,'0')}:${(blackTime%60).toString().padStart(2,'0')}`;
}
