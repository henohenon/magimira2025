const ripples: Ripple[] = [];

export interface Ripple {
  update(): boolean;
  draw(ctx: CanvasRenderingContext2D): void;
}

export const addRipple = (ripple: Ripple) => {
  ripples.push(ripple);
}

export const drawRipples = (ctx: CanvasRenderingContext2D) => {
  // Update ripples and remove inactive ones
  for (let i = ripples.length - 1; i >= 0; i--) {
    const isActive = ripples[i].update();
    if (!isActive) {
      ripples.splice(i, 1);
    }
  }

  ripples.forEach(ripple => ripple.draw(ctx));
};

export const clearRipples = () => {
  ripples.length = 0;
};

export * from "./circle.ts";
export * from "./square.ts";
