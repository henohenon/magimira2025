import {updateTextAlive} from "~/text-alive";
import {updateEffects} from "~/effects";
import {checkCameraActions} from "./events";

export const startUpdateCycle = () => {
    const now = performance.now();
    lastTime = now;
    lastPosition = 0;
    updateCycle(now);
}

let lastTime = 0;
let lastPosition = 0;
const updateCycle = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    const currentPosition = lastPosition + deltaTime;

    updateTextAlive(lastPosition, currentPosition);
    updateEffects(deltaTime);

    // Check for camera actions at the current position
    checkCameraActions(currentPosition);

    lastTime = currentTime;
    lastPosition = currentPosition;
    requestAnimationFrame(updateCycle);
}
