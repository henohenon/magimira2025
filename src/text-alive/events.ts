import mitt, { type Emitter } from 'mitt';

type Events = {
    onAppReady: undefined;
    onGameStart: undefined;
    onAudioDomReady: HTMLMediaElement;
}
export const events: Emitter<Events> = mitt<Events>();
