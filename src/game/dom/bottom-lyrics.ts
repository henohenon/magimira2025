import {events} from "~/lib/text-alive/events.ts";

const lyrixText = document.getElementById("lyrics-text") as HTMLHeadElement;
if (!lyrixText) {
    throw new Error("Lyric text not found");
}

let timer: ReturnType<typeof setTimeout>;
events.on("onPhrase", (e) => {
    lyrixText.innerText = e.phrase;
    clearTimeout(timer);
    timer = setTimeout(() => {
        lyrixText.innerText = "";
    }, e.duration);
});
