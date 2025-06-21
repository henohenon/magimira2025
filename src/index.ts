import "~/lib/update";
import "~/lib/babylon";
import "~/lib/text-alive";
import "~/game";

import {events as babylonEvents} from "~/lib/babylon/events.ts";
import {events as textaliveEvents} from "~/lib/text-alive/events.ts";
import {events as gameEvents} from "./game/events";
import {
    initContainerFadeOut,
    loadingWrapperFadeOut,
    playingContainerFadeIn,
    textaliveBannerFadeOut
} from "~/lib/effects/dom/fade";
import {player} from "~/lib/text-alive";

let babylonLoaded = false;
let textaliveLoaded = false;
babylonEvents.on("onSceneLoaded", () => {
    babylonLoaded = true;
    updateLoading();
});
textaliveEvents.on("onAppReady", () => {
    textaliveLoaded = true;
    console.log("TextAlive loaded");
    updateLoading();
});
const updateLoading = () => {
    if (!(babylonLoaded && textaliveLoaded)) return;
    gameEvents.emit("onLoaded");
    loadingWrapperFadeOut();
    const startButton = document.getElementById("start-button");
    if (!startButton) {
        throw new Error("Start button not found");
    }
    startButton.addEventListener("click", () => {
        player.requestMediaSeek(0);
        gameEvents.emit("onGameStart");
    });
}

gameEvents.on("onGameStart", () => {
    playingContainerFadeIn();
    initContainerFadeOut();
    textaliveBannerFadeOut();
    player.requestPlay();
});
