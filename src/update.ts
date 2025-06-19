// This file defines a common update cycle used by both src/game/update.ts and src/dev/controls/update.ts
// It supports a single update logic function that can be set using setUpdateLogic
import { events } from "~/text-alive/events.ts";

// Track time independently, similar to src/dev/controls/update.ts
let lastTime = 0;
let lastPosition = 0;
let animationFrameId: number | null = null;

// Tween system
interface Tween<T> {
  duration: number;
  startTime: number;
  step: (value: T) => void;
  interp: (p: number) => T;
  done: boolean;
}

const tweens: Tween<any>[] = [];

/** Tween 生成 */
export const tween = <T>(
  from: T,
  to: T,
  duration: number,
  step: (value: T) => void
)=> {
  tweens.push({
    duration,
    startTime: performance.now(),
    step,
    interp: buildInterpolator(from, to),
    done: false
  });

  // 最初のフレームをすぐ適用
  step(from);
}

const buildInterpolator = <T>(from: T, to: T): ((p: number) => T) => {
  if (typeof from === "number" && typeof to === "number") {
    const diff = to - from;
    return (p: number) => (from + diff * p) as T;
  }

  if (typeof from === "object" && from !== null && typeof to === "object" && to !== null) {
    const props = Object.keys(from) as (keyof T)[];
    const interpolators: { [K in keyof T]?: (p: number) => any } = {};

    for (const key of props) {
      interpolators[key] = buildInterpolator(from[key], to[key]);
    }

    return (p: number) => {
      const result: Partial<T> = {};
      for (const key of props) {
        const ip = interpolators[key];
        if (ip) result[key] = ip(p);
      }
      return result as T;
    };
  }

  return (_: number) => to;
};

const buildMutableInterpolator = <T extends object>(
  from: T,
  to: T,
  shared: T
): ((p: number) => T) => {
  const keys = Object.keys(from) as (keyof T)[];
  const interpolators: { [K in keyof T]?: (p: number) => any } = {};

  for (const key of keys) {
    interpolators[key] = buildInterpolator(from[key], to[key]);
  }

  return (p: number) => {
    for (const key of keys) {
      const ip = interpolators[key];
      if (ip) shared[key] = ip(p);
    }
    return shared;
  };
};

// ② “mutable” 専用ファクトリ
export const tweenMutable = <T extends object>(
  from: T,
  to: T,
  duration: number,
  step: (value: T) => void
): void => {
  // 参照の着地点を 1 度だけ決定
  const shared = { ...from }; // もとのオブジェクトをそのまま使うなら = from
  const interp = buildMutableInterpolator(from, to, shared);

  tweens.push({
    duration,
    startTime: performance.now(),
    step,
    interp,
    done: false
  });

  // 初回は from と同一内容の shared が渡る
  step(shared);
}

const updateTweenList = (currentPosition: number): void => {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tween = tweens[i];
    const elapsed = currentPosition - tween.startTime;

    if (elapsed >= tween.duration) {
      tween.step(tween.interp(1));
      tween.done = true;
      tweens.splice(i, 1);
    } else {
      const p = elapsed / tween.duration;
      tween.step(tween.interp(p));
    }
  }
};

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