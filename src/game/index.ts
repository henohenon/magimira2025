import { events as babylonEvents } from "~/babylon/events";
import {events, events as textaliveEvents} from "~/text-alive/events";
import { playAnimation } from "~/babylon/mdl";
import {updateEffects} from "~/effects";
import {player, updateTextAlive} from "~/text-alive";
import {
    initContainerFadeOut,
    loadingWrapperFadeOut,
    playingContainerFadeIn,
    textaliveBannerFadeOut
} from "~/effects/dom";

import {
    circleRippleAndCircleSpectrum,
    squareRippleAndVerticalSpectrum,
    cameraMoveAndHorizontalSpectrum
} from "./preset";

// Array of preset functions for random selection on beat
const presets = [
    circleRippleAndCircleSpectrum,
    squareRippleAndVerticalSpectrum,
    cameraMoveAndHorizontalSpectrum
];

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

textaliveEvents.on("onGameStart", () => {
    if (!babylonLoaded) return;
    playingContainerFadeIn();
    initContainerFadeOut();
    textaliveBannerFadeOut();

    playAnimation("dotmiku", "startListen");

    let lastSegmentTime = -2000;
    let currentPresetIndex = 0;

    // Apply the first preset immediately
    console.log("Game started! Applied first preset: 0");

    textaliveEvents.on("onSegment", () => {
        // Don't apply the same preset twice in a row'
        const now = performance.now();
        if (now - lastSegmentTime < 2000) return;
        lastSegmentTime = now;

        // Apply the selected preset
        const preset = presets[currentPresetIndex];
        preset();

        // Move to the next preset (loop back to the beginning if needed)
        currentPresetIndex = (currentPresetIndex + 1) % presets.length;
    });
});

function updateLoading() {
    if (!(babylonLoaded && textaliveLoaded)) return;

    loadingWrapperFadeOut();
}

let lastTime = 0;
let lastPosition = 0;
const updateCycle = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    const currentPosition = lastPosition + deltaTime;

    updateTextAlive(lastPosition, currentPosition)
    updateEffects(deltaTime);

    lastTime = currentTime;
    lastPosition = currentPosition;
    requestAnimationFrame(updateCycle);
}

events.on("onAppReady", () => {
    const startButton = document.getElementById("start-button");
    if (!startButton) {
        throw new Error("Start button not found");
    }
    startButton.addEventListener("click", () => {
        events.emit("onGameStart");
        setTimeout(() => {
            player.requestMediaSeek(0);
            player.requestPlay();
            const now = performance.now();
            lastTime = now;
            lastPosition = 0;
            updateCycle(now);
        }, 3000);
    });
});