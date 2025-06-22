import {
    setArcSphericalCoordinates,
    setArcTargetPosition,
    setFreePosition,
    setFreeRotation,
    switchCamera,
    switchCameraWithCrossFade
} from "~/lib/babylon/camera";
import {events as babylonEvents} from "~/lib/babylon/events";
import {setModelRotation, setPosition} from "~/lib/babylon/mdl";
import {events} from "./events";
import {
    getHemisphericGroundColor,
    getLightDiffuse,
    setHemisphericGroundColor, setLightDiffuse,
    setLightIntensity
} from "~/lib/babylon/light";
import {tween} from "~/lib/update/tween.ts";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { setLightingPreset } from "./light";
import { whiteFadeIn, whiteFadeOut } from "~/lib/effects/dom/fade";
import { delayForMilSeconds } from "~/lib/update";

setLightingPreset("night");
switchCamera("free");
setFreePosition(-2.5, 1.5, -8);
setFreeRotation(0, 0, 0);
babylonEvents.on("onModelsLoaded", () => {
    setPosition("dotmiku", -2.5, 0 , -1);
    setModelRotation("dotmiku", 0, 0, 0);
});

// Listen for key frame events
events.on("onKeyFrame", async ({action, position}) => {
    console.log(`Key frame: ${action.name} at position ${position}`);

    // Handle different key frames
    switch(action.name) {
        case "Sotellusストリートライト":
            setFreeRotation(-90, 0, 0, "free2");
            setFreePosition(-1, 0.5, -1.3, "free2");
            switchCameraWithCrossFade("free2", 1000);
            tween(0.08, 0.8, 5000, (x) => {
                setLightIntensity("hemispheric", x);
            });
            tween(getHemisphericGroundColor(), Color3.White(), 5000, (x) => {
                setHemisphericGroundColor(x);
            });
            tween(getLightDiffuse("hemispheric"), Color3.White(),5000, (x) => {
                setLightDiffuse("hemispheric", x);
            });

            break;
        case "揺らめく都市のmagic":
            setArcTargetPosition(-2.5, 1, -1);
            setArcSphericalCoordinates(-90, 75, 6);
            whiteFadeIn(1000);
            await delayForMilSeconds(1000);
            switchCamera("arc");
            whiteFadeOut(1000);
            tween(-90, 180, 30000, (x) => {
                setArcSphericalCoordinates(x, 75, 6);
            })
            break;
    }
});
