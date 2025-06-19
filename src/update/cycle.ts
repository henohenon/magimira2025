import { updateTweenList } from "./tween";

// Track time independently, similar to src/dev/controls/update.ts
let lastTime = 0;
let lastPosition = 0;
let animationFrameId: number | null = null;

export const updateCycle = (currentTime: number): void => {
  const deltaTime = currentTime - lastTime;
  const currentPosition = lastPosition + deltaTime;

  updateTweenList(currentPosition);

  updateLogic(currentPosition, deltaTime);

  lastTime = currentTime;
  lastPosition = currentPosition;
  animationFrameId = requestAnimationFrame(updateCycle);
};

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
