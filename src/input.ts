import mitt, { type Emitter } from 'mitt';
import { player as taPlayer } from './text-alive/main';

interface InputData {
    key: string;
    time: number;
    duration: number;
}

type Events = {
    startInput: string;
}

export const events: Emitter<Events> = mitt<Events>();

let inputData: InputData[] = [];

export function reset(){
    inputData = [];
}


function startInput(key: string, time: number){
    inputData.push({key, time, duration: -1});
    events.emit("startInput", key);
}

export function stopInput(key: string, time: number){
const lastKeyData = inputData
  .filter(item => item.key === key)
  .at(-1);    
  if (lastKeyData) {
        lastKeyData.duration = time - lastKeyData.time;
    }
}

const handler = (e: KeyboardEvent) => {
	// ショートカットのデフォルト動作を全てキャンセル
	// e.preventDefault();
	// e.stopImmediatePropagation();
	console.log("key event:", e);
    startInput(e.key, taPlayer.mediaPosition);
};
const ctxHandler = (e: MouseEvent) => {
	e.preventDefault();
	e.stopImmediatePropagation();
	console.log("context menu event:", e);
};
document.addEventListener("keydown", handler, true);
document.addEventListener("keypress", handler, true);
document.addEventListener("keyup", handler, true);
document.addEventListener("contextmenu", ctxHandler, true);
