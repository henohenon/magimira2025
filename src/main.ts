import { createLogStore, type WithGlobal } from "prismatix-input/mitt";
import { keyboardInput, type KeyboardInputEvent, type KeyboardInputOptions } from "prismatix-input/web-native/keyboard";

import "./babylon/main";
import {player} from "./text-alive/main";
import { events as babylonEvents } from "./babylon/events";
import { events as textaliveEvents } from "./text-alive/events";
import { playAnimation } from "./babylon/mdl";
import { pointerInput, type PointerInputOptions } from "prismatix-input/web-native/pointer";
import type { WithPositionInputEvent } from "prismatix-input/web-native/index";
import type { PRXInputEvent } from "prismatix-input/events";

type Events = WithGlobal<{
    keyboard: KeyboardInputEvent,
    pointer: WithPositionInputEvent
}>;

const store = createLogStore<Events>()
  .addEmitter(keyboardInput, { outEvents: ["keyboard"], option: { events: ['keydown-norepeat'] } as KeyboardInputOptions } )
  .addEmitter(pointerInput, { outEvents: ["keyboard"], option: { events: ['pointerdown'] } as PointerInputOptions } )
  console.log("store", store);
store.global.subscribe((v: PRXInputEvent) => {
    console.log("input", v);
    if(!player.isPlaying) return;
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
textaliveEvents.on("onGameStart", () => {
    if (!babylonLoaded) return;
    
    const playingContainer = document.getElementById("playing");
    if (!playingContainer) {
        throw new Error("Playing container not found");
    }
    const initContainer = document.getElementById("init");
    if (!initContainer) {
        throw new Error("Init container not found");
    }
    setOpacity(playingContainer, true);
    setOpacity(initContainer, false);
    playAnimation("startListen");
});

function updateLoading() {
    if (!(babylonLoaded && textaliveLoaded)) return;
    
    const loadingWrapper = document.getElementById("loadingWrapper");
    if (!loadingWrapper) {
        throw new Error("Loading wrapper not found");
    }
    const textaliveBanner = document.getElementsByClassName("textalive-banner")[0] as HTMLElement;
    if (!textaliveBanner) {
        throw new Error("TextAlive banner not found");
    }
    setOpacity(loadingWrapper, false);
    textaliveBanner.classList.add("hidden");
}

function setOpacity(element: HTMLElement, visible: boolean) {
    if (visible) {
        element.classList.remove("opacity-0");
        element.classList.add("opacity-100");
        element.classList.remove("pointer-events-none");
    } else {
        element.classList.remove("opacity-100");
        element.classList.add("opacity-0");
        element.classList.add("pointer-events-none");
    }
  }