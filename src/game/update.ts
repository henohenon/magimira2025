import {updateTextAlive} from "~/lib/text-alive";
import {updateEffects} from "~/lib/effects";
import {setUpdateLogic} from "~/lib/update/cycle";

import {checkKeyFrames} from "./events";

// Set up the update logic for the game
export const gameUpdate = (currentPosition: number, deltaTime: number) => {
    const lastPosition = currentPosition - deltaTime;

    updateTextAlive(lastPosition, currentPosition);
    updateEffects(deltaTime);

    // Check for key frames at the current position
    checkKeyFrames(currentPosition);
};

setUpdateLogic(gameUpdate);
