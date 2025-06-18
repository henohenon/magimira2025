// This file defines a common update cycle used by both src/game/update.ts and src/dev/controls/update.ts
// It supports a single update logic function that can be set using setUpdateLogic
import { events } from "~/text-alive/events.ts";

// Track time independently, similar to src/dev/controls/update.ts
let lastTime = 0;
let lastPosition = 0;
let animationFrameId: number | null = null;

export const updateCycle = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    const currentPosition = lastPosition + deltaTime;

    // Call updateLogic to execute the registered update function
    updateLogic(currentPosition, deltaTime);

    lastTime = currentTime;
    lastPosition = currentPosition;
    animationFrameId = requestAnimationFrame(updateCycle);
}

// Function type for updateLogic
export type UpdateLogicFunction = (currentPosition: number, delta: number) => void;

// Variable to store the single updateLogic function
let updateLogicFunction: UpdateLogicFunction = () => {};

// Function to set the updateLogic function
export const setUpdateLogic = (fn: UpdateLogicFunction) => {
    updateLogicFunction = fn;
}

// Function that calls the registered updateLogic function if it exists
const updateLogic = (currentPosition: number, deltaTime: number) => {
    if (updateLogicFunction) {
        updateLogicFunction(currentPosition, deltaTime);
    }
}

export const startUpdateCycle = () => {
    const now = performance.now();
    lastTime = now;
    lastPosition = 0;
    updateCycle(now);
}

export const stopUpdateCycle = () => {
    if (!animationFrameId) return;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
}

export const restartUpdateCycle = (position: number) => {
    stopUpdateCycle();
    lastTime = performance.now();
    lastPosition = position;
    updateCycle(lastTime);
}

// Setup event listeners similar to src/dev/controls/update.ts
events.on("onPause", () => {
    stopUpdateCycle();
});

events.on("onPlay", ({ position }) => {
    restartUpdateCycle(position);
});

events.on("onSeek", ({ position }) => {
    // Only restart the update cycle if the player is playing
    // This preserves the behavior from src/dev/controls/update.ts
    import("~/text-alive").then(({ player }) => {
        if (!player.isPlaying) return;
        restartUpdateCycle(position);
    });
});
