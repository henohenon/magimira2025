import "./babylon/main";
import {player} from "./text-alive/main";
import "./input";

import { events as babylonEvents } from "./babylon/events";
import { events as textaliveEvents } from "./text-alive/events";
import { events as inputEvents } from "./input";
import { playAnimation } from "./babylon/mdl";

inputEvents.on("startInput", (key) => {
    if(!player.isPlaying) return;
    console.log("startInput", key);
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
    setOpacity(playingContainer, true);
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