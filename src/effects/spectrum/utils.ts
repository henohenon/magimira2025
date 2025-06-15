import {clamp} from "~/util.ts";

export interface Spectrum {
  setColor(color: string): void;
  setOpacity(opacity: number): void;
  setHueOffset(offset: number): void;
  setLineCounts(count: number): void;
  setEnable(enable: boolean): void;
  addFrequency(strength: number, index: number): void;
  addFrequencyByRate(rate: number, strength: number, range?: number): void;
  drawSpectrum(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, deltaTime: number): void;
}

export const createSpectrum = (beforeDraw: (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => void, drawLine: (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, frequency: number, lineRate: number) => void) => {
  let currentColor = '#ffffff';
  let currentHue = 0;
  let currentSaturation = 0;
  let currentLightness = 1;
  let hueOffset = 240;
  let currentOpacity = 1;
  let lineCounts = 40; // Use a default value that matches the frequency array length
  let isEnabled = true;
  const constantSpeed = 100;
  const diffSpeedRate = 2;

  // Each spectrum has its own frequency data
  const lineMaxCounts = 40;
  const frequency = new Uint8Array(lineMaxCounts);
  const frequencyTarget = new Uint8Array(frequency.length);

  const updateFrequency = (deltaTime: number) => {
    for (let i = 0; i < frequency.length; i++) {
      const current = frequency[i];
      const target = frequencyTarget[i];

      if (current === target) continue;

      let speed: number;

      const diff = target - current;
      const absDiff = Math.abs(diff);
      if (target === 0) {
        // If the target is 0, the frequency should stop immediately
        speed = constantSpeed;
      } else {
        // If the target is not 0, the frequency should slow down and speed up
        const speedMultiplier = 1 + (absDiff / 255 * diffSpeedRate);
        speed = constantSpeed * speedMultiplier * (diff > 0 ? 1 : -1);
      }
      // Limit the speed to the difference between the current and target
      speed *= deltaTime;
      if (absDiff < Math.abs(speed)) {
        speed = diff;
      }

      // Update the frequency
      frequency[i] = clamp(current + speed, 0, 255);
    }
  };

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
  const addFrequency = (strength: number, index: number) => {
    frequencyTarget[index] = clamp(frequencyTarget[index] + strength, 0, 100) * 255;
  }
  const addFrequencyByRate = (rate: number, strength: number, range: number = 0) => {
    const index = Math.round(rate * (lineCounts - 1));
    // Set frequency for the main index
    addFrequency(strength, index);

    // Set frequency for the range of lines around the index
    for (let i = 1; i <= range; i++) {
      // Set frequency for lines before the index
      if (index - i >= 0) {
        addFrequency(strength, index - i);
      }

      // Set frequency for lines after the index
      if (index + i < lineCounts) {
        addFrequency(strength, index + i);
      }
    }
  }
  const drawSpectrum = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, deltaTime: number) => {
    if(!isEnabled) return;

    // Update frequency values
    updateFrequency(deltaTime);

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
    addFrequency,
    addFrequencyByRate,
    drawSpectrum,
  };
};

// The drawFrequencySpectrum function now just calls drawSpectrum on each spectrum
// Each spectrum manages its own frequency data
export const drawFrequencySpectrum = (ctx: CanvasRenderingContext2D, deltaTime: number) => {
  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;
  for (const spectrum of Object.values(spectrums)) {
    spectrum.drawSpectrum(ctx, centerX, centerY, deltaTime);
  }
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

// This will be imported by index.ts
export const spectrums: Record<string, Spectrum> = {};
