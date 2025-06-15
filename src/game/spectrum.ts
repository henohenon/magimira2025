import { pointer } from "~/game/input.ts";
import type { Subscription } from "prismatix-input/subject";
import type { WithPositionInputEvent } from "prismatix-input/web-native";
import { spectrums } from "~/effects/spectrum";
import type { CircleSpectrum, HorizontalSpectrum, VerticalSpectrum } from "~/effects/spectrum";

// Array to track all active subscriptions
export const subscriptions: Array<Subscription> = [];

/**
 * Enables circle spectrum frequency effect on click
 * @param strength Optional strength of the frequency effect (default: 200)
 * @param range Optional range of the frequency effect (default: 0)
 * @returns Subscription that can be used to unsubscribe
 */
export const enableCircleSpectrum = (strength: number = 200, range: number = 0) => {
    const circleSpectrum = spectrums["circle"] as CircleSpectrum;
    circleSpectrum.setEnable(true);

    const s = pointer.subscribe((e: WithPositionInputEvent) => {
        // Convert position to angle for circle spectrum
        const angle = Math.atan2(e.y - window.innerHeight / 2, e.x - window.innerWidth / 2);

        if (e.action === "start") {
            // Add frequency effect to circle spectrum
            circleSpectrum.addFrequencyByAngle(angle, strength, range);
            console.log(`Adding circle spectrum effect: angle=${angle}, strength=${strength} at position (${e.x}, ${e.y})`);
        } else if (e.action === "end") {
            // Add negative frequency effect to circle spectrum when input ends
            circleSpectrum.addFrequencyByAngle(angle, -strength, range);
            console.log(`Removing circle spectrum effect: angle=${angle}, strength=${-strength} at position (${e.x}, ${e.y})`);
        }
    });

    // Add the subscription to the array
    subscriptions.push(s);

    return s;
};

/**
 * Enables horizontal spectrum frequency effect on click
 * @param strength Optional strength of the frequency effect (default: 200)
 * @param range Optional range of the frequency effect (default: 0)
 * @returns Subscription that can be used to unsubscribe
 */
export const enableHorizontalSpectrum = (strength: number = 200, range: number = 0) => {
    const horizontalSpectrum = spectrums["horizontal"] as HorizontalSpectrum;
    horizontalSpectrum.setEnable(true);

    const s = pointer.subscribe((e: WithPositionInputEvent) => {
        // Calculate the rate based on x position relative to width
        console.log(e, window.innerWidth);
        const xRate = e.x / window.innerWidth;

        if (e.action === "start") {
            // Add frequency effect to horizontal spectrum
            horizontalSpectrum.addFrequencyByRate(xRate, strength, range);
            console.log(`Adding horizontal spectrum effect: rate=${xRate}, strength=${strength} at position (${e.x}, ${e.y})`);
        } else if (e.action === "end") {
            // Add negative frequency effect to horizontal spectrum when input ends
            horizontalSpectrum.addFrequencyByRate(xRate, -strength, range);
            console.log(`Removing horizontal spectrum effect: rate=${xRate}, strength=${-strength} at position (${e.x}, ${e.y})`);
        }
    });

    // Add the subscription to the array
    subscriptions.push(s);

    return s;
};

/**
 * Enables vertical spectrum frequency effect on click
 * @param strength Optional strength of the frequency effect (default: 200)
 * @param range Optional range of the frequency effect (default: 0)
 * @returns Subscription that can be used to unsubscribe
 */
export const enableVerticalSpectrum = (strength: number = 200, range: number = 0) => {
    const verticalSpectrum = spectrums["vertical"] as VerticalSpectrum;
    verticalSpectrum.setEnable(true);

    const s = pointer.subscribe((e: WithPositionInputEvent) => {
        // Calculate the rate based on y position relative to height
        const yRate = e.y / window.innerHeight;

        if (e.action === "start") {
            // Add frequency effect to vertical spectrum
            verticalSpectrum.addFrequencyByRate(yRate, strength, range);
            console.log(`Adding vertical spectrum effect: rate=${yRate}, strength=${strength} at position (${e.x}, ${e.y})`);
        } else if (e.action === "end") {
            // Add negative frequency effect to vertical spectrum when input ends
            verticalSpectrum.addFrequencyByRate(yRate, -strength, range);
            console.log(`Removing vertical spectrum effect: rate=${yRate}, strength=${-strength} at position (${e.x}, ${e.y})`);
        }
    });

    // Add the subscription to the array
    subscriptions.push(s);

    return s;
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
