import type { InputAndSlider } from "../web-components/input-slider";
import {events} from "~/text-alive/events.ts";

// Reference to the time slider element
const timeInputSlider = document.getElementById("time-input-slider") as InputAndSlider;

// Track time independently from game/update.ts
let lastTime = 0;
let lastPosition = 0;

export const startUpdateCycle = () => {
    const now = performance.now();
    lastTime = now;
    lastPosition = 0;
    updateCycle(now);
}

const updateCycle = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    const currentPosition = lastPosition + deltaTime;

    // Update the time slider with the current position
    if (timeInputSlider) {
        timeInputSlider.value = currentPosition;
    }

    lastTime = currentTime;
    lastPosition = currentPosition;
    requestAnimationFrame(updateCycle);
}

events.on("onGameStart", () => {
    // Initialize the update cycle when the module is loaded
    startUpdateCycle();
})
