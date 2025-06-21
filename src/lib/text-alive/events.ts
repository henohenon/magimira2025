import mitt, { type Emitter } from 'mitt';

type Events = {
    onAppReady: undefined;
    onPhrase: { phrase: string, duration: number };
    onWord: { word: string, duration: number };
    onChar: { char: string, duration: number };
    onBeat: { length: number, duration: number,  };
    onChord: { chord: string, duration: number };
    onChorus: { maxDuration: number, duration: number };
    onVocalAmplitude: { amplitude: number };
    onValenceArousal: { valence: number, arousal: number };
    onSegment: { segment: number, duration: number };
    onPause: undefined;
    onPlay: { position: number };
    onSeek: { position: number };
}
export const events: Emitter<Events> = mitt<Events>();
