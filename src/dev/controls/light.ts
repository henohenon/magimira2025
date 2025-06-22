import {
    addLightDirection,
    addLightPosition,
    getHemisphericGroundColor,
    getLightDiffuse,
    getLightDirection,
    getLightEnabled,
    getLightIntensity,
    getLightPosition,
    getPointLightRange,
    resetHemispheric,
    resetPoint,
    resetSpot,
    setHemisphericGroundColor,
    setLightDiffuse,
    setLightDirection,
    setLightEnabled,
    setLightIntensity,
    setLightPosition,
    setPointLightRange
} from "~/lib/babylon/light.ts";
import {setLightingPreset, switchLight} from "~/game/light.ts";

import type {ToggleSwitch} from "../web-components/toggle-switch.ts";
import type {ColorPicker} from "../web-components/color-picker.ts";
import type {NumberInput} from "../web-components/number-input.ts";
import type {TripleInput} from "../web-components/triple-input.ts";
import {Color3} from "@babylonjs/core/Maths/math.color";

const spotLightEnable = document.getElementById("spot-light-enable") as ToggleSwitch;
const spotLightDiffuse = document.getElementById("spot-light-diffuse") as ColorPicker;
const spotLightIntensity = document.getElementById("spot-light-intensity") as NumberInput;
const spotLightAddPositionInput = document.getElementById("spot-light-add-position-input") as TripleInput;
const spotLightAddPositionButton = document.getElementById("spot-light-add-position-button") as HTMLButtonElement;
const spotLightSetPositionInput = document.getElementById("spot-light-set-position-input") as TripleInput;
const pointLightEnable = document.getElementById("point-light-enable") as ToggleSwitch;
const pointLightDiffuse = document.getElementById("point-light-diffuse") as ColorPicker;
const pointLightIntensity = document.getElementById("point-light-intensity") as NumberInput;
const pointLightRange = document.getElementById("point-light-range") as NumberInput;
const pointLightAddPositionInput = document.getElementById("point-light-add-position-input") as TripleInput;
const pointLightAddPositionButton = document.getElementById("point-light-add-position-button") as HTMLButtonElement;
const pointLightSetPositionInput = document.getElementById("point-light-set-position-input") as TripleInput;

const hemisphericLightEnable = document.getElementById("hemispheric-light-enable") as ToggleSwitch;
const hemisphericLightDiffuse = document.getElementById("hemispheric-light-diffuse") as ColorPicker;
const hemisphericLightGroundColor = document.getElementById("hemispheric-light-ground-color") as ColorPicker;
const hemisphericLightIntensity = document.getElementById("hemispheric-light-intensity") as NumberInput;
const hemisphericLightAddDirectionInput = document.getElementById("hemispheric-light-add-direction-input") as TripleInput;
const hemisphericLightAddDirectionButton = document.getElementById("hemispheric-light-add-direction-button") as HTMLButtonElement;
const hemisphericLightSetDirectionInput = document.getElementById("hemispheric-light-set-direction-input") as TripleInput;

const presetDefault = document.getElementById("preset-default") as HTMLButtonElement;
const presetPoint = document.getElementById("preset-point") as HTMLButtonElement;
const presetSpot = document.getElementById("preset-spot") as HTMLButtonElement;
const presetHemispheric = document.getElementById("preset-hemispheric") as HTMLButtonElement;
const presetDay = document.getElementById("preset-day") as HTMLButtonElement;
const presetNight = document.getElementById("preset-night") as HTMLButtonElement;
const presetSunset = document.getElementById("preset-sunset") as HTMLButtonElement;
const presetDawn = document.getElementById("preset-dawn") as HTMLButtonElement;

if (!spotLightEnable || !pointLightEnable || !hemisphericLightEnable ||
    !spotLightDiffuse || !pointLightDiffuse || !hemisphericLightDiffuse ||
    !hemisphericLightGroundColor ||
    !spotLightIntensity || !pointLightIntensity || !hemisphericLightIntensity ||
    !pointLightRange ||
    !spotLightAddPositionInput || !pointLightAddPositionInput || !hemisphericLightAddDirectionInput ||
    !spotLightAddPositionButton || !pointLightAddPositionButton || !hemisphericLightAddDirectionButton ||
    !spotLightSetPositionInput || !pointLightSetPositionInput || !hemisphericLightSetDirectionInput ||
    !presetDefault || !presetPoint || !presetSpot || !presetHemispheric || 
    !presetDay || !presetNight || !presetSunset || !presetDawn){
    console.error("Missing DOM elements",
        spotLightEnable, pointLightEnable, hemisphericLightEnable,
        spotLightDiffuse, pointLightDiffuse, hemisphericLightDiffuse,
        hemisphericLightGroundColor,
        spotLightIntensity, pointLightIntensity, hemisphericLightIntensity,
        pointLightRange,
        spotLightAddPositionInput, pointLightAddPositionInput, hemisphericLightAddDirectionInput,
        spotLightAddPositionButton, pointLightAddPositionButton, hemisphericLightAddDirectionButton,
        spotLightSetPositionInput, pointLightSetPositionInput, hemisphericLightSetDirectionInput,
        presetDefault, presetPoint, presetSpot, presetHemispheric, presetDay, presetNight, presetSunset, presetDawn,
        );
    throw new Error("Missing DOM elements");
}

