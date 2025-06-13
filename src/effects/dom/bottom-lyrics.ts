import {events} from "../../text-alive/events.ts";

const lyrixText = document.getElementById("lyrics-text") as HTMLHeadElement;
if (!lyrixText) {
    throw new Error("Lyric text not found");
}

let timer: Timer;
events.on("onPhrase", (e) => {
    lyrixText.innerText = e.phrase;
    clearTimeout(timer);
    timer = setTimeout(() => {
        lyrixText.innerText = "";
    }, e.duration);
});
