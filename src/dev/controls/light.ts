import {
    setLightIntensity,
    resetHemispheric,
    setHemisphericGroundColor,
    setLightDiffuse,
    setLightEnabled,
    addLightPosition,
    setLightPosition, addLightDirection, setLightDirection, resetPoint, resetSpot
} from "~/babylon/light.ts";
import type {ToggleSwitch} from "../web-components/toggle-switch.ts";
import type {ColorPicker} from "../web-components/color-picker.ts";
import type {InputAndSlider} from "../web-components/input-slider.ts";
import type {TripleInput} from "../web-components/triple-input.ts";
import {setLightingPreset, switchLight} from "~/effects/preset/light.ts";

const spotLightEnable = document.getElementById("spot-light-enable") as ToggleSwitch;
const spotLightDiffuse = document.getElementById("spot-light-diffuse") as ColorPicker;
const spotLightIntensity = document.getElementById("spot-light-intensity") as InputAndSlider;
const spotLightAddPositionInput = document.getElementById("spot-light-add-position-input") as TripleInput;
const spotLightAddPositionButton = document.getElementById("spot-light-add-position-button") as HTMLButtonElement;
const spotLightSetPositionInput = document.getElementById("spot-light-set-position-input") as TripleInput;
const spotLightSetPositionButton = document.getElementById("spot-light-set-position-button") as HTMLButtonElement;

const pointLightEnable = document.getElementById("point-light-enable") as ToggleSwitch;
const pointLightDiffuse = document.getElementById("point-light-diffuse") as ColorPicker;
const pointLightIntensity = document.getElementById("point-light-intensity") as InputAndSlider;
const pointLightAddPositionInput = document.getElementById("point-light-add-position-input") as TripleInput;
const pointLightAddPositionButton = document.getElementById("point-light-add-position-button") as HTMLButtonElement;
const pointLightSetPositionInput = document.getElementById("point-light-set-position-input") as TripleInput;
const pointLightSetPositionButton = document.getElementById("point-light-set-position-button") as HTMLButtonElement;
const pointLightAddDirectionInput = document.getElementById("point-light-add-direction-input") as TripleInput;
const pointLightAddDirectionButton = document.getElementById("point-light-add-direction-button") as HTMLButtonElement;
const pointLightSetDirectionInput = document.getElementById("point-light-set-direction-input") as TripleInput;
const pointLightSetDirectionButton = document.getElementById("point-light-set-direction-button") as HTMLButtonElement;

const hemisphericLightEnable = document.getElementById("hemispheric-light-enable") as ToggleSwitch;
const hemisphericLightDiffuse = document.getElementById("hemispheric-light-diffuse") as ColorPicker;
const hemisphericLightGroundColor = document.getElementById("hemispheric-light-ground-color") as ColorPicker;
const hemisphericLightIntensity = document.getElementById("hemispheric-light-intensity") as InputAndSlider;
const hemisphericLightAddDirectionInput = document.getElementById("point-light-add-direction-input") as TripleInput;
const hemisphericLightAddDirectionButton = document.getElementById("point-light-add-direction-button") as HTMLButtonElement;
const hemisphericLightSetDirectionInput = document.getElementById("point-light-set-direction-input") as TripleInput;
const hemisphericLightSetDirectionButton = document.getElementById("point-light-set-direction-button") as HTMLButtonElement;

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
    !spotLightAddPositionInput || !pointLightAddPositionInput || !hemisphericLightAddDirectionInput ||
    !spotLightAddPositionButton || !pointLightAddPositionButton || !hemisphericLightAddDirectionButton ||
    !spotLightSetPositionInput || !pointLightSetPositionInput || !hemisphericLightSetDirectionInput ||
    !spotLightSetPositionButton || !pointLightSetPositionButton || !hemisphericLightSetDirectionButton || !presetDefault ||
    !presetPoint || !presetSpot || !presetHemispheric || !presetDay || !presetNight || !presetSunset || !presetDawn){
    console.error("Missing DOM elements",
        spotLightEnable, pointLightEnable, hemisphericLightEnable,
        spotLightDiffuse, pointLightDiffuse, hemisphericLightDiffuse,
        hemisphericLightGroundColor,
        spotLightIntensity, pointLightIntensity, hemisphericLightIntensity,
        spotLightAddPositionInput, pointLightAddPositionInput, hemisphericLightAddDirectionInput,
        spotLightAddPositionButton, pointLightAddPositionButton, hemisphericLightAddDirectionButton,
        spotLightSetPositionInput, pointLightSetPositionInput, hemisphericLightSetDirectionInput,
        spotLightSetPositionButton, pointLightSetPositionButton, hemisphericLightSetDirectionButton,
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
    setLightDiffuse("spot", color);
});
pointLightDiffuse.subscribe(color => {
    if (!color) return;
    setLightDiffuse("point", color);
});
hemisphericLightDiffuse.subscribe(color => {
    if (!color) return;
    setLightDiffuse("hemispheric", color);
});
hemisphericLightGroundColor.subscribe(color => {
    if (!color) return;
    setHemisphericGroundColor(color);
});

spotLightIntensity.subscribe(value => {
    setLightIntensity("spot", value);
});
pointLightIntensity.subscribe(value => {
    setLightIntensity("point", value);
});
hemisphericLightIntensity.subscribe(value => {
    setLightIntensity("hemispheric", value);
});

spotLightAddPositionButton.addEventListener("click", () => {
    addLightPosition("spot", spotLightAddPositionInput.value1, spotLightAddPositionInput.value2, spotLightAddPositionInput.value3);
});
spotLightSetPositionButton.addEventListener("click", () => {
    setLightPosition("spot", spotLightSetPositionInput.value1, spotLightSetPositionInput.value2, spotLightSetPositionInput.value3);
});
pointLightAddPositionButton.addEventListener("click", () => {
    addLightPosition("point", pointLightAddPositionInput.value1, pointLightAddPositionInput.value2, pointLightAddPositionInput.value3);
});
pointLightSetPositionButton.addEventListener("click", () => {
    setLightPosition("point", pointLightSetPositionInput.value1, pointLightSetPositionInput.value2, pointLightSetPositionInput.value3);
});
pointLightAddDirectionButton.addEventListener("click", () => {
    addLightPosition("point", pointLightAddDirectionInput.value1, pointLightAddDirectionInput.value2, pointLightAddDirectionInput.value3);
});
pointLightSetDirectionButton.addEventListener("click", () => {
    setLightPosition("point", pointLightSetDirectionInput.value1, pointLightSetDirectionInput.value2, pointLightSetDirectionInput.value3);
});
hemisphericLightAddDirectionButton.addEventListener("click", () => {
    addLightDirection("hemispheric", hemisphericLightAddDirectionInput.value1, hemisphericLightAddDirectionInput.value2, hemisphericLightAddDirectionInput.value3);
});
hemisphericLightSetDirectionButton.addEventListener("click", () => {
    setLightDirection("hemispheric", hemisphericLightSetDirectionInput.value1, hemisphericLightSetDirectionInput.value2, hemisphericLightSetDirectionInput.value3);
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
