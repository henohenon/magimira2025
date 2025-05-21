import { createStore, type WithGlobal } from "prismatix-input/mitt";
import type { PRXInputEvent } from "prismatix-input/types";
import { keyboardBasicInput, type KeyboardInputEvent, type KeyboardInputOptions } from "prismatix-input/pure/keyboard";

import "./babylon/main";
import {player} from "./text-alive/main";
import { events as babylonEvents } from "./babylon/events";
import { events as textaliveEvents } from "./text-alive/events";
import { playAnimation } from "./babylon/mdl";

type Events = WithGlobal<{
    keyboard: KeyboardInputEvent,
}>;

const store = createStore<Events>()
  .addEmitter(keyboardBasicInput, { actions: ["keyboard"], option: { events: 'keydown-first' } as KeyboardInputOptions } )
  console.log("store", store);
store.global.subscribe((v: PRXInputEvent) => {
    console.log("input", v);if
    (!player.isPlaying) return;
    playAnimation("listening");
});

let babylonLoaded = false;
let textaliveLoaded = false;
babylonEvents.on("onSceneLoaded", () => {
    babylonLoaded = true;
    updateLoading();
});
textaliveEvents.on("onAppReady", () => {
    textaliveLoaded = true;
    updateLoading();
});

function updateLoading() {
    if (!(babylonLoaded && textaliveLoaded)) return;
    
    const loadingWrapper = document.getElementById("loadingWrapper");
    if (!loadingWrapper) {
        throw new Error("Loading wrapper not found");
    }
    loadingWrapper.classList.add("hidden");
    playAnimation("startListen");
}