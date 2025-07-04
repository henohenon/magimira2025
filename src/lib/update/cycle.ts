import { Group } from '@tweenjs/tween.js';

import {events} from "~/game/events";
import {engine, scene} from "~/lib/babylon";


let lastTime = 0;
let lastPosition = 0;
let isPause = true;
events.on("onLoaded", () => {
    lastTime = performance.now();
    lastPosition = 0;
    engine.runRenderLoop(() => {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;

        let currentPosition = lastPosition;
        if (!isPause) {
            currentPosition = lastPosition + deltaTime;
        }
        tweenGroup.update(currentTime);
        updateLogicFunction(lastPosition, currentPosition, deltaTime);

        lastTime = currentTime;
        lastPosition = currentPosition;

        scene.render();
    });
});

export const tweenGroup = new Group();

export type UpdateLogicFunction = (lastPosition: number, currentPosition: number, delta: number) => void;

// Variable to store the single updateLogic function
let updateLogicFunction: UpdateLogicFunction = () => {};

export const setUpdateLogic = (fn: UpdateLogicFunction): void => {
  updateLogicFunction = fn;
};

export const stopUpdateCycle = () => {
    isPause = true;
}

export const restartUpdateCycle = (position: number) => {
    console.log("Restart update cycle at", position);
    lastTime = performance.now();
    lastPosition = position;
    isPause = false;
}
