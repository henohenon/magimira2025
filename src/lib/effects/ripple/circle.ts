import {addRipple, hexToRgb, type Ripple, type RippleConfig} from "./index.ts";

export const createCircleRipple = (x: number, y: number, config: RippleConfig = {}): Ripple => {
  const lifeTime = config.lifeTime || 1000;
  const defaultSize = config.defaultSize || 0;
  const targetSize = config.targetSize || 100;
  const defaultOpacity = config.defaultOpacity || 1;
  const targetOpacity = config.targetOpacity || 0;
  const inputColor = config.color || "#ffffff";
  const {r, g, b} = hexToRgb(inputColor);
  const colorBase = `rgba(${r}, ${g}, ${b}`

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
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.strokeStyle = `${colorBase}, ${opacity})`;
    ctx.stroke();
  };

  const ripple = {
    update,
    draw
  };
  addRipple(ripple)
  return ripple;
};