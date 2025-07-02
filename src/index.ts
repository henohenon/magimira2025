import type { Tween } from "@tweenjs/tween.js/";

import "~/lib/update";
import "~/lib/babylon";
import "~/lib/text-alive";
import "~/game";

import {events as babylonEvents} from "~/lib/babylon/events.ts";
import {events as textaliveEvents} from "~/lib/text-alive/events.ts";
import { delayForMilSeconds } from "~/lib/update";
import { tweenGroup } from "./lib/update/cycle";
import {player} from "~/lib/text-alive";
import {events as gameEvents} from "~/game/events";
import {
    creditContainerFadeIn,
    creditContainerFadeOut,
    initContainerFadeIn,
    initContainerFadeOut,
    loadingWrapperFadeOut,
    playingContainerFadeIn,
    textaliveBannerFadeOut
} from "~/game/dom/fade";

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
    const inputArea = document.getElementById("input-area");

    if (!initInput || !inputArea) {
        throw new Error("Init input or input area not found");
    }

    const cb = () => {
        if (isCredit) return;
        initInput.removeEventListener("pointerdown", cb);
        inputArea.addEventListener("keydown", cb);
        gameEvents.emit("onGameStart");
    };
    initInput.addEventListener("pointerdown", cb);
    inputArea.addEventListener("keydown", cb);
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

let creditTween: Tween | null = null;
creditButton.addEventListener("click", () => {
    if(creditTween) {
        creditTween.end();
        tweenGroup.remove(creditTween);
        creditTween = null;
    }
    creditTween = creditContainerFadeIn(500);
    isCredit = true;
});
closeCreditButton.addEventListener("click", () => {
    if(creditTween) {
        creditTween.end();
        tweenGroup.remove(creditTween);
        creditTween = null;
    }
    creditTween = creditContainerFadeOut(500);
    isCredit = false;
});

const fullscreenCheckbox = document.getElementById("fullscreen-checkbox") as HTMLInputElement;
if (!fullscreenCheckbox) throw new Error("Fullscreen checkbox not found");
fullscreenCheckbox.addEventListener("change", async () => {
    if (fullscreenCheckbox.checked) {
        // 全画面に入る
        if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        }
    } else {
        // 全画面解除
        if (document.exitFullscreen) {
            await document.exitFullscreen();
        }
    }
});
document.addEventListener("fullscreenchange", () => {
    fullscreenCheckbox.checked = document.fullscreenElement !== null;
});

const orientationWarning = document.getElementById("orientation-warning") as HTMLElement;
if (!orientationWarning) throw new Error("Orientation warning not found");
function checkWindowSize() {
    if(window.innerWidth < window.innerHeight) {
        orientationWarning.classList.remove("hidden");
    }else{
        orientationWarning.classList.add("hidden");
    }
}
checkWindowSize();
window.addEventListener("resize", checkWindowSize);