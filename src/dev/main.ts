import { events as babylonEvents } from "../babylon/events";
import { playAnimation } from "../babylon/mdl";
import { switchCamera } from "../babylon/camera";
import { counter, counterInstance, spectrums } from "../main";
import {
    addFrequency,
    type CircleSpectrum,
    type HorizontalSpectrum,
    type VerticalSpectrum,
} from "../effects/spectrum";
import {createCircleRipple, createSquareRipple} from "../effects/ripple";

const circleSpectrum = spectrums["circle"] as CircleSpectrum;
const horizontalSpectrum = spectrums["horizontal"] as HorizontalSpectrum;
const verticalSpectrum = spectrums["vertical"] as VerticalSpectrum;

const animationList = document.getElementById("animationList");
if (!animationList) {
    throw new Error("Animation list not found");
}

babylonEvents.on("onMdlAnimLoaded", (animationNames) => {
    animationNames.map((name) => {
        const button = document.createElement("button");
        button.innerText = name;
        button.addEventListener("click", () => {
            playAnimation(name);
        });
        animationList.appendChild(button);
        return button;
    });
});

for(const id of ["default","front","side","top","free"]){
    const btn = document.getElementById(`camera-${id}`);
    if (!btn) {
        throw new Error(`Camera button ${id} not found`);
    }
    btn.addEventListener("click", () => switchCamera(id));
}

// Counter slider and input field setup
const counterSlider = document.getElementById("counter-slider") as HTMLInputElement;
const counterInput = document.getElementById("counter-input") as HTMLInputElement;

if (!counterSlider || !counterInput) {
    throw new Error("Counter controls not found");
}

counterSlider.addEventListener("input", () => {
    const value = parseInt(counterSlider.value);
    counterInput.value = value.toString();
    counterInstance.set(value);
});

counterInput.addEventListener("change", () => {
    const value = parseInt(counterInput.value);
    counterSlider.value = value.toString();
    counterInstance.set(value);
});

counter.subscribe((event) => {
    const count = event.count;
    counterSlider.value = count.toString();
    counterInput.value = count.toString();
    console.log("Counter updated:", count);
});

// Frequency Control
const spectrumAddFrequencyButton = document.getElementById("spectrum-add-frequency") as HTMLButtonElement;
if (!spectrumAddFrequencyButton) {
    throw new Error("Frequency control not found");
}

// Circle Spectrum Controls
const circleSpectrumEnableCheckbox = document.getElementById("circle-spectrum-enable") as HTMLInputElement;
const circleSpectrumLightnessSlider = document.getElementById("circle-spectrum-lightness") as HTMLInputElement;
const circleSpectrumLightnessInput = document.getElementById("circle-spectrum-lightness-input") as HTMLInputElement;
const circleSpectrumOpacitySlider = document.getElementById("circle-spectrum-opacity") as HTMLInputElement;
const circleSpectrumOpacityInput = document.getElementById("circle-spectrum-opacity-input") as HTMLInputElement;
const circleSpectrumHueOffsetSlider = document.getElementById("circle-spectrum-hue-offset") as HTMLInputElement;
const circleSpectrumHueOffsetInput = document.getElementById("circle-spectrum-hue-offset-input") as HTMLInputElement;
const circleSpectrumHueDeltaInput = document.getElementById("circle-spectrum-hue-delta") as HTMLInputElement;
const circleSpectrumLineCountInput = document.getElementById("circle-spectrum-line-count") as HTMLInputElement;
const circleSpectrumMinRadiusSlider = document.getElementById("circle-spectrum-min-radius") as HTMLInputElement;
const circleSpectrumMaxRadiusSlider = document.getElementById("circle-spectrum-max-radius") as HTMLInputElement;

if (!circleSpectrumEnableCheckbox || !circleSpectrumLightnessSlider || !circleSpectrumLightnessInput || 
    !circleSpectrumOpacitySlider || !circleSpectrumOpacityInput || !circleSpectrumHueOffsetSlider || 
    !circleSpectrumHueOffsetInput || !circleSpectrumHueDeltaInput || !circleSpectrumLineCountInput || 
    !circleSpectrumMinRadiusSlider || !circleSpectrumMaxRadiusSlider) {
    throw new Error("Circle spectrum controls not found");
}

