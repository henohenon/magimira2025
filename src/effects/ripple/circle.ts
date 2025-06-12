import {addRipple, type Ripple, type RippleConfig} from "./index.ts";

export const createCircleRipple = (x: number, y: number, config: RippleConfig = {}): Ripple => {
  const lifeTime = config.lifeTime || 100;
  let size = config.defaultSize || 0;
  const sizeDelta = config.sizeDelta || 1;
  const opacityDelta = config.opacityDelta || 0.05;
  let opacity = config.defaultOpacity || 1;
  const inputColor = config.color || "#ffffff";
  const {r, g, b} = hexToRgb(inputColor);
  const colorBase = `rgba(${r}, ${g}, ${b}`

  let time = 0;

  const update = (deltaTime: number) => {
    size += sizeDelta;
    opacity += opacityDelta;

    time += deltaTime;

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

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return {r, g, b};
}
