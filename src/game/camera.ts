import type { Subscription } from "prismatix-input/types";
import { inputArea, positionRipple } from "./input";
import { addFreePosition, addFreeRotation, getArcSphericalCoordinates, setArcAlpha, setArcBeta } from "~/lib/babylon/camera";

let arcSubscription: Subscription | undefined = undefined;
export function enableArcCameraControl(cameraType: "arc" | "arc2" = "arc"){
    arcSubscription?.unsubscribe();
    arcSubscription = positionRipple.subscribe(e => {
        const current = getArcSphericalCoordinates(cameraType);
        if(!current) return;
        const {alpha, beta} = current;
        const lengthX = inputArea.offsetWidth;
        const lengthY = inputArea.offsetHeight;
        const x = e.x - lengthX/2;
        const y = e.y - lengthY/2;
        setArcAlpha(alpha + x / lengthX * 3);
        setArcBeta((beta + y / lengthY * 3) % 180);
    });
}

export function disableArcCameraControl(){
    arcSubscription?.unsubscribe();
}

let aiSubscription: Subscription | undefined = undefined;
export function enableAiCameraControl(direction = 1, cameraType: "free" | "free2" = "free"){
    aiSubscription?.unsubscribe();
    let nextAngle = 3.25;
    aiSubscription = positionRipple.subscribe(e => {
        if(e.action == "start"){
            addFreePosition(0, 0, 0.1 * direction, cameraType);
            addFreeRotation(0, 0, nextAngle, cameraType);
            nextAngle = nextAngle > 0 ? -7.5 : 7.5;
        }
    });
}

export function disableAiCameraControl(){
    aiSubscription?.unsubscribe();
}