// Horizontal Spectrum Controls
const horizontalSpectrumEnableCheckbox = document.getElementById("horizontal-spectrum-enable") as HTMLInputElement;
const horizontalSpectrumLightnessSlider = document.getElementById("horizontal-spectrum-lightness") as HTMLInputElement;
const horizontalSpectrumLightnessInput = document.getElementById("horizontal-spectrum-lightness-input") as HTMLInputElement;
const horizontalSpectrumOpacitySlider = document.getElementById("horizontal-spectrum-opacity") as HTMLInputElement;
const horizontalSpectrumOpacityInput = document.getElementById("horizontal-spectrum-opacity-input") as HTMLInputElement;
const horizontalSpectrumHueOffsetSlider = document.getElementById("horizontal-spectrum-hue-offset") as HTMLInputElement;
const horizontalSpectrumHueOffsetInput = document.getElementById("horizontal-spectrum-hue-offset-input") as HTMLInputElement;
const horizontalSpectrumHueDeltaInput = document.getElementById("horizontal-spectrum-hue-delta") as HTMLInputElement;
const horizontalSpectrumLineCountInput = document.getElementById("horizontal-spectrum-line-count") as HTMLInputElement;
const horizontalSpectrumHeightInput = document.getElementById("horizontal-spectrum-height") as HTMLInputElement;

if (!horizontalSpectrumEnableCheckbox || !horizontalSpectrumLightnessSlider || !horizontalSpectrumLightnessInput || 
    !horizontalSpectrumOpacitySlider || !horizontalSpectrumOpacityInput || !horizontalSpectrumHueOffsetSlider || 
    !horizontalSpectrumHueOffsetInput || !horizontalSpectrumHueDeltaInput || !horizontalSpectrumLineCountInput || 
    !horizontalSpectrumHeightInput) {
    throw new Error("Horizontal spectrum controls not found");
}

// Vertical Spectrum Controls
const verticalSpectrumEnableCheckbox = document.getElementById("vertical-spectrum-enable") as HTMLInputElement;
const verticalSpectrumLightnessSlider = document.getElementById("vertical-spectrum-lightness") as HTMLInputElement;
const verticalSpectrumLightnessInput = document.getElementById("vertical-spectrum-lightness-input") as HTMLInputElement;
const verticalSpectrumOpacitySlider = document.getElementById("vertical-spectrum-opacity") as HTMLInputElement;
const verticalSpectrumOpacityInput = document.getElementById("vertical-spectrum-opacity-input") as HTMLInputElement;
const verticalSpectrumHueOffsetSlider = document.getElementById("vertical-spectrum-hue-offset") as HTMLInputElement;
const verticalSpectrumHueOffsetInput = document.getElementById("vertical-spectrum-hue-offset-input") as HTMLInputElement;
const verticalSpectrumHueDeltaInput = document.getElementById("vertical-spectrum-hue-delta") as HTMLInputElement;
const verticalSpectrumLineCountInput = document.getElementById("vertical-spectrum-line-count") as HTMLInputElement;
const verticalSpectrumWidthInput = document.getElementById("vertical-spectrum-width") as HTMLInputElement;

if (!verticalSpectrumEnableCheckbox || !verticalSpectrumLightnessSlider || !verticalSpectrumLightnessInput || 
    !verticalSpectrumOpacitySlider || !verticalSpectrumOpacityInput || !verticalSpectrumHueOffsetSlider || 
    !verticalSpectrumHueOffsetInput || !verticalSpectrumHueDeltaInput || !verticalSpectrumLineCountInput || 
    !verticalSpectrumWidthInput) {
    throw new Error("Vertical spectrum controls not found");
}

// Initialize circle spectrum with default values
circleSpectrum.setEnable(circleSpectrumEnableCheckbox.checked);
circleSpectrum.setLightness(parseInt(circleSpectrumLightnessSlider.value));
circleSpectrumLightnessInput.value = circleSpectrumLightnessSlider.value;
circleSpectrum.setOpacity(parseInt(circleSpectrumOpacitySlider.value) / 100);
circleSpectrumOpacityInput.value = circleSpectrumOpacitySlider.value;
circleSpectrum.setHueOffset(parseInt(circleSpectrumHueOffsetSlider.value));
circleSpectrumHueOffsetInput.value = circleSpectrumHueOffsetSlider.value;
circleSpectrum.setHueDelta(parseInt(circleSpectrumHueDeltaInput.value));
circleSpectrum.setLineCounts(parseInt(circleSpectrumLineCountInput.value));
circleSpectrum.setMinRadius(parseFloat(circleSpectrumMinRadiusSlider.value));
circleSpectrum.setMaxRadius(parseFloat(circleSpectrumMaxRadiusSlider.value));

