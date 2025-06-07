import { spectrums } from "../";
import {
    addFrequency,
    type CircleSpectrum,
    type HorizontalSpectrum,
    type VerticalSpectrum,
} from "../effects/spectrum";

const circleSpectrum = spectrums["circle"] as CircleSpectrum;
const horizontalSpectrum = spectrums["horizontal"] as HorizontalSpectrum;
const verticalSpectrum = spectrums["vertical"] as VerticalSpectrum;

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