spotLightEnable.subscribe(toggle => {
    setLightEnabled("spot", toggle);
});
pointLightEnable.subscribe(toggle => {
    setLightEnabled("point", toggle);
});
hemisphericLightEnable.subscribe(toggle => {
    setLightEnabled("hemispheric", toggle);
});

spotLightDiffuse.subscribe(color => {
    if (!color) return;
    const color3 = Color3.FromHexString(color);
    if (!color3) return;
    setLightDiffuse("spot", color3);
});
pointLightDiffuse.subscribe(color => {
    if (!color) return;
    const color3 = Color3.FromHexString(color);
    if (!color3) return;
    setLightDiffuse("point", color3);
});
hemisphericLightDiffuse.subscribe(color => {
    if (!color) return;
    const color3 = Color3.FromHexString(color);
    if (!color3) return;
    setLightDiffuse("hemispheric", color3);
});
hemisphericLightGroundColor.subscribe(color => {
    if (!color) return;
    const color3 = Color3.FromHexString(color);
    if (!color3) return;
    setHemisphericGroundColor(color3);
});

spotLightIntensity.subscribe(value => {
    setLightIntensity("spot", value);
});
pointLightIntensity.subscribe(value => {
    setLightIntensity("point", value);
});
pointLightRange.subscribe(value => {
    setPointLightRange(value);
});
hemisphericLightIntensity.subscribe(value => {
    setLightIntensity("hemispheric", value);
});

spotLightAddPositionButton.addEventListener("click", () => {
    addLightPosition("spot", spotLightAddPositionInput.value1, spotLightAddPositionInput.value2, spotLightAddPositionInput.value3);
});
pointLightAddPositionButton.addEventListener("click", () => {
    addLightPosition("point", pointLightAddPositionInput.value1, pointLightAddPositionInput.value2, pointLightAddPositionInput.value3);
});
hemisphericLightAddDirectionButton.addEventListener("click", () => {
    addLightDirection("hemispheric", hemisphericLightAddDirectionInput.value1, hemisphericLightAddDirectionInput.value2, hemisphericLightAddDirectionInput.value3);
});

// Add input data sync for position and direction inputs
spotLightSetPositionInput.subscribe((x, y, z) => {
    setLightPosition("spot", x, y, z);
});

pointLightSetPositionInput.subscribe((x, y, z) => {
    setLightPosition("point", x, y, z);
});


hemisphericLightSetDirectionInput.subscribe((x, y, z) => {
    setLightDirection("hemispheric", x, y, z);
});

presetDefault.addEventListener("click", () => {
    resetSpot()
    resetPoint();
    resetHemispheric();
});
presetPoint.addEventListener("click", () => {
    switchLight("point");
});
presetSpot.addEventListener("click", () => {
    switchLight("spot");
});
presetHemispheric.addEventListener("click", () => {
    switchLight("hemispheric");
});
presetDay.addEventListener("click", () => {
    setLightingPreset("day");
});
presetNight.addEventListener("click", () => {
    setLightingPreset("night");
});
presetSunset.addEventListener("click", () => {
    setLightingPreset("sunset");
});
presetDawn.addEventListener("click", () => {
    setLightingPreset("dawn");
});

// Function to update light controls in the UI with current light properties
export function updateLightInfo() {
    // Update toggle switches with current light enabled state
    spotLightEnable.checked = getLightEnabled("spot");
    pointLightEnable.checked = getLightEnabled("point");
    hemisphericLightEnable.checked = getLightEnabled("hemispheric");

    // Update color pickers with current light diffuse colors
    spotLightDiffuse.value = getLightDiffuse("spot");


    pointLightDiffuse.value = getLightDiffuse("point");

    hemisphericLightDiffuse.value = getLightDiffuse("hemispheric");

    // Update hemispheric ground color
    hemisphericLightGroundColor.value = getHemisphericGroundColor();

    // Update intensity sliders
    spotLightIntensity.value = getLightIntensity("spot");
    pointLightIntensity.value = getLightIntensity("point");
    hemisphericLightIntensity.value = getLightIntensity("hemispheric");

    // Update range slider
    pointLightRange.value = getPointLightRange();

    // Update position inputs
    const spotPosition = getLightPosition("spot");
    spotLightSetPositionInput.value1 = spotPosition.x;
    spotLightSetPositionInput.value2 = spotPosition.y;
    spotLightSetPositionInput.value3 = spotPosition.z;

    const pointPosition = getLightPosition("point");
    pointLightSetPositionInput.value1 = pointPosition.x;
    pointLightSetPositionInput.value2 = pointPosition.y;
    pointLightSetPositionInput.value3 = pointPosition.z;

    // Update direction inputs
    const hemisphericDirection = getLightDirection("hemispheric");
    hemisphericLightSetDirectionInput.value1 = hemisphericDirection.x;
    hemisphericLightSetDirectionInput.value2 = hemisphericDirection.y;
    hemisphericLightSetDirectionInput.value3 = hemisphericDirection.z;
}
