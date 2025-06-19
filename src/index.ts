import "~/babylon";
import "~/text-alive";
import "~/game";
import {events as babylonEvents} from "~/babylon/events.ts";
import {events as textaliveEvents} from "~/text-alive/events.ts";
import {
    initContainerFadeOut,
    loadingWrapperFadeOut,
    playingContainerFadeIn,
    textaliveBannerFadeOut
} from "~/effects/dom";
import {player} from "~/text-alive";


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
    loadingWrapperFadeOut();
    const startButton = document.getElementById("start-button");
    if (!startButton) {
        throw new Error("Start button not found");
    }
    startButton.addEventListener("click", () => {
        player.requestMediaSeek(0);
        textaliveEvents.emit("onGameStart");
    });
}

textaliveEvents.on("onGameStart", () => {
    playingContainerFadeIn();
    initContainerFadeOut();
    textaliveBannerFadeOut();
    player.requestPlay();
});
