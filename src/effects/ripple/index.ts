const ripples: Ripple[] = [];

export type RippleConfig = {
  lifeTime?: number;
  defaultSize?: number;
  targetSize?: number;
  defaultOpacity?: number;
  targetOpacity?: number;
  color?: string;
}

export interface Ripple {
  update(deltaTime: number): boolean;
  draw(ctx: CanvasRenderingContext2D): void;
}

export const addRipple = (ripple: Ripple) => {
  ripples.push(ripple);
}

export const drawRipples = (ctx: CanvasRenderingContext2D, deltaTime: number) => {
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let i = ripples.length - 1; i >= 0; i--) {
    const isActive = ripples[i].update(deltaTime);
    if (!isActive) {
      ripples.splice(i, 1);
    }
  }

  for (const ripple of ripples) {
    ripple.draw(ctx);
  }
};

export const clearRipples = () => {
  ripples.length = 0;
};

export const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return {r, g, b};
}

export * from "./circle.ts";
export * from "./square.ts";
