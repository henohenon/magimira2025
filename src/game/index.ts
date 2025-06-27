import { Color3 } from "@babylonjs/core/Maths/math.color";

import {
    setArcBeta,
    setArcRadius,
    setArcSphericalCoordinates,
    setArcTargetPosition,
    setFreePosition,
    setFreeRotation,
    switchCamera,
    switchCameraWithCrossFade
} from "~/lib/babylon/camera";
import {events as babylonEvents} from "~/lib/babylon/events";
import {events as textaliveEvents} from "~/lib/text-alive/events";
import {setModelRotation, setPosition} from "~/lib/babylon/mdl";
import {
    getHemisphericGroundColor,
    getLightDiffuse,
    setHemisphericGroundColor, setLightDiffuse,
    setLightIntensity
} from "~/lib/babylon/light";
import {tween} from "~/lib/update/tween.ts";
import { delayForMilSeconds } from "~/lib/update";

import {setHemisphericLightColor, setLightingPreset } from "./light";
import {events as gameEvents} from "./events";
import {
    customColorFadeIn,
    customColorFadeOut, neverEndTextFadeIn, neverEndTextFadeOut,
    setCustomColor, setWhiteBlur,
    shutterFadeOut,
    whiteFadeIn,
    whiteFadeOut
} from "./dom/fade.ts";

import "./update";
import "./dom/bottom-lyrics.ts";
import "./input";
import "./events";
import {
    disableAllSpectrum
} from "~/game/spectrum.ts";
import {disableAllRipple, enableCircleRipple, enableSquareRipple, setRippleColor} from "~/game/ripple.ts";

setLightingPreset("night");
switchCamera("free");
setFreePosition(-2.5, 1.5, -8);
setFreeRotation(0, 0, 0);
disableAllSpectrum();
disableAllRipple();

babylonEvents.on("onModelsLoaded", () => {
    setPosition("dotmiku", -2.5, 0 , -1);
    setModelRotation("dotmiku", 0, 0, 0);
});

const cryptonColorCodes = {
    "MEIKO": "#dd111e",
    "KAITO": "#1247a5",
    "Miku": "#22c0ef",
    "Rin": "#e66334",
    "Ren": "#e68c19",
    "Luka": "#dd448a",
}
const cryptonColors = {
    "MEIKO": Color3.FromHexString(cryptonColorCodes["MEIKO"]),
    "KAITO": Color3.FromHexString(cryptonColorCodes["KAITO"]),
    "Miku": Color3.FromHexString(cryptonColorCodes["Miku"]),
    "Rin": Color3.FromHexString(cryptonColorCodes["Rin"]),
    "Ren": Color3.FromHexString(cryptonColorCodes["Ren"]),
    "Luka": Color3.FromHexString(cryptonColorCodes["Luka"]),
}

// Listen for key frame events
gameEvents.on("onKeyFrame", ({key}) => {
    updateView(key.name);
});
// Listen for key frame events
textaliveEvents.on("onPhrase", ({phrase}) => {
    updateView(phrase);
});

