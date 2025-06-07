import { createSpectrum, type Spectrum } from "./index.ts";

export const horizontalSpectrum = (): HorizontalSpectrum => {
  let height = 300;

  const setHeight = (newHeight: number) => {
    height = newHeight;
  };

  const spectrum = createSpectrum(
    (ctx) => {
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
    },
    (ctx, _, centerY, frequency, lineRate) => {
      const canvasWidth = ctx.canvas.width;
      const x = lineRate * canvasWidth;
      const lineHeight = frequency * height;

      ctx.beginPath();
      ctx.moveTo(x, centerY);
      ctx.lineTo(x, centerY + lineHeight);
      ctx.moveTo(x, centerY);
      ctx.lineTo(x, centerY - lineHeight);
      ctx.stroke();
    }
  );

  return {
    ...spectrum,
    setHeight,
  };
};

export interface HorizontalSpectrum extends Spectrum {
  setHeight(height: number): void;
}