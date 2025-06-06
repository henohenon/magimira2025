import { events } from "./events";

const canvas = document.getElementById('spectram-canvas') as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas not found");
}
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let frequency = new Uint8Array(39) as Uint8Array;
const frequencyTarget = new Uint8Array(frequency.length) as Uint8Array;
const frequencyDelta: number[] = new Array(frequency.length).fill(0);
console.log(frequency, frequencyTarget, frequencyDelta);

let currentLightness = 100;
let currentOpacity = 1;
let lineCounts = frequency.length;
let hueOffset = 0;
let hueDelta = 240;
let isEnabled = true;
let minRadiusRatio = 0.5;
let maxRadiusRatio = 200;

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

export const setLightness = (lightness: number)=> {
  currentLightness = clamp(lightness, 50, 100);
}

export const setOpacity = (opacity: number)=> {
  currentOpacity = clamp(opacity, 0, 1);
}

export const setHueDelta = (delta: number)=> {
  hueDelta = delta;
}

export const setHueOffset = (offset: number)=> {
  hueOffset = offset;
}

export const setHue = (offset: number, delta: number)=> {
  setHueOffset(offset);
  setHueDelta(delta);
}

export const setLineCounts = (count: number)=> {
  lineCounts = clamp(count, 3, 39);
}

export const setMinRadius = (minRadius: number)=> {
  minRadiusRatio = clamp(minRadius, 0, 5);
}

export const setMaxRadius = (maxRadius: number)=> {
  maxRadiusRatio = clamp(maxRadius, 0, Number.POSITIVE_INFINITY);
}

export const setRadius = (max: number, min: number)=> {
  setMaxRadius(max);
  setMinRadius(min);
}

export const setEnable = (enable: boolean)=> {
  isEnabled = enable;
  if (isEnabled && !animationFrameId) {
    startAnimation();
  } else if (!isEnabled && animationFrameId) {
    stopAnimation();
  }
}

function drawCircleSpectrum() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const minRadius = Math.min(centerX, centerY) * minRadiusRatio;

  canvasContext.lineWidth = 5;
  canvasContext.lineCap = 'round';

  for (let i = 0; i < lineCounts; i++) {
    const angle = (i / lineCounts) * Math.PI * 2;
    const value = frequency[i] || 0;

    const lineLength = (value / 255) * (maxRadiusRatio - minRadiusRatio);

    const startX = centerX + Math.cos(angle) * minRadius;
    const startY = centerY + Math.sin(angle) * minRadius;
    const endX = centerX + Math.cos(angle) * (minRadius + lineLength);
    const endY = centerY + Math.sin(angle) * (minRadius + lineLength);

    const hue = hueOffset + (i / lineCounts) * hueDelta;
    canvasContext.strokeStyle = `hsla(${hue}, 100%, ${currentLightness}%, ${currentOpacity})`;

    canvasContext.beginPath();
    canvasContext.moveTo(startX, startY);
    canvasContext.lineTo(endX, endY);
    canvasContext.stroke();
  }
}

let animationFrameId: number | null = null;
function startAnimation() {
  if (animationFrameId || !isEnabled) return;

  function animate() {
    updateFrequency();
    drawCircleSpectrum();
    if (isEnabled) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      animationFrameId = null;
    }
  }

  animate();
}
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

// Start animation when the game starts
events.on("onAppReady", () => {
  setEnable(true)
});
