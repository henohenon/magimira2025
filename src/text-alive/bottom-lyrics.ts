import { player } from "./main";
import type { IPhrase } from "textalive-app-api";

const lyrixText = document.getElementById("lyricsText") as HTMLHeadElement;
if (!lyrixText) {
    throw new Error("Lyric text not found");
}


export function updatePosition(position: number) {
    const phrase: IPhrase = player.video.findPhrase(position);
    const text = phrase?.text ?? "";
    lyrixText.innerText = text;
}