import {addRipple, type Ripple} from "./index.ts";
export interface CircleRippleConfig {
  lifeTime?: number;
  radiusDelta?: number;
  defaultRadius?: number;
  opacityDelta?: number;
  defaultOpacity?: number;
  hue?: number;
}

export const createCircleRipple = (x: number, y: number, config: CircleRippleConfig = {}): Ripple => {
  const lifeTime = config.lifeTime || 100;
  const radiusDelta = config.radiusDelta || 1;
  let radius = config.defaultRadius || 0;
  const opacityDelta = config.opacityDelta || 0.05;
  let opacity = config.defaultOpacity || 1;
  const hue = config.hue || 0;

  let time = 0;

  const update = () => {
    radius += radiusDelta;
    opacity += opacityDelta;

    time++;

    return time < lifeTime;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${opacity})`;
    ctx.stroke();
  };

  const ripple = {
    update,
    draw
  };
  addRipple(ripple)
  return ripple;
};
