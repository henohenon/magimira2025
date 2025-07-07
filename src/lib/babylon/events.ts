import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";
import mitt, { type Emitter } from 'mitt';

type Events = {
    onSceneDefinition: {
        engine: Engine;
        scene: Scene;
    },
    onSceneLoaded: undefined;
    onMdlAnimLoaded: {mdlName: string, animations: string[]};
    onModelsLoaded: string[]; // Array of available model names
}
export const events: Emitter<Events> = mitt<Events>();
