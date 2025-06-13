import "./dom/bottom-lyrics.ts";

import {drawFrequencySpectrum} from "./spectrum";
import {drawRipples} from "./ripple";

const canvas = document.getElementById('effects-canvas') as HTMLCanvasElement;
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

export const updateEffects = (deltaTime: number) => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    drawFrequencySpectrum(canvasContext, deltaTime);
    drawRipples(canvasContext, deltaTime);
}
