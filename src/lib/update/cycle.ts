import {events} from "~/game/events";
import {engine, scene} from "~/lib/babylon";

import {updateTweenList} from "./tween";

let lastTime = 0;
let lastPosition = 0;
let isPause = false;
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
        updateTweenList(currentTime);

        updateLogic(currentPosition, deltaTime);

        lastTime = currentTime;
        lastPosition = currentPosition;

        scene.render();
    });
});

// Function type for updateLogic
export type UpdateLogicFunction = (currentPosition: number, delta: number) => void;

// Variable to store the single updateLogic function
let updateLogicFunction: UpdateLogicFunction = () => {};

export const setUpdateLogic = (fn: UpdateLogicFunction): void => {
  updateLogicFunction = fn;
};

const updateLogic = (currentPosition: number, deltaTime: number): void => {
  if (updateLogicFunction) {
    updateLogicFunction(currentPosition, deltaTime);
  }
};

export const stopUpdateCycle = () => {
    isPause = true;
}

export const restartUpdateCycle = (position: number) => {
    lastTime = performance.now();
    lastPosition = position;
    isPause = false;
}
