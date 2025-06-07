import {drawFrequencySpectrum} from "./spectrum";
import {drawRipples} from "./ripple";

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

export const updateEffects = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    drawFrequencySpectrum(canvasContext, centerX, centerY);
    drawRipples(canvasContext);
}

// Export ripple functions for external use
export {addRipple} from "./ripple";