// Initialize horizontal spectrum with default values
horizontalSpectrum.setEnable(horizontalSpectrumEnableCheckbox.checked);
horizontalSpectrum.setLightness(parseInt(horizontalSpectrumLightnessSlider.value));
horizontalSpectrumLightnessInput.value = horizontalSpectrumLightnessSlider.value;
horizontalSpectrum.setOpacity(parseInt(horizontalSpectrumOpacitySlider.value) / 100);
horizontalSpectrumOpacityInput.value = horizontalSpectrumOpacitySlider.value;
horizontalSpectrum.setHueOffset(parseInt(horizontalSpectrumHueOffsetSlider.value));
horizontalSpectrumHueOffsetInput.value = horizontalSpectrumHueOffsetSlider.value;
horizontalSpectrum.setHueDelta(parseInt(horizontalSpectrumHueDeltaInput.value));
horizontalSpectrum.setLineCounts(parseInt(horizontalSpectrumLineCountInput.value));
horizontalSpectrum.setHeight(parseInt(horizontalSpectrumHeightInput.value));

// Initialize vertical spectrum with default values
verticalSpectrum.setEnable(verticalSpectrumEnableCheckbox.checked);
verticalSpectrum.setLightness(parseInt(verticalSpectrumLightnessSlider.value));
verticalSpectrumLightnessInput.value = verticalSpectrumLightnessSlider.value;
verticalSpectrum.setOpacity(parseInt(verticalSpectrumOpacitySlider.value) / 100);
verticalSpectrumOpacityInput.value = verticalSpectrumOpacitySlider.value;
verticalSpectrum.setHueOffset(parseInt(verticalSpectrumHueOffsetSlider.value));
verticalSpectrumHueOffsetInput.value = verticalSpectrumHueOffsetSlider.value;
verticalSpectrum.setHueDelta(parseInt(verticalSpectrumHueDeltaInput.value));
verticalSpectrum.setLineCounts(parseInt(verticalSpectrumLineCountInput.value));
verticalSpectrum.setWidth(parseInt(verticalSpectrumWidthInput.value));

// Add event listeners for circle spectrum controls
circleSpectrumEnableCheckbox.addEventListener("change", () => {
    circleSpectrum.setEnable(circleSpectrumEnableCheckbox.checked);
});

circleSpectrumLightnessSlider.addEventListener("input", () => {
    const value = parseFloat(circleSpectrumLightnessSlider.value);
    circleSpectrumLightnessInput.value = value.toString();
    circleSpectrum.setLightness(value);
});

circleSpectrumLightnessInput.addEventListener("change", () => {
    const value = parseInt(circleSpectrumLightnessInput.value);
    circleSpectrumLightnessSlider.value = value.toString();
    circleSpectrum.setLightness(value);
});

circleSpectrumOpacitySlider.addEventListener("input", () => {
    const value = parseFloat(circleSpectrumOpacitySlider.value);
    circleSpectrumOpacityInput.value = value.toString();
    circleSpectrum.setOpacity(value / 100);
});

circleSpectrumOpacityInput.addEventListener("change", () => {
    const value = parseInt(circleSpectrumOpacityInput.value);
    circleSpectrumOpacitySlider.value = value.toString();
    circleSpectrum.setOpacity(value / 100);
});

circleSpectrumHueOffsetSlider.addEventListener("input", () => {
    const value = parseFloat(circleSpectrumHueOffsetSlider.value);
    circleSpectrumHueOffsetInput.value = value.toString();
    circleSpectrum.setHueOffset(value);
});

circleSpectrumHueOffsetInput.addEventListener("change", () => {
    const value = parseInt(circleSpectrumHueOffsetInput.value);
    circleSpectrumHueOffsetSlider.value = value.toString();
    circleSpectrum.setHueOffset(value);
});

circleSpectrumHueDeltaInput.addEventListener("change", () => {
    circleSpectrum.setHueDelta(parseFloat(circleSpectrumHueDeltaInput.value));
});

circleSpectrumLineCountInput.addEventListener("change", () => {
    circleSpectrum.setLineCounts(parseInt(circleSpectrumLineCountInput.value));
});

circleSpectrumMinRadiusSlider.addEventListener("change", () => {
    circleSpectrum.setMinRadius(parseFloat(circleSpectrumMinRadiusSlider.value));
});

