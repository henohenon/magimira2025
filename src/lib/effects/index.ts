import {drawFrequencySpectrum} from "./spectrum";
import {drawRipples} from "./ripple";
import {drawGlitchEffects} from "./glitch";


const canvas = document.getElementById('effects-canvas') as HTMLCanvasElement;
const inputArea = document.getElementById('input-area') as HTMLElement;
if (!canvas || !inputArea) throw new Error("Canvas not found");
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

const resizeCanvas = () => {
    canvas.width = inputArea.clientWidth;
    canvas.height = inputArea.clientHeight;
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

export const updateEffects = (deltaTime: number) => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    drawFrequencySpectrum(canvasContext, deltaTime);
    drawRipples(canvasContext, deltaTime);
    drawGlitchEffects(canvasContext, deltaTime);
}
