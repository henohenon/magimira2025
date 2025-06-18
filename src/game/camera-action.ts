import {setFreePosition, setFreeRotation, switchCamera} from "~/babylon/camera.ts";
import {events as babylonEvents} from "~/babylon/events.ts";
import {setModelRotation, setPosition} from "~/babylon/mdl.ts";
import {events} from "./events";
import {setLightingPreset} from "~/game/light.ts";
import {setLightIntensity} from "~/babylon/light.ts";

switchCamera("free");
setFreePosition(-2.5, 1.5, -8);
setFreeRotation(0, 0, 0);
babylonEvents.on("onModelsLoaded", () => {
    setPosition("dotmiku", -2.5, 0 , -1);
    setModelRotation("dotmiku", 0, 0, 0);
    setLightingPreset("night");
});

let intensity = 0.08;

// Listen for camera action events
events.on("onCameraAction", ({action, position}) => {
    console.log(`Camera action: ${action.name} at position ${position}`);

    // Handle different camera actions
    switch(action.name) {
        case "2C":
            setFreePosition(2.5, 1.5, -2);
            setFreeRotation(-90, 0, 0);
            break;
        case "first":
            intensity += 0.01;
            setLightIntensity("hemispheric", intensity);
            break;
    }
});
