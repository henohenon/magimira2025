import mitt, { type Emitter } from 'mitt';

type Events = {
    onAppReady: undefined;
    onGameStart: undefined;
    onAudioDomReady: HTMLMediaElement;
    onPhrase: { phrase: string, duration: number };
    onWord: { word: string, duration: number };
    onChar: { char: string, duration: number };
    onBeat: { duration: number, length: number };
    onChord: { name: string, duration: string };
    onChorus: { duration: number };
    onVocalAmplitude: { amplitude: number };
    onValenceArousal: { valence: number, arousal: number };
}
export const events: Emitter<Events> = mitt<Events>();
