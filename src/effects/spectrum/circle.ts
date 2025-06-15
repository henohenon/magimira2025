import { createSpectrum, type Spectrum } from "./utils.ts";
import { clamp } from "~/util.ts";

export const circle = (): CircleSpectrum => {
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

  const addFrequencyByAngle = (angle: number, strength: number, range: number = 0) => {
    // Convert angle to rate (0~1)
    // Normalize angle to be between 0 and 2π
    const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const rate = normalizedAngle / (Math.PI * 2);

    // Call the existing addFrequencyByRate method
    spectrum.addFrequencyByRate(rate, strength, range);
  };

  return {
    ...spectrum,
    setMinRadius,
    setMaxRadius,
    setRadius,
    addFrequencyByAngle,
  }
}

export interface CircleSpectrum extends Spectrum {
  setMinRadius(minRadius: number): void;
  setMaxRadius(maxRadius: number): void;
  setRadius(max: number, min: number): void;
  addFrequencyByAngle(angle: number, strength: number, range?: number): void;
}