circleSpectrumMaxRadiusSlider.addEventListener("change", () => {
    circleSpectrum.setMaxRadius(parseFloat(circleSpectrumMaxRadiusSlider.value));
});

// Add event listeners for horizontal spectrum controls
horizontalSpectrumEnableCheckbox.addEventListener("change", () => {
    horizontalSpectrum.setEnable(horizontalSpectrumEnableCheckbox.checked);
});

horizontalSpectrumLightnessSlider.addEventListener("input", () => {
    const value = parseFloat(horizontalSpectrumLightnessSlider.value);
    horizontalSpectrumLightnessInput.value = value.toString();
    horizontalSpectrum.setLightness(value);
});

horizontalSpectrumLightnessInput.addEventListener("change", () => {
    const value = parseInt(horizontalSpectrumLightnessInput.value);
    horizontalSpectrumLightnessSlider.value = value.toString();
    horizontalSpectrum.setLightness(value);
});

horizontalSpectrumOpacitySlider.addEventListener("input", () => {
    const value = parseFloat(horizontalSpectrumOpacitySlider.value);
    horizontalSpectrumOpacityInput.value = value.toString();
    horizontalSpectrum.setOpacity(value / 100);
});

horizontalSpectrumOpacityInput.addEventListener("change", () => {
    const value = parseInt(horizontalSpectrumOpacityInput.value);
    horizontalSpectrumOpacitySlider.value = value.toString();
    horizontalSpectrum.setOpacity(value / 100);
});

horizontalSpectrumHueOffsetSlider.addEventListener("input", () => {
    const value = parseFloat(horizontalSpectrumHueOffsetSlider.value);
    horizontalSpectrumHueOffsetInput.value = value.toString();
    horizontalSpectrum.setHueOffset(value);
});

horizontalSpectrumHueOffsetInput.addEventListener("change", () => {
    const value = parseInt(horizontalSpectrumHueOffsetInput.value);
    horizontalSpectrumHueOffsetSlider.value = value.toString();
    horizontalSpectrum.setHueOffset(value);
});

horizontalSpectrumHueDeltaInput.addEventListener("change", () => {
    horizontalSpectrum.setHueDelta(parseFloat(horizontalSpectrumHueDeltaInput.value));
});

horizontalSpectrumLineCountInput.addEventListener("change", () => {
    horizontalSpectrum.setLineCounts(parseInt(horizontalSpectrumLineCountInput.value));
});

horizontalSpectrumHeightInput.addEventListener("change", () => {
    horizontalSpectrum.setHeight(parseFloat(horizontalSpectrumHeightInput.value));
});

// Add event listeners for vertical spectrum controls
verticalSpectrumEnableCheckbox.addEventListener("change", () => {
    verticalSpectrum.setEnable(verticalSpectrumEnableCheckbox.checked);
});

verticalSpectrumLightnessSlider.addEventListener("input", () => {
    const value = parseFloat(verticalSpectrumLightnessSlider.value);
    verticalSpectrumLightnessInput.value = value.toString();
    verticalSpectrum.setLightness(value);
});

verticalSpectrumLightnessInput.addEventListener("change", () => {
    const value = parseInt(verticalSpectrumLightnessInput.value);
    verticalSpectrumLightnessSlider.value = value.toString();
    verticalSpectrum.setLightness(value);
});

verticalSpectrumOpacitySlider.addEventListener("input", () => {
    const value = parseFloat(verticalSpectrumOpacitySlider.value);
    verticalSpectrumOpacityInput.value = value.toString();
    verticalSpectrum.setOpacity(value / 100);
});

verticalSpectrumOpacityInput.addEventListener("change", () => {
    const value = parseInt(verticalSpectrumOpacityInput.value);
    verticalSpectrumOpacitySlider.value = value.toString();
    verticalSpectrum.setOpacity(value / 100);
});

verticalSpectrumHueOffsetSlider.addEventListener("input", () => {
    const value = parseFloat(verticalSpectrumHueOffsetSlider.value);
    verticalSpectrumHueOffsetInput.value = value.toString();
    verticalSpectrum.setHueOffset(value);
});

verticalSpectrumHueOffsetInput.addEventListener("change", () => {
    const value = parseInt(verticalSpectrumHueOffsetInput.value);
    verticalSpectrumHueOffsetSlider.value = value.toString();
    verticalSpectrum.setHueOffset(value);
});

