import {updateTextAlive} from "~/lib/text-alive";
import {updateEffects} from "~/lib/effects";
import {setUpdateLogic} from "~/lib/update/cycle";

import {checkKeyFrames} from "./events";

// Set up the update logic for the game
export const gameUpdate = (lastPosition: number, currentPosition: number, deltaTime: number) => {
    updateTextAlive(lastPosition, currentPosition);
    updateEffects(deltaTime);

    // Check for key frames at the current position
    checkKeyFrames(currentPosition);
};

setUpdateLogic(gameUpdate);
