import {setCameraPosition, switchCamera} from "~/babylon/camera.ts";
import {events as babylonEvents} from "~/babylon/events.ts";
import {setModelRotation, setPosition} from "~/babylon/mdl.ts";
import {events} from "./events";

switchCamera("normal");
setCameraPosition("normal", -2.5, 1.5, -8);

babylonEvents.on("onModelsLoaded", () => {
    setPosition("dotmiku", -2.5, 0 , -1);
    setModelRotation("dotmiku", 0, 0, 0);
});

// Listen for camera action events
events.on("onCameraAction", ({action, position}) => {
    console.log(`Camera action: ${action.name} at position ${position}`);

    // Handle different camera actions
    switch(action.name) {
        case "initialize":
            setCameraPosition("normal", -2.5, 1.5, -8);
            break;
        case "camera-zoom-leg":
            setCameraPosition("normal", -2.5, 1.5, -4);
            break;
        default:
            // Default camera behavior
            break;
    }
});

export const cameraActionUpdate = (position: number) => {
    if(3000 < position) {
        setCameraPosition("normal", -2.5, 1.5, -8 + position);
    }
}
