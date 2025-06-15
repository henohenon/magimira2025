import {pointer} from "~/input.ts";
import {createCircleRipple, createSquareRipple} from "~/effects/ripple";
import type {Subscription} from "prismatix-input/subject";
import type {WithPositionInputEvent} from "prismatix-input/web-native";

// Array to track all active subscriptions
export const subscriptions: Array<Subscription> = [];

export const enableCircleRipple = () => {
    const s = pointer.subscribe((e: WithPositionInputEvent) => {
        if(e.action === "start"){
            createCircleRipple(e.x, e.y);
        }
    });

    // Add the unsubscribe function to the subscriptions array
    subscriptions.push(s);

    return s;
}

export const enableSquareRipple = () => {
    const s = pointer.subscribe((e: WithPositionInputEvent) => {
        if(e.action === "start"){
            createSquareRipple(e.x, e.y);
        }
    });

    // Add the unsubscribe function to the subscriptions array
    subscriptions.push(s);

    return s;
}

// Function to disable all subscriptions
export const disableAll = () => {
    // Call each unsubscribe function
    for (const s of subscriptions) s.unsubscribe();

    // Clear the subscriptions array
    subscriptions.length = 0;
}
