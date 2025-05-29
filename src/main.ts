import mitt from "mitt";
import { createSubjects } from "prismatix-input/mitt";
import type {
    KeyboardInputEvent,
    KeyboardInputOptions,
    WithPositionInputEvent,
    PointerInputOptions
} from "prismatix-input/web-native";
import {
    type CounterInputEvent,
    type DurationInputEvent,
    repeatInput,
    type RepeatInputEvent
} from "prismatix-input/middleware";
import { keyboardInput, pointerInput } from "prismatix-input/web-native";
import { counterMiddleware, startToEndDurationInput } from "prismatix-input/middleware";
import type {Subject} from "prismatix-input/subject";

import "./babylon/main";
import "./text-alive/main";
import { events as babylonEvents } from "./babylon/events";
import { events as textaliveEvents } from "./text-alive/events";
import { playAnimation } from "./babylon/mdl";
import {addFrequency, subtractLightness} from "./text-alive/circle-spectrum";


type Events = {
    anyInput: KeyboardInputEvent | WithPositionInputEvent;
    duration: DurationInputEvent;
    durationRepeat: DurationInputEvent | RepeatInputEvent;
    counter: CounterInputEvent;
};

const emitter = mitt<Events>();
export const { anyInput, duration, durationRepeat, counter } = createSubjects(emitter, ["anyInput", "durationRepeat", "duration", "counter"]);

pointerInput(anyInput, { events: ["pointerdown", "pointerup"] } as PointerInputOptions);
keyboardInput(anyInput as Subject<KeyboardInputEvent>, { events: ["keydown-norepeat", "keyup"] } as KeyboardInputOptions);
startToEndDurationInput(anyInput, [durationRepeat as Subject<DurationInputEvent>, duration], { minDuration: 300 });
repeatInput(anyInput, durationRepeat as Subject<RepeatInputEvent>)
counterMiddleware(durationRepeat, counter);


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
    });

    duration.subscribe(() => {
        console.log("duration");
        playAnimation("listening");
    });

    durationRepeat.subscribe((e) => {
        if ('repeatCount' in e) {
            if(e.repeatCount == 0) return;
        }
        console.log("counter",e);
        subtractLightness(0.1);
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
