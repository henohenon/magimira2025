import "./babylon";
import "./text-alive";
import "./input.ts";
import { events as babylonEvents } from "./babylon/events";
import {events, events as textaliveEvents} from "./text-alive/events";
import { playAnimation } from "./babylon/mdl";
import {updateEffects} from "./effects";
import {player, updateTextAlive} from "./text-alive";
import {
    initContainerFadeOut,
    loadingWrapperFadeOut,
    playingContainerFadeIn,
    textaliveBannerFadeOut
} from "./effects/dom";
import {
    circleRippleAndCircleSpectrum,
    squareRippleAndVerticalSpectrum,
    cameraMoveAndHorizontalSpectrum,
    colorFullAll
} from "./effects/preset";


// Array of preset functions for random selection on beat
const presets = [
    circleRippleAndCircleSpectrum,
    squareRippleAndVerticalSpectrum,
    cameraMoveAndHorizontalSpectrum,
    colorFullAll
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

    playAnimation("startListen");

    // Variables to track preset rotation
    let currentPresetIndex = 0;
    let phraseCount = 0;

    // Apply the first preset immediately
    presets[0]();
    console.log("Game started! Applied first preset: 0");

    // Change preset in order every 2 phrases
    textaliveEvents.on("onPhrase", () => {
        phraseCount++;

        // Change preset every 2 phrases
        if (phraseCount >= 2) {
            // Select the next preset in order
            const preset = presets[currentPresetIndex];

            // Apply the selected preset
            preset();
            console.log("Phrase detected! Changed to preset:", currentPresetIndex);

            // Move to the next preset (loop back to the beginning if needed)
            currentPresetIndex = (currentPresetIndex + 1) % presets.length;

            // Reset phrase count
            phraseCount = 0;
        } else {
            console.log("Phrase detected! Waiting for next phrase. Current count:", phraseCount);
        }
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
