import {events} from "~/text-alive/events.ts";
import {spectrums} from "~/effects/spectrum";
import { clearRipples } from "~/effects/ripple";

import {
    disableFrequencyOnClick,
    enableCircleSpectrum,
    enableHorizontalSpectrum,
    enableVerticalSpectrum
} from "./spectrum";
import {disableAllRipples, enableCircleRipple, enableSquareRipple} from "./ripple";
import {switchCamera} from "~/babylon/camera.ts";

let currentPresetIndex = 0;
let lastSegmentTime = 0;


events.on("onSegment", () => {
    // Don't apply the same preset twice in a row'
    const now = performance.now();
    if (now - lastSegmentTime < 2000) return;
    lastSegmentTime = now;

    // Apply the selected preset
    clearAllEffects();
    const preset = presets[currentPresetIndex];
    preset();

    // Move to the next preset (loop back to the beginning if needed)
    currentPresetIndex = (currentPresetIndex + 1) % presets.length;
});

export const clearAllEffects = () => {
    // Disable all spectrum effects
    Object.values(spectrums).forEach(spectrum => {
        spectrum.setEnable(false);
    });

    // Clear all ripple effects
    clearRipples();

    // Disable all ripple subscriptions
    disableAllRipples();

    // Disable frequency on click
    disableFrequencyOnClick();
};
clearAllEffects();


const presets = [
    () => {
        switchCamera("side");
        enableCircleRipple();
        enableCircleSpectrum()
    },
    () => {
        switchCamera("top");
        enableSquareRipple();
        enableHorizontalSpectrum();
    },
    () => {
        switchCamera("default");
        enableSquareRipple();
        enableVerticalSpectrum();
    }
];
