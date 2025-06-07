import { spectrums } from "../../main.ts";
import { clamp } from "../../util.ts";

// Define the maximum number of lines for the spectrum
const lineMaxCounts = 40;
let frequency = new Uint8Array(lineMaxCounts);
const frequencyTarget = new Uint8Array(frequency.length);
const frequencyDelta: number[] = new Array(frequency.length).fill(0);

const updateFrequency = () => {
  for (let i = 0; i < frequency.length; i++) {
    const target = frequencyTarget[i];
    const diff = target - frequency[i];
    if (Math.abs(diff) <= Math.abs(frequencyDelta[i])) {
      if(target == 0) {
        frequencyDelta[i] = 0;
        frequency[i] = 0;
      }else{
        frequencyTarget[i] = 0;
        updateFrequencyDelta(i);
      }
    }
  }
  frequency = frequency.map((value, index) => value + frequencyDelta[index]);
};
const updateFrequencyDelta = (index: number) => {
  frequencyDelta[index] = Math.floor(3 + Math.random() * 5) * Math.sign(frequencyTarget[index] - frequency[index]);
};
export const addFrequency = (strength: number) => {
  const idx = Math.floor(Math.random() * frequency.length);
  frequencyTarget[idx] = clamp(frequencyTarget[idx] + strength, 0, 255);
  updateFrequencyDelta(idx);
}

export const drawFrequencySpectrum = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
  updateFrequency();
  Object.values(spectrums).forEach(spectrum => {
    spectrum.drawSpectrum(ctx, centerX, centerY);
  });
}

export const createSpectrum = (beforeDraw: (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => void, drawLine: (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, frequency: number, lineRate: number) => void) => {
  let currentLightness = 100;
  let currentOpacity = 1;
  let lineCounts = frequency.length;
  let hueOffset = 0;
  let hueDelta = 240;
  let isEnabled = true;

  const setLightness = (lightness: number)=> {
    currentLightness = clamp(lightness, 50, 100);
  }
  const setOpacity = (opacity: number)=> {
    currentOpacity = clamp(opacity, 0, 1);
  }
  const setHueDelta = (delta: number)=> {
    hueDelta = delta;
  }
  const setHueOffset = (offset: number)=> {
    hueOffset = offset;
  }
  const setHue = (offset: number, delta: number)=> {
    setHueOffset(offset);
    setHueDelta(delta);
  }
  const setLineCounts = (count: number)=> {
    lineCounts = clamp(count, 3, 39);
  }
  const setEnable = (enable: boolean)=> {
    isEnabled = enable;
  }
  const drawSpectrum = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if(!isEnabled) return;
    updateFrequency();
    beforeDraw(ctx, centerX, centerY);
    for (let i = 0; i < lineCounts; i++) {
      const freqValue = frequency[i] / 256 || 0;
      const lineRate = i / lineCounts;
      ctx.strokeStyle = `hsla(${hueOffset + (i / lineCounts) * hueDelta}, 100%, ${currentLightness}%, ${currentOpacity})`;
      drawLine(ctx, centerX, centerY, freqValue, lineRate);
    }
  }

  return {
    setLightness,
    setOpacity,
    setHueDelta,
    setHueOffset,
    setHue,
    setLineCounts,
    setEnable,
    drawSpectrum,
  };
};
export interface Spectrum {
  setLightness(lightness: number): void;
  setOpacity(opacity: number): void;
  setHueDelta(delta: number): void;
  setHueOffset(offset: number): void;
  setHue(offset: number, delta: number): void;
  setLineCounts(count: number): void;
  setEnable(enable: boolean): void;
  drawSpectrum(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void;
}


export * from "./circle-spectrum.ts";
export * from "./horizontal-spectrum.ts";
export * from "./vertical-spectrum.ts";
