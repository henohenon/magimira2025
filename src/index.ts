import mitt from "mitt";
import { createSubjects } from "prismatix-input/mitt";
import type {
    KeyboardInputEvent,
    KeyboardInputOptions,
    WithPositionInputEvent,
    PointerInputOptions
} from "prismatix-input/web-native";
import type {
    CounterInputEvent,
    DurationInputEvent,
    RepeatInputEvent,
    CounterMiddleware
} from "prismatix-input/middleware";
import { keyboardInput, pointerInput } from "prismatix-input/web-native";
import { counterMiddleware, repeatInput, startToEndDurationInput } from "prismatix-input/middleware";
import type {Subject} from "prismatix-input/subject";

import "./babylon";
import "./text-alive";
import { events as babylonEvents } from "./babylon/events";
import {events, events as textaliveEvents} from "./text-alive/events";
import { playAnimation } from "./babylon/mdl";
import {addFrequency, type Spectrum} from "./effects/spectrum";
import { circleSpectrum, verticalSpectrum, horizontalSpectrum } from "./effects/spectrum";
import {updateEffects} from "./effects";
import {player, updateTextAlive} from "./text-alive";
import {
    initContainerFadeOut,
    loadingWrapperFadeOut,
    playingContainerFadeIn,
    textaliveBannerFadeOut
} from "./effects/dom";


type Events = {
    anyInput: KeyboardInputEvent | WithPositionInputEvent;
    duration: DurationInputEvent;
    durationRepeat: DurationInputEvent | RepeatInputEvent;
    counter: CounterInputEvent;
};

export const spectrums: Record<string, Spectrum> = {
    "circle": circleSpectrum(),
    "horizontal": horizontalSpectrum(),
    "vertical": verticalSpectrum()
};

const emitter = mitt<Events>();
export const { anyInput, duration, durationRepeat, counter } = createSubjects(emitter, ["anyInput", "durationRepeat", "duration", "counter"]);

const inputArea = document.getElementById("input-area");
pointerInput(anyInput, { events: ["pointerdown", "pointerup"], target: inputArea } as PointerInputOptions);
keyboardInput(anyInput as Subject<KeyboardInputEvent>, { events: ["keydown-norepeat", "keyup"], target: inputArea as EventTarget } as KeyboardInputOptions);
startToEndDurationInput(anyInput, [durationRepeat as Subject<DurationInputEvent>, duration], { minDuration: 300 });
repeatInput(anyInput, durationRepeat as Subject<RepeatInputEvent>)
export const counterInstance  = counterMiddleware(durationRepeat, counter) as CounterMiddleware;


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

    anyInput.subscribe(() => {
        addFrequency(50);
        counterInstance.set(counterInstance.get() + 1);
    });

    duration.subscribe(() => {
        console.log("duration");
        playAnimation("dotmiku", "listening");
    });
    counter.subscribe((e) => {
        console.log("counter", e);
        // setLightness(100 - e.count/2);
    })
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
})