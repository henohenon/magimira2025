import { type Ripple } from "./index.ts";

// Helper function to clamp values
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export interface SquareRipple extends Ripple {
  setMaxSize(maxSize: number): void;
  setGrowthSpeed(speed: number): void;
  setFadeSpeed(speed: number): void;
  setLineWidth(width: number): void;
}

export const createSquareRipple = (x: number, y: number, strength: number): SquareRipple => {
  let size = 0;
  let maxSize = 300;
  let opacity = 1;
  let growthSpeed = 2 + strength / 50;
  let fadeSpeed = 0.02 + strength / 1000;
  let lineWidth = 2 + strength / 50;
  let isActive = true;
  let hue = Math.random() * 360;

  const setMaxSize = (newMaxSize: number) => {
    maxSize = clamp(newMaxSize, 50, 1000);
  };

  const setGrowthSpeed = (speed: number) => {
    growthSpeed = clamp(speed, 0.5, 10);
  };

  const setFadeSpeed = (speed: number) => {
    fadeSpeed = clamp(speed, 0.001, 0.1);
  };

  const setLineWidth = (width: number) => {
    lineWidth = clamp(width, 0.5, 10);
  };

  const update = () => {
    if (!isActive) return false;
    
    size += growthSpeed;
    opacity -= fadeSpeed;
    
    if (opacity <= 0 || size >= maxSize) {
      isActive = false;
      return false;
    }
    
    return true;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    if (!isActive) return;
    
    ctx.beginPath();
    // Draw a square centered at (x, y) with width and height of size*2
    ctx.rect(x - size, y - size, size * 2, size * 2);
    ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${opacity})`;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  return {
    update,
    draw,
    setMaxSize,
    setGrowthSpeed,
    setFadeSpeed,
    setLineWidth
  };
};