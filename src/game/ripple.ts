import {createCircleRipple, createSquareRipple} from "~/lib/effects/ripple";

import {positionRipple} from "./input.ts";
import type {Subscription} from "prismatix-input/types";

const subscriptions: Subscription[] = [];
let rippleColor = "#ffffff";
export function setRippleColor(color: string) {
    rippleColor = color;
}
export function enableCircleRipple() {
    const subscribe = positionRipple.subscribe(e => {
       createCircleRipple(e.x, e.y, { color: rippleColor });
    });
    subscriptions.push(subscribe);
}

export function enableSquareRipple(){
    const subscribe = positionRipple.subscribe(e => {
        createSquareRipple(e.x, e.y, { color: rippleColor });
    });
    subscriptions.push(subscribe);
}

export function disableAllRipple() {
    for (const subscription of subscriptions) {
        subscription.unsubscribe();
    }
}