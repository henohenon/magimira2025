import { events as babylonEvents } from "../babylon/events";
import { playAnimation } from "../babylon/mdl";
import { switchCamera } from "../babylon/camera";
import { counter, counterInstance } from "../main";
import { 
    addFrequency, 
    setLightness, 
    setOpacity, 
    setHueOffset, 
    setHueDelta, 
    setLineCounts, 
    setEnable,
    setMinRadius,
    setMaxRadius,
} from "../text-alive/circle-spectrum";

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

// Circle Spectrum Controls
const spectrumEnableCheckbox = document.getElementById("spectrum-enable") as HTMLInputElement;
const spectrumLightnessSlider = document.getElementById("spectrum-lightness") as HTMLInputElement;
const spectrumLightnessInput = document.getElementById("spectrum-lightness-input") as HTMLInputElement;
const spectrumOpacitySlider = document.getElementById("spectrum-opacity") as HTMLInputElement;
const spectrumOpacityInput = document.getElementById("spectrum-opacity-input") as HTMLInputElement;
const spectrumHueOffsetSlider = document.getElementById("spectrum-hue-offset") as HTMLInputElement;
const spectrumHueOffsetInput = document.getElementById("spectrum-hue-offset-input") as HTMLInputElement;
const spectrumHueDeltaInput = document.getElementById("spectrum-hue-delta") as HTMLInputElement;
const spectrumLineCountInput = document.getElementById("spectrum-line-count") as HTMLInputElement;
const spectrumMinRadiusSlider = document.getElementById("spectrum-min-radius") as HTMLInputElement;
const spectrumMaxRadiusSlider = document.getElementById("spectrum-max-radius") as HTMLInputElement;
const spectrumAddFrequencyButton = document.getElementById("spectrum-add-frequency") as HTMLButtonElement;

if (!spectrumEnableCheckbox || !spectrumLightnessSlider || !spectrumLightnessInput || 
    !spectrumOpacitySlider || !spectrumOpacityInput || !spectrumHueOffsetSlider || 
    !spectrumHueOffsetInput || !spectrumHueDeltaInput || !spectrumLineCountInput || 
    !spectrumMinRadiusSlider || !spectrumMaxRadiusSlider || !spectrumAddFrequencyButton) {
    throw new Error("Circle spectrum controls not found");
}

// Initialize circle spectrum with default values
setEnable(spectrumEnableCheckbox.checked);
setLightness(parseInt(spectrumLightnessSlider.value));
spectrumLightnessInput.value = spectrumLightnessSlider.value;
setOpacity(parseInt(spectrumOpacitySlider.value) / 100);
spectrumOpacityInput.value = spectrumOpacitySlider.value;
setHueOffset(parseInt(spectrumHueOffsetSlider.value));
spectrumHueOffsetInput.value = spectrumHueOffsetSlider.value;
setHueDelta(parseInt(spectrumHueDeltaInput.value));
setLineCounts(parseInt(spectrumLineCountInput.value));
setMinRadius(parseFloat(spectrumMinRadiusSlider.value));
setMaxRadius(parseFloat(spectrumMaxRadiusSlider.value));

// Add event listeners for circle spectrum controls
spectrumEnableCheckbox.addEventListener("change", () => {
    setEnable(spectrumEnableCheckbox.checked);
});

spectrumLightnessSlider.addEventListener("input", () => {
    const value = parseFloat(spectrumLightnessSlider.value);
    spectrumLightnessInput.value = value.toString();
    setLightness(value);
});

spectrumOpacitySlider.addEventListener("input", () => {
    const value = parseFloat(spectrumOpacitySlider.value);
    spectrumOpacityInput.value = value.toString();
    setOpacity(value / 100);
});

spectrumHueOffsetSlider.addEventListener("input", () => {
    const value = parseFloat(spectrumHueOffsetSlider.value);
    spectrumHueOffsetInput.value = value.toString();
    setHueOffset(value);
});

spectrumHueDeltaInput.addEventListener("change", () => {
    setHueDelta(parseFloat(spectrumHueDeltaInput.value));
});

spectrumLineCountInput.addEventListener("change", () => {
    setLineCounts(parseInt(spectrumLineCountInput.value));
});

spectrumMinRadiusSlider.addEventListener("change", () => {
    setMinRadius(parseFloat(spectrumMinRadiusSlider.value));
});

spectrumMaxRadiusSlider.addEventListener("change", () => {
    setMaxRadius(parseFloat(spectrumMaxRadiusSlider.value));
});

// Add event listeners for the new input fields
spectrumLightnessInput.addEventListener("change", () => {
    const value = parseInt(spectrumLightnessInput.value);
    spectrumLightnessSlider.value = value.toString();
    setLightness(value);
});

spectrumOpacityInput.addEventListener("change", () => {
    const value = parseInt(spectrumOpacityInput.value);
    spectrumOpacitySlider.value = value.toString();
    setOpacity(value / 100);
});

spectrumHueOffsetInput.addEventListener("change", () => {
    const value = parseInt(spectrumHueOffsetInput.value);
    spectrumHueOffsetSlider.value = value.toString();
    setHueOffset(value);
});

spectrumAddFrequencyButton.addEventListener("click", () => {
    // Add a random frequency with strength 50-200
    const strength = 50 + Math.floor(Math.random() * 150);
    addFrequency(strength);
});
