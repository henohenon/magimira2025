import {updateTextAlive} from "~/text-alive";
import {updateEffects} from "~/effects";
import {checkCameraActions} from "./events";
import {setUpdateLogic} from "~/update/cycle";

// Set up the update logic for the game
export const gameUpdate = (currentPosition: number, deltaTime: number) => {
    const lastPosition = currentPosition - deltaTime;

    updateTextAlive(lastPosition, currentPosition);
    updateEffects(deltaTime);

    // Check for camera actions at the current position
    checkCameraActions(currentPosition);
};

setUpdateLogic(gameUpdate);