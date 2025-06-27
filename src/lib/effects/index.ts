import {drawFrequencySpectrum} from "./spectrum";
import {drawRipples} from "./ripple";
import {drawGlitchEffects} from "./glitch";


const canvas = document.getElementById('effects-canvas') as HTMLCanvasElement;
if (!canvas) {
    console.error("Canvas not found!");
    throw new Error("Canvas not found");
}
console.log("Canvas found:", canvas);
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
console.log("Canvas context:", canvasContext);
console.log("Canvas size:", canvas.width, canvas.height);

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    console.log("Canvas resized to:", canvas.width, canvas.height);
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

export const updateEffects = (deltaTime: number) => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    drawFrequencySpectrum(canvasContext, deltaTime);
    drawRipples(canvasContext, deltaTime);
    drawGlitchEffects(canvasContext, deltaTime);
}
