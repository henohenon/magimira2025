import {addRipple, type Ripple, type RippleConfig} from "./index.ts";

export type SquareRippleConfig = RippleConfig & {
  angle?: number;
};

export const createSquareRipple = (x: number, y: number, config: SquareRippleConfig = {}): Ripple => {
  const lifeTime = config.lifeTime || 100;
  const sizeDelta = config.sizeDelta || 1;
  let size = config.defaultSize || 10;
  const opacityDelta = config.opacityDelta || 0.05;
  let opacity = config.defaultOpacity || 1;
  const hue = config.color || 0;
  const angle = config.angle || 0;
  let time = 0;

  const update = () => {

    size += sizeDelta;
    opacity += opacityDelta;

    time++;

    return time < lifeTime;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.rect(-size, -size, size * 2, size * 2);
    ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${opacity})`;
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
