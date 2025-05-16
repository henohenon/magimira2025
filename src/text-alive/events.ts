import mitt, { type Emitter } from 'mitt';

type Events = {
    onAppReady: undefined;
}
export const events: Emitter<Events> = mitt<Events>();
