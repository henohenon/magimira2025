import { createSpectrum, type Spectrum } from "./utils.ts";

export const vertical = (): VerticalSpectrum => {
  let width = 300;

  const setWidth = (newWidth: number) => {
    width = newWidth;
  };

  const spectrum = createSpectrum(
    (ctx) => {
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
    },
    (ctx, centerX, _, frequency, lineRate) => {
      const canvasHeight = ctx.canvas.height;
      const y = lineRate * canvasHeight;
      const lineWidth = frequency * width;

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(lineWidth, y);
      ctx.moveTo(centerX * 2, y);
      ctx.lineTo(centerX * 2 - lineWidth, y);
      ctx.stroke();
    }
  );

  return {
    ...spectrum,
    setWidth,
  };
};

export interface VerticalSpectrum extends Spectrum {
  setWidth(width: number): void;
}
