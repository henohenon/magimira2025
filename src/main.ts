import { Player as TextAlivePlayer } from "textalive-app-api";
import type { IPlayerApp, IChar } from "textalive-app-api";

const taPlayer = new TextAlivePlayer({ app: { token: import.meta.env.VITE_TEXT_ALIVE_TOKEN } });

let initialized = false;
let lastChar: IChar | null = null;
taPlayer.addListener({
    onAppReady: async (app: IPlayerApp) => {
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
        initialized = true;
    },
    onTimeUpdate: (position: number) => {
        console.log("Current position:", position);
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

document.addEventListener("click", () => {
    if (!initialized) return;
    if (taPlayer.isPlaying) {
        taPlayer.requestPause();
    } else {
        taPlayer.requestMediaSeek(0);
        taPlayer.requestPlay();
    }
});

function newChar(char: IChar) {
    console.log("New char:", char.text, char.startTime, char.endTime);
    const span = document.createElement("span");
    span.innerText = char.text;
    span.style.left = `${Math.random() * 100}vw`;
    span.style.top = `${Math.random() * 100}vh`;
    document.body.appendChild(span);
    setTimeout(() => {
        document.body.removeChild(span);
    }, 2000);
}