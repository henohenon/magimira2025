import { createCircleRipple, type CircleRipple } from "./circle.ts";
import { createSquareRipple, type SquareRipple } from "./square.ts";

const ripples: Ripple[] = [];

export interface Ripple {
  update(): boolean;
  draw(ctx: CanvasRenderingContext2D): void;
}

export const addRipple = (positionX: number, positionY: number, strength: number = 50, type: 'circle' | 'square' = 'circle'): CircleRipple | SquareRipple => {
  let ripple: CircleRipple | SquareRipple;

  if (type === 'square') {
    ripple = createSquareRipple(positionX, positionY, strength);
  } else {
    ripple = createCircleRipple(positionX, positionY, strength);
  }

  ripples.push(ripple);
  return ripple;
};

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
