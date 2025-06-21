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
  console.log("tween", tweens, from, to, duration, step);

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

// ② "mutable" 専用ファクトリ
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

export const updateTweenList = (current: number): void => {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tween = tweens[i];
    const elapsed = current - tween.startTime;

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