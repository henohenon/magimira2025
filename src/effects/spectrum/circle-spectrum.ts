import { createSpectrum, type Spectrum } from "./index.ts";
import { clamp } from "../../util.ts";

export const circleSpectrum = (): CircleSpectrum => {
  let minRadiusRatio = 0.5;
  let maxRadiusRatio = 200;

  // These functions are internal to the circleSpectrum function
  const setMinRadius = (minRadius: number) => {
    minRadiusRatio = clamp(minRadius, 0, 5);
  };

  const setMaxRadius = (maxRadius: number) => {
    maxRadiusRatio = clamp(maxRadius, 0, Number.POSITIVE_INFINITY);
  };

  const setRadius = (min: number, max: number) => {
    setMinRadius(min);
    setMaxRadius(max);
  };

  let minRadius = 0;
  const spectrum = createSpectrum(
      (ctx, centerX, centerY) => {
        minRadius = Math.min(centerX, centerY) * minRadiusRatio;

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
      },
      (ctx, centerX, centerY, frequency, lineRate) => {
        const angle = lineRate * Math.PI * 2;

        const lineLength = frequency * (maxRadiusRatio - minRadiusRatio);

        const startX = centerX + Math.cos(angle) * minRadius;
        const startY = centerY + Math.sin(angle) * minRadius;
        const endX = centerX + Math.cos(angle) * (minRadius + lineLength);
        const endY = centerY + Math.sin(angle) * (minRadius + lineLength);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
  );

  return {
    ...spectrum,
    setMinRadius,
    setMaxRadius,
    setRadius,
  }
}

export interface CircleSpectrum extends Spectrum {
  setMinRadius(minRadius: number): void;
  setMaxRadius(maxRadius: number): void;
  setRadius(max: number, min: number): void;
}
