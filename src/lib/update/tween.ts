import { Color3 } from "@babylonjs/core/Maths/math.color";

// Tween system
interface Tween<T> {
  duration: number;
  startTime: number;
  step: (value: T) => void;
  interp: (p: number) => T;
  done: boolean;
  resolve?: (value: void) => void;
  reject?: (reason?: any) => void;
}

// Interface for tween control methods
export interface TweenControl {
  cancel: () => void;
  complete: () => void;
  promise: Promise<void>;
}

const tweens: Tween<any>[] = [];

/** Tween 生成 */
export const tween = <T>(
  from: T,
  to: T,
  duration: number,
  step: (value: T) => void,
  options?: { onComplete?: () => void; }
): TweenControl => {
  let resolvePromise = () => {
    if (options?.onComplete) options.onComplete();
  };
  let rejectPromise = () => {};

  const promise = new Promise<void>((resolve, reject) => {
    resolvePromise = () => {
      resolve();
      if (options?.onComplete) options.onComplete();
    }
    rejectPromise = reject;
  });

  const newTween: Tween<T> = {
    duration,
    startTime: performance.now(),
    step,
    interp: buildInterpolator(from, to),
    done: false,
    resolve: resolvePromise,
    reject: rejectPromise
  };

  tweens.push(newTween);

  // 最初のフレームをすぐ適用
    step(from);

  // Return control object
  return {
    cancel: () => {
      const index = tweens.indexOf(newTween);
      if (index === -1) return;
      tweens.splice(index, 1);
      if (newTween.reject) newTween.reject(new Error('Tween cancelled'));
    },
    complete: () => {
      const index = tweens.indexOf(newTween);
      if (index === -1) return;
        // Apply final value
        step(newTween.interp(1));
        // Remove from tweens array
        tweens.splice(index, 1);
        if (newTween.resolve) newTween.resolve();
    },
    promise
  };
}

const buildInterpolator = <T>(from: T, to: T): ((p: number) => T) => {
  if (typeof from === "number" && typeof to === "number") {
    const diff = to - from;
    return (p: number) => (from + diff * p) as T;
  }

  if(from instanceof Color3 && to instanceof Color3) {
    let tmp = from.clone();
    const diffR = to.r - from.r;
    const diffG = to.g - from.g;
    const diffB = to.b - from.b;
    
    return (p: number) => {
      tmp.r = from.r + diffR * p;
      tmp.g = from.g + diffG * p;
      tmp.b = from.b + diffB * p;
      return tmp as T
    };
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

export const updateTweenList = (current: number): void => {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tween = tweens[i];
    const elapsed = current - tween.startTime;

      if (elapsed >= tween.duration) {
        tween.step(tween.interp(1));
        tween.done = true;
        tweens.splice(i, 1);
        // 重要: Promiseを解決する
        if (tween.resolve) tween.resolve();
      } else {
        const p = elapsed / tween.duration;
        tween.step(tween.interp(p));
      }
  }
};