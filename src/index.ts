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

    // Change random preset when a beat is detected
    textaliveEvents.on("onBeat", () => {
        // Select a random preset from the array
        const randomIndex = Math.floor(Math.random() * presets.length);
        const randomPreset = presets[randomIndex];

        // Apply the selected preset
        randomPreset();
        console.log("Beat detected! Changed to preset:", randomIndex);
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
