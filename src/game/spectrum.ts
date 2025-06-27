import type { Subscription } from "prismatix-input/types";
import type {WithPositionInputEvent} from "prismatix-input/input";

import {
    spectrums,
    type Spectrum,
    type CircleSpectrum,
    type VerticalSpectrum,
    type HorizontalSpectrum
} from "~/lib/effects/spectrum";

import {inputArea, positionSpectrum} from "./input.ts";

const subscriptions: Subscription[] = [];
/**
 * Common function to enable spectrum frequency effect on click
 * @param spectrum The type of spectrum to enable
 * @param calculateRate Function to calculate position from input event
 * @param addFrequency Function to add frequency to the spectrum
 * @param strength Optional strength of the frequency effect (default: 0.3)
 * @param range Optional range of the frequency effect (default: 2)
 * @returns Subscription that can be used to unsubscribe
 */
function enableSpectrum<T extends Spectrum>(
    spectrum: T,
    calculateRate: (e: WithPositionInputEvent) => number,
    addFrequency: (position: number, strength: number, range: number) => void,
    strength: number = 0.3,
    range: number = 2
) {
    spectrum.setEnable(true);

    const subscription = positionSpectrum.subscribe(e => {
        console.log(e);
        if (e.action === "start") {
            addFrequency(calculateRate(e), strength, range);
        } else if (e.action === "end") {
            addFrequency(calculateRate(e), -strength, range);
        }
    });

    // Add the subscription to the array
    subscriptions.push(subscription);

    return subscription;
};

export function enableCircleSpectrum(strength: number = 0.3, range: number = 2) {
    const circleSpectrum = spectrums["circle"] as CircleSpectrum;

    return enableSpectrum(
        circleSpectrum,
        (e) => Math.atan2(e.y - inputArea.offsetHeight / 2, e.x - inputArea.offsetWidth / 2),
        (angle, strength, range) => circleSpectrum.addFrequencyByAngle(angle, strength, range),
        strength,
        range
    );
};

export function enableVerticalSpectrum(strength: number = 0.3, range: number = 2) {
    const verticalSpectrum = spectrums["vertical"] as VerticalSpectrum;

    return enableSpectrum(
        verticalSpectrum,
        (e) => e.y / inputArea.offsetHeight,
        (rate, strength, range) => verticalSpectrum.addFrequencyByRate(rate, strength, range),
        strength,
        range
    )

}

export function enableHorizontalSpectrum(strength: number = 0.3, range: number = 2) {
    const horizontalSpectrum = spectrums["horizontal"] as HorizontalSpectrum;

    return enableSpectrum(
        horizontalSpectrum,
        (e) => e.x / inputArea.offsetWidth,
        (rate, strength, range) => horizontalSpectrum.addFrequencyByRate(rate, strength, range),
        strength,
        range
    )
}

export function disableAllSpectrum() {
    for (const subscription of subscriptions) {
        subscription.unsubscribe();
    }
    for (const spectrum of Object.values(spectrums)){
        spectrum.setEnable(false);
    }
}