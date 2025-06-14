import { spectrums } from "~/index.ts";
import { clamp } from "~/util.ts";

// Define the maximum number of lines for the spectrum
const lineMaxCounts = 40;
let frequency = new Uint8Array(lineMaxCounts);
const frequencyTarget = new Uint8Array(frequency.length);
const frequencyDelta: number[] = new Array(frequency.length).fill(0);

const updateFrequency = (deltaTime: number) => {
  for (let i = 0; i < frequency.length; i++) {
    const target = frequencyTarget[i];
    const diff = target - frequency[i];
    if (Math.abs(diff) <= Math.abs(frequencyDelta[i] * deltaTime)) {
      if(target == 0) {
        frequencyDelta[i] = 0;
        frequency[i] = 0;
      }else{
        frequencyTarget[i] = 0;
        updateFrequencyDelta(i);
      }
    }
  }
  frequency = frequency.map((value, index) => value + frequencyDelta[index] * deltaTime);
};
const updateFrequencyDelta = (index: number) => {
  const diff = frequencyTarget[index] - frequency[index];
  frequencyDelta[index] = (5 * Math.abs(diff) / 256) * Math.sign(diff);
};
export const addFrequency = (strength: number) => {
  const idx =  Math.floor(Math.random() * frequency.length);
  frequencyTarget[idx] = clamp(frequencyTarget[idx] + strength, 0, 255);
  updateFrequencyDelta(idx);
}

const updateRate = 0.1;
export const drawFrequencySpectrum = (ctx: CanvasRenderingContext2D, deltaTime: number) => {
  updateFrequency(deltaTime * updateRate);
  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;
  for (const spectrum of Object.values(spectrums)) {
    spectrum.drawSpectrum(ctx, centerX, centerY);
  }
}

export const createSpectrum = (beforeDraw: (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => void, drawLine: (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, frequency: number, lineRate: number) => void) => {
  let currentColor = '#ffffff';
  let currentHue = 0;
  let currentSaturation = 0;
  let currentLightness = 1;
  let hueOffset = 240;
  let currentOpacity = 1;
  let lineCounts = frequency.length;
  let isEnabled = true;

  const setColor = (color: string)=> {
    currentColor = color;
    const hsl = hexToHsl(currentColor);
    currentHue = hsl.h;
    currentSaturation = hsl.s;
    currentLightness = hsl.l;
  }
  const setHueOffset = (offset: number)=> {
    hueOffset = offset;
  }
  const setOpacity = (opacity: number)=> {
    currentOpacity = clamp(opacity, 0, 1);
  }
  const setLineCounts = (count: number)=> {
    lineCounts = clamp(count, 3, 39);
  }
  const setEnable = (enable: boolean)=> {
    isEnabled = enable;
  }
  const drawSpectrum = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if(!isEnabled) return;
    // updateFrequency(deltaTime);
    const strokeBase = `${currentSaturation * 100}%, ${currentLightness * 100}%, ${currentOpacity})`;
    beforeDraw(ctx, centerX, centerY);
    for (let i = 0; i < lineCounts; i++) {
      const freqValue = frequency[i] / 256 || 0;
      const lineRate = i / lineCounts;
      ctx.strokeStyle = `hsla(${currentHue + (i / lineCounts) * hueOffset}, ${strokeBase}`;
      drawLine(ctx, centerX, centerY, freqValue, lineRate);
    }
  }

  return {
    setColor,
    setOpacity,
    setHueOffset,
    setLineCounts,
    setEnable,
    drawSpectrum,
  };
};
export interface Spectrum {
  setColor(color: string): void;
  setOpacity(opacity: number): void;
  setHueOffset(offset: number): void;
  setLineCounts(count: number): void;
  setEnable(enable: boolean): void;
  drawSpectrum(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void;
}

function hexToHsl(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  // Lightness
  const l = (max + min) / 2;

  // Saturation
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  // Hue
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return {h, s, l};
}


export * from "./circle-spectrum.ts";
export * from "./horizontal-spectrum.ts";
export * from "./vertical-spectrum.ts";
