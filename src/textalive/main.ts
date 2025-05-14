import { Player, type IChar } from "textalive-app-api";
import { events } from "./events";


const mediaElement = document.getElementById("media") as HTMLMediaElement;
if (!mediaElement) {
	throw new Error("Media element not found");
}
export const player = new Player({
	app: {
		token: import.meta.env.VITE_TEXT_ALIVE_TOKEN,
	},
	mediaElement,
	mediaBannerPosition: "bottom right",
});
player.volume = 20;


const seekBar = document.querySelector("#seekBar") as HTMLDivElement;
if (!seekBar) {
    throw new Error("SeekBar not found");
}
seekBar.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    if (player) {
        player.requestMediaSeek(
            (player.video.duration * e.offsetX) / seekBar.clientWidth,
        );
    }
});

const paintedSeekBar = seekBar.querySelector("div");
if (!paintedSeekBar) {
	throw new Error("Painted seekBar not found");
}

let lastChar: IChar | null = null;
player.addListener({
	onAppReady: async () => {
		await player.createFromSongUrl(
			"https://piapro.jp/t/ULcJ/20250205120202",
			{
				video: {
					// 音楽地図訂正履歴
					beatId: 4694275,
					chordId: 2830730,
					repetitiveSegmentId: 2946478,

					// 歌詞URL: https://piapro.jp/t/DPXV
					// 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FULcJ%2F20250205120202
					lyricId: 67810,
					lyricDiffId: 20654,
				},
			},
		);
		events.emit("onAppReady");
		const startButton = document.getElementById(
			"startButton",
		) as HTMLButtonElement;
		if (!startButton) {
			throw new Error("Start button not found");
		}
		startButton.addEventListener("click", () => {
			if (player.isPlaying) {
				player.requestPause();
				startButton.textContent = "play";
			} else {
				player.requestMediaSeek(0);
				player.requestPlay();
				startButton.textContent = "stop";
			}
		});
	},
	onTimeUpdate: (position: number) => {
		// よくわからんけど公式に書いてあったのでこの割合
		const rate =
			Math.floor(((position * 1000) / player.video.duration) * 10) / 100;
		paintedSeekBar.style.width = `${rate.toString()}%`;

		if (!player.video.firstChar) {
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
	},
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