verticalSpectrumHueDeltaInput.addEventListener("change", () => {
    verticalSpectrum.setHueDelta(parseFloat(verticalSpectrumHueDeltaInput.value));
});

verticalSpectrumLineCountInput.addEventListener("change", () => {
    verticalSpectrum.setLineCounts(parseInt(verticalSpectrumLineCountInput.value));
});

verticalSpectrumWidthInput.addEventListener("change", () => {
    verticalSpectrum.setWidth(parseFloat(verticalSpectrumWidthInput.value));
});

spectrumAddFrequencyButton.addEventListener("click", () => {
    // Add a random frequency with strength 50-200
    const strength = 50 + Math.floor(Math.random() * 150);
    addFrequency(strength);
});

// Circle Ripple Controls
const addCircleRippleButton = document.getElementById("add-circle-ripple") as HTMLButtonElement;
const circleRipplePositionXInput = document.getElementById("circle-ripple-position-x") as HTMLInputElement;
const circleRipplePositionYInput = document.getElementById("circle-ripple-position-y") as HTMLInputElement;
const circleRippleStrengthInput = document.getElementById("circle-ripple-strength") as HTMLInputElement;
const circleRippleMaxRadiusInput = document.getElementById("circle-ripple-max-radius") as HTMLInputElement;
const circleRippleGrowthSpeedInput = document.getElementById("circle-ripple-growth-speed") as HTMLInputElement;
const circleRippleFadeSpeedInput = document.getElementById("circle-ripple-fade-speed") as HTMLInputElement;
const circleRippleLineWidthInput = document.getElementById("circle-ripple-line-width") as HTMLInputElement;

// Square Ripple Controls
const addSquareRippleButton = document.getElementById("add-square-ripple") as HTMLButtonElement;
const squareRipplePositionXInput = document.getElementById("square-ripple-position-x") as HTMLInputElement;
const squareRipplePositionYInput = document.getElementById("square-ripple-position-y") as HTMLInputElement;
const squareRippleStrengthInput = document.getElementById("square-ripple-strength") as HTMLInputElement;
const squareRippleMaxSizeInput = document.getElementById("square-ripple-max-size") as HTMLInputElement;
const squareRippleGrowthSpeedInput = document.getElementById("square-ripple-growth-speed") as HTMLInputElement;
const squareRippleFadeSpeedInput = document.getElementById("square-ripple-fade-speed") as HTMLInputElement;
const squareRippleLineWidthInput = document.getElementById("square-ripple-line-width") as HTMLInputElement;

if (!addCircleRippleButton || !circleRipplePositionXInput || !circleRipplePositionYInput || !circleRippleStrengthInput ||
    !circleRippleMaxRadiusInput || !circleRippleGrowthSpeedInput || !circleRippleFadeSpeedInput || !circleRippleLineWidthInput ||
    !addSquareRippleButton || !squareRipplePositionXInput || !squareRipplePositionYInput || !squareRippleStrengthInput ||
    !squareRippleMaxSizeInput || !squareRippleGrowthSpeedInput || !squareRippleFadeSpeedInput || !squareRippleLineWidthInput) {
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
    const strength = parseFloat(circleRippleStrengthInput.value);
    const ripple = createCircleRipple(x, y, strength);

    if ('setMaxRadius' in ripple) {
        ripple.setMaxRadius(parseFloat(circleRippleMaxRadiusInput.value));
        ripple.setGrowthSpeed(parseFloat(circleRippleGrowthSpeedInput.value));
        ripple.setFadeSpeed(parseFloat(circleRippleFadeSpeedInput.value));
        ripple.setLineWidth(parseFloat(circleRippleLineWidthInput.value));
    }
});

// Square Ripple Event Listener
addSquareRippleButton.addEventListener("click", () => {
    const x = parseInt(squareRipplePositionXInput.value);
    const y = parseInt(squareRipplePositionYInput.value);
    const strength = parseFloat(squareRippleStrengthInput.value);
    const ripple = createSquareRipple(x, y, strength);

    if ('setMaxSize' in ripple) {
        ripple.setMaxSize(parseFloat(squareRippleMaxSizeInput.value));
        ripple.setGrowthSpeed(parseFloat(squareRippleGrowthSpeedInput.value));
        ripple.setFadeSpeed(parseFloat(squareRippleFadeSpeedInput.value));
        ripple.setLineWidth(parseFloat(squareRippleLineWidthInput.value));
    }
});
