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

function updateLoading() {
    if (!(babylonLoaded && textaliveLoaded)) return;
    
    const loadingWrapper = document.getElementById("loadingWrapper");
    if (!loadingWrapper) {
        throw new Error("Loading wrapper not found");
    }
    loadingWrapper.classList.add("hidden");
    playAnimation("startListen");
}