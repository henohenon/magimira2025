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
import {playAnimation} from "~/babylon/mdl.ts";
import {player} from "~/text-alive";
import {startUpdateCycle} from "~/game/update.ts";


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
        playingContainerFadeIn();
        initContainerFadeOut();
        textaliveBannerFadeOut();

        playAnimation("dotmiku", "startListen");
        setTimeout(() => {
            textaliveEvents.emit("onGameStart");
        }, 3000);
    });
}

textaliveEvents.on("onGameStart", () => {
    player.requestMediaSeek(0);
    player.requestPlay();
    startUpdateCycle();
});
