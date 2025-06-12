import { spectrums } from "../../index.ts";
import {
    type CircleSpectrum,
    type HorizontalSpectrum,
    type VerticalSpectrum,
} from "../../effects/spectrum";
import type {ToggleSwitch} from "../web-components/toggle-switch.ts";
import type {ColorPicker} from "../web-components/color-picker.ts";
import type {InputAndSlider} from "../web-components/input-slider.ts";
import type {NumberInput} from "../web-components/number-input.ts";

const circleSpectrum = spectrums["circle"] as CircleSpectrum;
const horizontalSpectrum = spectrums["horizontal"] as HorizontalSpectrum;
const verticalSpectrum = spectrums["vertical"] as VerticalSpectrum;

const circleEnable = document.getElementById("circle-spectrum-enable") as ToggleSwitch;
const horizontalEnable = document.getElementById("horizontal-spectrum-enable") as ToggleSwitch;
const verticalEnable = document.getElementById("vertical-spectrum-enable") as ToggleSwitch;

const circleColor = document.getElementById("circle-spectrum-color") as ColorPicker;
const horizontalColor = document.getElementById("horizontal-spectrum-color") as ColorPicker;
const verticalColor = document.getElementById("vertical-spectrum-color") as ColorPicker;

const circleHueOffset = document.getElementById("circle-spectrum-hue-offset") as InputAndSlider;
const horizontalHueOffset = document.getElementById("horizontal-spectrum-hue-offset") as InputAndSlider;
const verticalHueOffset = document.getElementById("vertical-spectrum-hue-offset") as InputAndSlider;

const circleOpacity = document.getElementById("circle-spectrum-opacity") as InputAndSlider;
const horizontalOpacity = document.getElementById("horizontal-spectrum-opacity") as InputAndSlider;
const verticalOpacity = document.getElementById("vertical-spectrum-opacity") as InputAndSlider;

const circleLineCounts = document.getElementById("circle-spectrum-line-counts") as InputAndSlider;
const horizontalLineCounts = document.getElementById("horizontal-spectrum-line-counts") as InputAndSlider;
const verticalLineCounts = document.getElementById("vertical-spectrum-line-counts") as InputAndSlider;

const circleMinRadius = document.getElementById("circle-spectrum-min-radius") as NumberInput;
const circleMaxRadius = document.getElementById("circle-spectrum-max-radius") as NumberInput;
const horizontalWidth = document.getElementById("horizontal-spectrum-width") as NumberInput;
const verticalHeight = document.getElementById("vertical-spectrum-height") as NumberInput;

if (!circleEnable || !horizontalEnable || !verticalEnable ||
    !circleColor || !horizontalColor || !verticalColor ||
    !circleHueOffset || !horizontalHueOffset || !verticalHueOffset ||
    !circleOpacity || !horizontalOpacity || !verticalOpacity ||
    !circleLineCounts || !horizontalLineCounts || !verticalLineCounts ||
    !circleMinRadius || !circleMaxRadius || !horizontalWidth || !verticalHeight) {
    console.error(circleEnable, horizontalEnable, verticalEnable, circleColor, horizontalColor, verticalColor,
        circleHueOffset, horizontalHueOffset, verticalHueOffset,
        circleOpacity, horizontalOpacity, verticalOpacity, circleLineCounts,
        horizontalLineCounts, verticalLineCounts, circleMinRadius, circleMaxRadius, horizontalWidth, verticalHeight);
    throw new Error("Spectrum controls not found");
}

circleEnable.subscribe((toggle) => {
    circleSpectrum.setEnable(toggle);
});
horizontalEnable.subscribe((toggle) => {
    horizontalSpectrum.setEnable(toggle);
});
verticalEnable.subscribe((toggle) => {
    verticalSpectrum.setEnable(toggle);
});

circleColor.subscribe((color) => {
    if (!color) return;
    circleSpectrum.setColor(color);
});
horizontalColor.subscribe((color) => {
    if (!color) return;
    horizontalSpectrum.setColor(color);
});

verticalColor.subscribe((color) => {
    if (!color) return;
    verticalSpectrum.setColor(color);
});

circleHueOffset.subscribe((delta) => {
    if (!delta) return;
    circleSpectrum.setHueOffset(delta);
});
horizontalHueOffset.subscribe((delta) => {
    if (!delta) return;
    horizontalSpectrum.setHueOffset(delta);
});
verticalHueOffset.subscribe((delta) => {
    if (!delta) return;
    verticalSpectrum.setHueOffset(delta);
});

circleOpacity.subscribe((opacity) => {
    if (!opacity) return;
    circleSpectrum.setOpacity(opacity / 100);
});
horizontalOpacity.subscribe((opacity) => {
    if (!opacity) return;
    horizontalSpectrum.setOpacity(opacity / 100);
});
verticalOpacity.subscribe((opacity) => {
    if (!opacity) return;
    verticalSpectrum.setOpacity(opacity / 100);
});

circleLineCounts.subscribe((lineCounts) => {
    if (!lineCounts) return;
    circleSpectrum.setLineCounts(lineCounts);
});
horizontalLineCounts.subscribe((lineCounts) => {
    if (!lineCounts) return;
    horizontalSpectrum.setLineCounts(lineCounts);
});
verticalLineCounts.subscribe((lineCounts) => {
    if (!lineCounts) return;
    verticalSpectrum.setLineCounts(lineCounts);
});

circleMinRadius.subscribe((minRadius) => {
    if (!minRadius) return;
    circleSpectrum.setMinRadius(minRadius);
});
circleMaxRadius.subscribe((maxRadius) => {
    if (!maxRadius) return;
    circleSpectrum.setMaxRadius(maxRadius);
});

horizontalWidth.subscribe((height) => {
    if (!height) return;
    horizontalSpectrum.setHeight(height);
});
verticalHeight.subscribe((width) => {
    if (!width) return;
    verticalSpectrum.setWidth(width);
});
