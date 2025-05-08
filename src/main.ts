import { Player as TextAlivePlayer } from "textalive-app-api";
import type { IChar } from "textalive-app-api";
import { createScene } from "./babylon";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
if (!canvas) {
    throw new Error("Canvas not found");
}
const scene = createScene(canvas);
console.log("Scene created", scene);

const mediaElement = document.getElementById("media") as HTMLMediaElement;
if (!mediaElement) {
    throw new Error("Media element not found");
}
const taPlayer = new TextAlivePlayer({ app: { 
    token: import.meta.env.VITE_TEXT_ALIVE_TOKEN
},mediaElement,
mediaBannerPosition: "bottom right" });
taPlayer.volume = 20;


const seekBar = document.querySelector("#seekbar");
if (!seekBar) {
    throw new Error("SeekBar not found");
}
const paintedSeekBar = seekBar.querySelector("div");
if (!paintedSeekBar) {
    throw new Error("Painted seekBar not found");
}


let lastChar: IChar | null = null;
taPlayer.addListener({
    onAppReady: async () => {
        await taPlayer.createFromSongUrl("https://piapro.jp/t/ULcJ/20250205120202", {
            video: {
                // 音楽地図訂正履歴
                beatId: 4694275,
                chordId: 2830730,
                repetitiveSegmentId: 2946478,
    
                // 歌詞URL: https://piapro.jp/t/DPXV
                // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FULcJ%2F20250205120202
                lyricId: 67810,
                lyricDiffId: 20654
            }
        });
        const loadingWrapper = document.getElementById("loadingWrapper");
        if (!loadingWrapper) {
            throw new Error("Loading wrapper not found");
        }
        loadingWrapper.classList.add("hidden");
        
        const startButton = document.getElementById("startButton") as HTMLButtonElement;
        if (!startButton) {
            throw new Error("Start button not found");
        }
        startButton.addEventListener("click", () => {
            if(taPlayer.isPlaying) {
                taPlayer.requestPause();
                startButton.textContent = "play";
            }else{
                taPlayer.requestMediaSeek(0);
                taPlayer.requestPlay();
                startButton.textContent = "stop";
            }
        });
    },
    onTimeUpdate: (position: number) => {
        // よくわからんけど公式に書いてあったのでこの割合
        const rate = Math.floor((position * 1000) / taPlayer.video.duration * 10) / 100;
        paintedSeekBar.style.width = `${rate.toString()}%`;
        
        if (!taPlayer.video.firstChar) {
            return;
        }
    
        let current = lastChar || taPlayer.video.firstChar;
        while (current && current.startTime < position + 500) {
            if (lastChar !== current) {
                newChar(current);
                lastChar = current;
            }
            current = current.next;
        }
    }
});

function newChar(char: IChar) {
    console.log("New char:", char.text, char.startTime, char.endTime);
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
