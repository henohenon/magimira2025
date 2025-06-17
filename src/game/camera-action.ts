import {setCameraPosition, switchCamera} from "~/babylon/camera.ts";
import {events} from "~/babylon/events.ts";
import {setModelRotation, setPosition} from "~/babylon/mdl.ts";

switchCamera("normal");
setCameraPosition("normal", -2.5, 1.5, -8);

events.on("onModelsLoaded", () => {
    setPosition("dotmiku", -2.5, 0 , -1);
    setModelRotation("dotmiku", 0, 0, 0);
});

export const cameraActionUpdate = (position: number) => {
    if(3000 < position) {
        setCameraPosition("normal", -2.5, 1.5, -8 + position);
    }
}