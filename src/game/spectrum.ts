import { pointer } from "~/game/input.ts";
import type { Subscription } from "prismatix-input/subject";
import type { WithPositionInputEvent } from "prismatix-input/web-native";

// Single subscription reference
let currentSubscription: Subscription | null = null;


/**
 * Enables spectrum frequency effect on click with ripple visualization
 * @param strength Optional strength of the frequency effect (default: 200)
 * @returns Subscription that can be used to unsubscribe
 */
export const enableFrequencyOnClick = () => {
    // If there's already an active subscription, unsubscribe first
    if (currentSubscription) {
        currentSubscription.unsubscribe();
        currentSubscription = null;
    }

    // Create a new subscription
    currentSubscription = pointer.subscribe((e: WithPositionInputEvent) => {
        if (e.action === "start") {
            // Add frequency effect to all active spectrums
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
