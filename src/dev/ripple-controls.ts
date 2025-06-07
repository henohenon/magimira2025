import {createCircleRipple, createSquareRipple} from "../effects/ripple";

// Circle Ripple Controls
const addCircleRippleButton = document.getElementById("add-circle-ripple") as HTMLButtonElement;
const circleRipplePositionXInput = document.getElementById("circle-ripple-position-x") as HTMLInputElement;
const circleRipplePositionYInput = document.getElementById("circle-ripple-position-y") as HTMLInputElement;
const circleRippleLifetimeInput = document.getElementById("circle-ripple-lifetime") as HTMLInputElement;
const circleRippleRadiusDeltaInput = document.getElementById("circle-ripple-radius-delta") as HTMLInputElement;
const circleRippleDefaultRadiusInput = document.getElementById("circle-ripple-default-radius") as HTMLInputElement;
const circleRippleOpacityDeltaInput = document.getElementById("circle-ripple-opacity-delta") as HTMLInputElement;
const circleRippleDefaultOpacityInput = document.getElementById("circle-ripple-default-opacity") as HTMLInputElement;
const circleRippleHueInput = document.getElementById("circle-ripple-hue") as HTMLInputElement;

// Square Ripple Controls
const addSquareRippleButton = document.getElementById("add-square-ripple") as HTMLButtonElement;
const squareRipplePositionXInput = document.getElementById("square-ripple-position-x") as HTMLInputElement;
const squareRipplePositionYInput = document.getElementById("square-ripple-position-y") as HTMLInputElement;
const squareRippleLifetimeInput = document.getElementById("square-ripple-lifetime") as HTMLInputElement;
const squareRippleSizeDeltaInput = document.getElementById("square-ripple-size-delta") as HTMLInputElement;
const squareRippleDefaultSizeInput = document.getElementById("square-ripple-default-size") as HTMLInputElement;
const squareRippleOpacityDeltaInput = document.getElementById("square-ripple-opacity-delta") as HTMLInputElement;
const squareRippleDefaultOpacityInput = document.getElementById("square-ripple-default-opacity") as HTMLInputElement;
const squareRippleHueInput = document.getElementById("square-ripple-hue") as HTMLInputElement;
const squareRippleAngleInput = document.getElementById("square-ripple-angle") as HTMLInputElement;

if (!addCircleRippleButton || !circleRipplePositionXInput || !circleRipplePositionYInput ||
    !circleRippleLifetimeInput || !circleRippleRadiusDeltaInput || !circleRippleDefaultRadiusInput ||
    !circleRippleOpacityDeltaInput || !circleRippleDefaultOpacityInput || !circleRippleHueInput ||
    !addSquareRippleButton || !squareRipplePositionXInput || !squareRipplePositionYInput ||
    !squareRippleLifetimeInput || !squareRippleSizeDeltaInput || !squareRippleDefaultSizeInput ||
    !squareRippleOpacityDeltaInput || !squareRippleDefaultOpacityInput || !squareRippleHueInput ||
    !squareRippleAngleInput) {
    throw new Error("Ripple controls not found");
}

// Set default positions to center of screen
circleRipplePositionXInput.value = (window.innerWidth / 2).toString();
circleRipplePositionYInput.value = (window.innerHeight / 2).toString();
squareRipplePositionXInput.value = (window.innerWidth / 2).toString();
squareRipplePositionYInput.value = (window.innerHeight / 2).toString();

// Circle Ripple Event Listener
addCircleRippleButton.addEventListener("click", () => {
    const x = parseInt(circleRipplePositionXInput.value);
    const y = parseInt(circleRipplePositionYInput.value);
    const lifeTime = parseInt(circleRippleLifetimeInput.value);
    const radiusDelta = parseFloat(circleRippleRadiusDeltaInput.value);
    const defaultRadius = parseFloat(circleRippleDefaultRadiusInput.value);
    const opacityDelta = parseFloat(circleRippleOpacityDeltaInput.value);
    const defaultOpacity = parseFloat(circleRippleDefaultOpacityInput.value);
    const hue = parseFloat(circleRippleHueInput.value);

    createCircleRipple(x, y, {
        lifeTime: lifeTime,
        radiusDelta: radiusDelta,
        defaultRadius: defaultRadius,
        opacityDelta: opacityDelta,
        defaultOpacity: defaultOpacity,
        hue: hue
    });
});

// Square Ripple Event Listener
addSquareRippleButton.addEventListener("click", () => {
    const x = parseInt(squareRipplePositionXInput.value);
    const y = parseInt(squareRipplePositionYInput.value);
    const lifeTime = parseInt(squareRippleLifetimeInput.value);
    const sizeDelta = parseFloat(squareRippleSizeDeltaInput.value);
    const defaultSize = parseFloat(squareRippleDefaultSizeInput.value);
    const opacityDelta = parseFloat(squareRippleOpacityDeltaInput.value);
    const defaultOpacity = parseFloat(squareRippleDefaultOpacityInput.value);
    const hue = parseFloat(squareRippleHueInput.value);
    const angleDegrees = parseFloat(squareRippleAngleInput.value);

    createSquareRipple(x, y, {
        lifeTime: lifeTime,
        sizeDelta: sizeDelta,
        defaultSize: defaultSize,
        opacityDelta: opacityDelta,
        defaultOpacity: defaultOpacity,
        hue: hue,
        angle: angleDegrees * Math.PI / 180 // Convert degrees to radians
    });
});