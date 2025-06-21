import {
    setFreePosition,
    setFreeRotation,
    switchCamera,
    switchCameraWithCrossFade
} from "~/lib/babylon/camera";
import {events as babylonEvents} from "~/lib/babylon/events";
import {setModelRotation, setPosition} from "~/lib/babylon/mdl";
import {events} from "./events";
import {setLightingPreset} from "~/game/light";
import {setLightIntensity} from "~/lib/babylon/light";

switchCamera("free");
setFreePosition(-2.5, 1.5, -8);
setFreeRotation(0, 0, 0);
babylonEvents.on("onModelsLoaded", () => {
    setPosition("dotmiku", -2.5, 0 , -1);
    setModelRotation("dotmiku", 0, 0, 0);
    setLightingPreset("night");
});

let intensity = 0.08;

// Listen for key frame events
events.on("onKeyFrame", ({action, position}) => {
    console.log(`Key frame: ${action.name} at position ${position}`);

    // Handle different key frames
    switch(action.name) {
        case "2C":
            //setFreePosition(2.5, 1.5, -2);
            //setFreeRotation(-90, 0, 0);
            switchCameraWithCrossFade("arc", 1000);
            break;
        case "first":
            intensity += 0.01;
            setLightIntensity("hemispheric", intensity);
            break;
    }
});
