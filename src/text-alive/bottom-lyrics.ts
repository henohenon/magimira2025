import {player} from "./";

const lyrixText = document.getElementById("lyrics-text") as HTMLHeadElement;
if (!lyrixText) {
    throw new Error("Lyric text not found");
}


export function updatePosition(current: number, last: number) {
    if (!player.video) {
        return;
    }
    const phrase = player.video.findPhraseChange(current, last);
    lyrixText.innerText = phrase.current?.text ?? "";
}