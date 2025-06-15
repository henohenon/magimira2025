import { pointer } from "~/game/input.ts";
import type { Subscription } from "prismatix-input/subject";
import type { WithPositionInputEvent } from "prismatix-input/web-native";
import { spectrums } from "~/effects/spectrum";
import type { CircleSpectrum, HorizontalSpectrum, VerticalSpectrum } from "~/effects/spectrum";
import type { Spectrum } from "~/effects/spectrum";

// Array to track all active subscriptions
export const subscriptions: Array<Subscription> = [];

/**
 * Common function to enable spectrum frequency effect on click
 * @param spectrumType The type of spectrum to enable
 * @param calculatePosition Function to calculate position from input event
 * @param addFrequency Function to add frequency to the spectrum
 * @param spectrumName Name of the spectrum for logging
 * @param strength Optional strength of the frequency effect (default: 200)
 * @param range Optional range of the frequency effect (default: 0)
 * @returns Subscription that can be used to unsubscribe
 */
const enableSpectrum = <T extends Spectrum>(
    spectrumType: T,
    calculatePosition: (e: WithPositionInputEvent) => number,
    addFrequency: (spectrum: T, position: number, strength: number, range: number) => void,
    spectrumName: string,
    strength: number = 200,
    range: number = 0
) => {
    spectrumType.setEnable(true);

    // TODO: Multi tap countermeasure
    // Variable to cache the last position
    let lastPosition: number | null = null;

    const s = pointer.subscribe((e: WithPositionInputEvent) => {
        console.log(e, window.innerWidth);
        // Calculate the position
        const position = calculatePosition(e);

        if (e.action === "start") {
            // Add frequency effect to spectrum
            addFrequency(spectrumType, position, strength, range);
            console.log(`Adding ${spectrumName} spectrum effect: position=${position}, strength=${strength} at position (${e.x}, ${e.y})`);
            // Cache the position
            lastPosition = position;
        } else if (e.action === "move" && lastPosition !== null) {
            // Remove effect at the last position
            addFrequency(spectrumType, lastPosition, -strength, range);
            console.log(`Removing ${spectrumName} spectrum effect: position=${lastPosition}, strength=${-strength}`);

            // Add effect at the current position
            addFrequency(spectrumType, position, strength, range);
            console.log(`Adding ${spectrumName} spectrum effect: position=${position}, strength=${strength} at position (${e.x}, ${e.y})`);

            // Update the last position
            lastPosition = position;
        } else if (e.action === "end" && lastPosition !== null) {
            // Add negative frequency effect to spectrum when input ends
            addFrequency(spectrumType, lastPosition, -strength, range);
            console.log(`Removing ${spectrumName} spectrum effect: position=${lastPosition}, strength=${-strength} at position (${e.x}, ${e.y})`);
            // Reset the last position
            lastPosition = null;
        }
    });

    // Add the subscription to the array
    subscriptions.push(s);

    return s;
};

/**
 * Enables circle spectrum frequency effect on click
 * @param strength Optional strength of the frequency effect (default: 200)
 * @param range Optional range of the frequency effect (default: 0)
 * @returns Subscription that can be used to unsubscribe
 */
export const enableCircleSpectrum = (strength: number = 200, range: number = 0) => {
    const circleSpectrum = spectrums["circle"] as CircleSpectrum;

    return enableSpectrum(
        circleSpectrum,
        (e) => Math.atan2(e.y - window.innerHeight / 2, e.x - window.innerWidth / 2),
        (spectrum, angle, strength, range) => spectrum.addFrequencyByAngle(angle, strength, range),
        "circle",
        strength,
        range
    );
};

/**
 * Enables horizontal spectrum frequency effect on click
 * @param strength Optional strength of the frequency effect (default: 200)
 * @param range Optional range of the frequency effect (default: 0)
 * @returns Subscription that can be used to unsubscribe
 */
export const enableHorizontalSpectrum = (strength: number = 200, range: number = 0) => {
    const horizontalSpectrum = spectrums["horizontal"] as HorizontalSpectrum;

    return enableSpectrum(
        horizontalSpectrum,
        (e) => e.x / window.innerWidth,
        (spectrum, rate, strength, range) => spectrum.addFrequencyByRate(rate, strength, range),
        "horizontal",
        strength,
        range
    );
};

/**
 * Enables vertical spectrum frequency effect on click
 * @param strength Optional strength of the frequency effect (default: 200)
 * @param range Optional range of the frequency effect (default: 0)
 * @returns Subscription that can be used to unsubscribe
 */
export const enableVerticalSpectrum = (strength: number = 200, range: number = 0) => {
    const verticalSpectrum = spectrums["vertical"] as VerticalSpectrum;

    return enableSpectrum(
        verticalSpectrum,
        (e) => e.y / window.innerHeight,
        (spectrum, rate, strength, range) => spectrum.addFrequencyByRate(rate, strength, range),
        "vertical",
        strength,
        range
    );
};

/**
 * Disables all spectrum frequency subscriptions
 */
export const disableFrequencyOnClick = () => {
    // Call each unsubscribe function
    for (const s of subscriptions) s.unsubscribe();
    for (const spectrum of Object.values(spectrums)) spectrum.setEnable(false);

    // Clear the subscriptions array
    subscriptions.length = 0;
};
