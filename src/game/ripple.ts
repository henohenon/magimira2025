import {createCircleRipple, createSquareRipple} from "~/lib/effects/ripple";

import {position} from "./input.ts";
import type {Subscription} from "prismatix-input/types";

const subscriptions: Subscription[] = [];
export function enableCircleRipple() {
    const subscribe = position.subscribe(e => {
       createCircleRipple(e.x, e.y);
    });
    subscriptions.push(subscribe);
}

export function enableSquareRipple(){
    const subscribe = position.subscribe(e => {
        createSquareRipple(e.x, e.y);
    });
    subscriptions.push(subscribe);
}

export function disableAllRipple() {
    for (const subscription of subscriptions) {
        subscription.unsubscribe();
    }
}