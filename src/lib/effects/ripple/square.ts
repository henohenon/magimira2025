import {addRipple, hexToRgb, type Ripple, type RippleConfig} from "./index.ts";

export type SquareRippleConfig = RippleConfig & {
  angle?: number;
};

export const createSquareRipple = (x: number, y: number, config: SquareRippleConfig = {}): Ripple => {
  const lifeTime = config.lifeTime || 1000;
  const defaultSize = config.defaultSize || 0;
  const targetSize = config.targetSize || 100;
  const defaultOpacity = config.defaultOpacity || 1;
  const targetOpacity = config.targetOpacity || 0;
  const inputColor = config.color || "#ffffff";
  const {r, g, b} = hexToRgb(inputColor);
  const colorBase = `rgba(${r}, ${g}, ${b}`;
  const angle = config.angle || 45;
  let time = 0;
  let size = defaultSize;
  let opacity = defaultOpacity;

  const update = (deltaTime: number) => {
    // Calculate progress as a value between 0 and 1
    time += deltaTime;
    const progress = Math.min(time / lifeTime, 1);

    // Interpolate size and opacity based on progress
    size = defaultSize + (targetSize - defaultSize) * progress;
    opacity = defaultOpacity + (targetOpacity - defaultOpacity) * progress;

    return time < lifeTime;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);

    ctx.beginPath();
    ctx.rect(-size, -size, size * 2, size * 2);
    ctx.strokeStyle = `${colorBase}, ${opacity})`;
    ctx.stroke();

    ctx.restore();
  };

  const ripple = {
    update,
    draw
  }
  addRipple(ripple);
  return ripple;
};
