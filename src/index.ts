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

    const playingContainer = document.getElementById("playing");
    if (!playingContainer) {
        throw new Error("Playing container not found");
    }
    const initContainer = document.getElementById("init");
    if (!initContainer) {
        throw new Error("Init container not found");
    }
    setOpacity(playingContainer, true);
    setOpacity(initContainer, false);
    playAnimation("startListen");

    anyInput.subscribe(() => {
        addFrequency(50);
        counterInstance.set(counterInstance.get() + 1);
    });

    duration.subscribe(() => {
        console.log("duration");
        playAnimation("listening");
    });
    counter.subscribe((e) => {
        console.log("counter", e);
        // setLightness(100 - e.count/2);
    })
});

function updateLoading() {
    if (!(babylonLoaded && textaliveLoaded)) return;
    if (!(textaliveLoaded)) return;

    const loadingWrapper = document.getElementById("loading-wrapper");
    if (!loadingWrapper) {
        throw new Error("Loading wrapper not found");
    }
    const textaliveBanner = document.getElementsByClassName("textalive-banner")[0] as HTMLElement;
    if (!textaliveBanner) {
        throw new Error("TextAlive banner not found");
    }
    setOpacity(loadingWrapper, false);
    textaliveBanner.classList.add("hidden");
}

function setOpacity(element: HTMLElement, visible: boolean) {
    if (visible) {
        element.classList.remove("opacity-0");
        element.classList.add("opacity-100");
        element.classList.remove("pointer-events-none");
    } else {
        element.classList.remove("opacity-100");
        element.classList.add("opacity-0");
        element.classList.add("pointer-events-none");
    }
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