import  type{ IChar } from "textalive-app-api";
import { player } from "./";

let lastChar: IChar | null = null;

export function updatePosition(position: number) {
    if (!player.video || !player.video.firstChar) {
        return;
    }

    let current = lastChar || player.video.firstChar;
    while (current && current.startTime < position + 500) {
        if (lastChar !== current) {
            newChar(current);
            lastChar = current;
        }
        current = current.next;
    }
}

function newChar(char: IChar) {
    const span = document.createElement("span");
    span.className = "absolute";
    span.innerText = char.text;
    span.style.left = `${Math.random() * 100}vw`;
    span.style.top = `${Math.random() * 100}vh`;
    document.body.appendChild(span);
    setTimeout(() => {
        document.body.removeChild(span);
    }, 2000);
}