const updateView = async (viewKey: string) => {
    switch(viewKey) {
        case "init":
            enableCircleRipple();
            tween(getHemisphericGroundColor(), Color3.White(), 7000, setHemisphericGroundColor);
            tween(getLightDiffuse("hemispheric"), Color3.White(),7000, (x) => {
                setLightDiffuse("hemispheric", x);
            });
            tween(0.08, 0.8, 7000, (x) => {
                setLightIntensity("hemispheric", x);
            });
            break;
        case "Sotellusストリートライト":
            setFreeRotation(-90, 0, 0, "free2");
            setFreePosition(-1, 0.1, -1.3, "free2");
            switchCameraWithCrossFade("free2", 1000);
            break;
        case "揺らめく都市のmagic":
            setArcTargetPosition(-2.5, 1, -1);
            setArcSphericalCoordinates(-90, 75, 6);
            switchCameraWithCrossFade("arc", 1000);
            tween(-90, 180, 30000, (x) => {
                setArcSphericalCoordinates(x, 75, 6);
            });
            tween(getHemisphericGroundColor(), cryptonColors["Rin"], 3000, setHemisphericLightColor);
            setRippleColor(cryptonColorCodes["Rin"]);
            await delayForMilSeconds(1000);
            break;
        case "街明かりが渦巻く躓くmymind":
            tween(getHemisphericGroundColor(), cryptonColors["Miku"], 3000, setHemisphericLightColor);
            setRippleColor(cryptonColorCodes["Miku"]);
            break;
        case "再起動theothernight":
            tween(getHemisphericGroundColor(), cryptonColors["MEIKO"], 3000, setHemisphericLightColor);
            setRippleColor(cryptonColorCodes["MEIKO"]);
            break;
        case "(Don’tyouknow？)":
            disableAllRipple();
            enableSquareRipple();
            setCustomColor("#1247a5"); // KAITO
            await customColorFadeIn(1000).promise;

            setFreeRotation(-90, 0, 0, "free");
            setFreePosition(-1.3, 0.8, -1, "free");
            setHemisphericGroundColor(cryptonColors["Luka"]);
            switchCamera("free");

            customColorFadeOut(1000);
            break;
        case "Ah強引にgoin'on":
            break;
        case "好きも得意も":
            setFreeRotation(90, 0, 0, "free2");
            setFreePosition(-3.7, 0.8, -1, "free2");
            switchCameraWithCrossFade("free2", 1000);
            setHemisphericGroundColor(cryptonColors["Ren"]);
            setLightDiffuse("hemispheric", cryptonColors["Ren"]);
            break;
        case "もう全部奏でたいんだ":
            setLightDiffuse("hemispheric", cryptonColors["Luka"]);
            setArcTargetPosition(-2.5, 0.8, -1);
            setArcSphericalCoordinates(-90, 80, 2);
            switchCameraWithCrossFade("arc", 3000);
            setRippleColor(cryptonColorCodes["Luka"]);
            tween(2, 15, 4500, setArcRadius);
            tween(80, 20, 4500, setArcBeta);
            break;
        case "(Yeahdoit！)":
            setRippleColor(cryptonColorCodes["Rin"]);
            setCustomColor(cryptonColorCodes["Rin"]);
            await customColorFadeIn(1000).promise;
            setHemisphericLightColor(cryptonColors["MEIKO"]);
            setRippleColor(cryptonColorCodes["MEIKO"]);
            setFreePosition(1, 1, -1);
            setFreeRotation(-51, 9, 8);
            switchCamera("free");
            customColorFadeOut(1000);
            break;
        case "めくるめくこの雑踏をかき分けていく":
            break;
        case "光差す道を目指して":
            setFreePosition(-1, 0.8, -0.4, "free2");
            setFreeRotation(115, 13, 0, "free2");
            switchCameraWithCrossFade("free2", 1000);
            tween(getHemisphericGroundColor(), cryptonColors["Miku"], 3000, setHemisphericLightColor);
            setRippleColor(cryptonColorCodes["Miku"]);
            break;
        case "空回る今だって僕らの祈り毎秒更新":
            tween(getHemisphericGroundColor(), cryptonColors["KAITO"], 3000, setHemisphericLightColor);
            setRippleColor(cryptonColorCodes["KAITO"]);
            break;
        case "不安感だって攫っていく未来にrideon":
            setLightDiffuse("hemispheric", cryptonColors["Rin"]);
            setHemisphericGroundColor(cryptonColors["Ren"]);
            setRippleColor(cryptonColorCodes["Ren"]);
            break;
        case "Yeah！":
            disableAllRipple();
            shutterFadeOut(0);
            break;
        case "終わりなんて":
            whiteFadeIn(0);
            neverEndTextFadeIn(500);
            break;
        case "ない":
            await delayForMilSeconds(400);
            tween(10, 0, 4000, setWhiteBlur);
            whiteFadeOut(4000);
            neverEndTextFadeOut(500);
            break;
        case "奏でた今日が僕らの道だ":


    }
}
