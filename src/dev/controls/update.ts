import type { InputAndSlider } from "../web-components/input-slider";
import {events} from "~/text-alive/events.ts";
import {player} from "~/text-alive";

// Reference to the time slider element
const timeInputSlider = document.getElementById("time-input-slider") as InputAndSlider;
if (!timeInputSlider) throw new Error("Time controls not found");

// Track time independently from game/update.ts
let lastTime = 0;
let lastPosition = 0;
let animationFrameId: number | null = null;


const updateCycle = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    const currentPosition = lastPosition + deltaTime;

    // Update the time slider with the current position
    timeInputSlider.value = Math.round(currentPosition);

    lastTime = currentTime;
    lastPosition = currentPosition;
    animationFrameId = requestAnimationFrame(updateCycle);
}

const stopUpdateCycle = () => {
    if (!animationFrameId) return;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
}
const restartUpdateCycle = (position: number) => {
    stopUpdateCycle();
    lastTime = performance.now();
    lastPosition = position;
    updateCycle(lastTime);
}
events.on("onPause", () => {
    stopUpdateCycle();
});
events.on("onPlay", ({ position }) => {
        restartUpdateCycle(position);
});
events.on("onSeek", ({ position }) => {
    if(!player.isPlaying) return;
    restartUpdateCycle(position);
});