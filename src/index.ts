import "~/lib/update";
import "~/lib/babylon";
import "~/lib/text-alive";
import "~/game";

import {events as babylonEvents} from "~/lib/babylon/events.ts";
import {events as textaliveEvents} from "~/lib/text-alive/events.ts";
import {events as gameEvents} from "./game/events";
import {
    creditContainerFadeIn,
    creditContainerFadeOut,
    initContainerFadeIn,
    initContainerFadeOut,
    loadingWrapperFadeOut,
    playingContainerFadeIn,
    textaliveBannerFadeOut
} from "~/game/dom/fade";
import {player} from "~/lib/text-alive";
import { delayForMilSeconds } from "~/lib/update";
import type { TweenControl } from "./lib/update/tween";

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
    loadingWrapperFadeOut(500);
    initContainerFadeIn(500);
    const initInput = document.getElementById("init-input");

    if (!initInput) {
        throw new Error("Init container not found");
    }
    const cb = () => {
        if (isCredit) return;
        initInput.removeEventListener("pointerdown", cb);
        window.addEventListener("keydown", cb);
        gameEvents.emit("onGameStart");
    };
    initInput.addEventListener("pointerdown", cb);
    window.addEventListener("keydown", cb);
}

gameEvents.on("onGameStart", async () => {
    initContainerFadeOut();
    textaliveBannerFadeOut();
    playingContainerFadeIn();
    creditContainerFadeOut();
    await delayForMilSeconds(3000);

    gameEvents.emit("onMusicStart");
    player.requestPlay();
});

const creditButton = document.getElementById("credit-button");
const closeCreditButton = document.getElementById("close-credit-button");
let isCredit = false;
if (!creditButton || !closeCreditButton) {
    throw new Error("Credit button not found");
}

let creditTween: TweenControl | null = null;
creditButton.addEventListener("click", () => {
    if(creditTween) {
        creditTween.complete();
        creditTween = null;
    }
    creditTween = creditContainerFadeIn(500);
    isCredit = true;
});
closeCreditButton.addEventListener("click", () => {
    if(creditTween) {
        creditTween.complete();
        creditTween = null;
    }
    creditTween = creditContainerFadeOut(500);
    isCredit = false;
});
