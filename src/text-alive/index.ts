import "../effects/spectrum/circle-spectrum.ts";
import { Player } from "textalive-app-api";
import { events } from "./events";
import {updateBottomLyrics} from "./bottom-lyrics.ts";


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
	}
});

export const updateTextAlive = (startPosition: number, endPosition:number) => {
	updateBottomLyrics(startPosition, endPosition);
}