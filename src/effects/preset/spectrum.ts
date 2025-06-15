import { pointer } from "~/input.ts";
import { addFrequency } from "~/effects/spectrum/utils.ts";
import type { Subscription } from "prismatix-input/subject";
import type { WithPositionInputEvent } from "prismatix-input/web-native";
import { createCircleRipple } from "~/effects/ripple";

// Single subscription reference
let currentSubscription: Subscription | null = null;

// Default frequency strength
const DEFAULT_FREQUENCY_STRENGTH = 200;

/**
 * Enables spectrum frequency effect on click with ripple visualization
 * @param strength Optional strength of the frequency effect (default: 200)
 * @returns Subscription that can be used to unsubscribe
 */
export const enableFrequencyOnClick = (strength: number = DEFAULT_FREQUENCY_STRENGTH) => {
    // If there's already an active subscription, unsubscribe first
    if (currentSubscription) {
        currentSubscription.unsubscribe();
        currentSubscription = null;
    }

    // Create a new subscription
    currentSubscription = pointer.subscribe((e: WithPositionInputEvent) => {
        if (e.action === "start") {
            // Add frequency effect
            addFrequency(strength);

            // Create a visual ripple effect at the click position
            createCircleRipple(e.x, e.y);
        }
    });

    return currentSubscription;
}

/**
 * Disables the spectrum frequency subscription
 */
export const disableFrequencyOnClick = () => {
    // Unsubscribe if there's an active subscription
    if (currentSubscription) {
        currentSubscription.unsubscribe();
        currentSubscription = null;
    }
}
