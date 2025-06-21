import {Player, type ISongMap, type IRepetitiveSegment} from "textalive-app-api";

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

// Cache for song map
let segments: IRepetitiveSegment[] | null = null;

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
	},
	onSongMapLoad: (songMap: ISongMap) => {
		// Cache the song map
		segments = songMap.segments.map(s => s.segments).flat();
	},
	onPause: () => {
		events.emit("onPause");
	},
	onPlay: () => {
		events.emit("onPlay", { position: player.timer.position });
	},
	onMediaSeek: (position: number) => {
		events.emit("onSeek", { position });
	}
});

export const updateTextAlive = (startPosition: number, endPosition:number) => {
	const phrase = player.video.findPhraseChange(startPosition, endPosition);
	const word = player.video.findWordChange(startPosition, endPosition);
	const char = player.video.findCharChange(startPosition, endPosition);
	const beat = player.findBeatChange(startPosition, endPosition);
	const chord = player.findChordChange(startPosition, endPosition);
	const chorus = player.findChorusChange(startPosition, endPosition);
	// const vocalAmplitude = player.getVocalAmplitude(endPosition);
	// const valenceArousal = player.getValenceArousal(endPosition);

	phrase.entered.map(p => {
		events.emit("onPhrase", { phrase: p.text, duration: p.endTime - endPosition});
	});
	word.entered.map(w => {
		events.emit("onWord", { word: w.text, duration: w.endTime - endPosition});
	});
	char.entered.map(c => {
		events.emit("onChar", { char: c.text, duration: c.endTime - endPosition});
	});
	beat.entered.map(b => {
		events.emit("onBeat", { duration: b.endTime - endPosition, length: b.length});
	});
	chord.entered.map(c => {
		events.emit("onChord", { chord: c.name, duration: c.endTime - endPosition});
	});
	chorus.entered.map(c => {
		events.emit("onChorus", { maxDuration: c.duration, duration: c.endTime - endPosition});
	});
	// events.emit("onVocalAmplitude", { amplitude: vocalAmplitude });
	// events.emit("onValenceArousal", { valence: valenceArousal.v, arousal: valenceArousal.a });

	// Use the cached song map if available
	if (segments) {
		// Check for segments that are active in the current time range
		for (const segment of segments) {
			if(segment.startTime >= startPosition && segment.startTime <= endPosition){
				events.emit("onSegment", { segment: segment.index, duration: segment.endTime - startPosition });
			}
		}
	}
}
