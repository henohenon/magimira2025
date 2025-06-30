import { Color3 } from "@babylonjs/core/Maths/math.color";

import {
    setArcAlpha,
    setArcBeta,
    setArcRadius,
    setArcSphericalCoordinates,
    setArcTargetPosition,
    setFreePosition,
    setFreeRotation,
    switchCamera,
    switchCameraWithCrossFade
} from "~/lib/babylon/camera";
import {events as textaliveEvents} from "~/lib/text-alive/events";
import {setModelRotation, setModelPosition} from "~/lib/babylon/mdl";
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
    disableAllSpectrum, disableSpectrum, enableCircleSpectrum, enableHorizontalSpectrum, enableVerticalSpectrum
} from "~/game/spectrum.ts";
import {disableAllRipple, enableCircleRipple, enableSquareRipple, setRippleColor} from "~/game/ripple.ts";
import {spectrums} from "~/lib/effects/spectrum";

setLightingPreset("night");
switchCamera("free");
setFreePosition(-2.5, 1.5, -8);
setFreeRotation(0, 0, 0);
disableAllSpectrum();
disableAllRipple();

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

gameEvents.on("onLoaded", ()=>{
    setModelPosition("dotmiku", -2.5, 0 , -1);
    setModelRotation("dotmiku", 0, 0, 0);
    setModelPosition("room", -2.1, 0 , 0);
    setModelRotation("room", 0, 0, 0);
});

// Listen for key frame events
gameEvents.on("onKeyFrame", ({key}) => {
    updateView(key.name);
});
// Listen for key frame events
textaliveEvents.on("onPhrase", ({phrase}) => {
    updateView(phrase);
});

const updateView = async (viewKey: string) => {
    console.log(viewKey);
    switch(viewKey) {
        case "init":
            enableCircleRipple();
            tween(getHemisphericGroundColor(), Color3.White(), 7000, setHemisphericGroundColor);
            tween(getLightDiffuse("hemispheric"), Color3.White(), 7000, (x) => {
                setLightDiffuse("hemispheric", x);
            });
            tween(0.08, 0.8, 7000, (x) => {
                setLightIntensity("hemispheric", x);
            });
            break;
        case "Sotellusストリートライト": // 全員
            setFreeRotation(-90, 0, 0, "free2");
            setFreePosition(-1, 0.1, -1.3, "free2");
            switchCameraWithCrossFade("free2", 1000);
            break;
        case "揺らめく都市のmagic": // リン
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
        case "街明かりが渦巻く躓くmymind": // ミク
            tween(getHemisphericGroundColor(), cryptonColors["Miku"], 3000, setHemisphericLightColor);
            setRippleColor(cryptonColorCodes["Miku"]);
            break;
        case "再起動theothernight": // メイコ
            tween(getHemisphericGroundColor(), cryptonColors["MEIKO"], 3000, setHemisphericLightColor);
            setRippleColor(cryptonColorCodes["MEIKO"]);
            break;
        case "(Don’tyouknow？)": // カイト
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
        case "Ah強引にgoin'on": // ルカ
            break;
        case "好きも得意も": // レン
            setFreeRotation(90, 0, 0, "free2");
            setFreePosition(-3.7, 0.8, -1, "free2");
            switchCameraWithCrossFade("free2", 1000);
            setHemisphericGroundColor(cryptonColors["Ren"]);
            setLightDiffuse("hemispheric", cryptonColors["Ren"]);
            break;
        case "もう全部奏でたいんだ": // リンルカ
            setLightDiffuse("hemispheric", cryptonColors["Luka"]);
            setArcTargetPosition(-2.5, 0.8, -1);
            setArcSphericalCoordinates(-90, 80, 2);
            switchCameraWithCrossFade("arc", 3000);
            setRippleColor(cryptonColorCodes["Luka"]);
            tween(2, 15, 4500, setArcRadius);
            tween(80, 20, 4500, setArcBeta);
            break;
        case "(Yeahdoit！)": // リン
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
        case "めくるめくこの雑踏をかき分けていく": // メイコ
            break;
        case "光差す道を目指して": // ミク
            setFreePosition(-1, 0.8, -0.4, "free2");
            setFreeRotation(115, 13, 0, "free2");
            switchCameraWithCrossFade("free2", 1000);
            tween(getHemisphericGroundColor(), cryptonColors["Miku"], 3000, setHemisphericLightColor);
            setRippleColor(cryptonColorCodes["Miku"]);
            break;
        case "空回る今だって僕らの祈り毎秒更新": // カイト
            tween(getHemisphericGroundColor(), cryptonColors["KAITO"], 3000, setHemisphericLightColor);
            setRippleColor(cryptonColorCodes["KAITO"]);
            break;
        case "不安感だって攫っていく未来にrideon": // リンレン
            setLightDiffuse("hemispheric", cryptonColors["Rin"]);
            setHemisphericGroundColor(cryptonColors["Ren"]);
            setRippleColor(cryptonColorCodes["Ren"]);
            break;
        case "Yeah！": // リンレン
            disableAllRipple();
            shutterFadeOut(0);
            break;
        case "終わりなんて": // 全員
            whiteFadeIn(0);
            neverEndTextFadeIn(500);
            break;
        case "ない": // 全員
            await delayForMilSeconds(400);
            switchCamera("free")
            setFreePosition(-1, 1.5, 7, "free");
            setFreeRotation(180, 0, 0, "free");
            tween(7, 20, 6000, x => setFreePosition(-1, 1.5, x, "free"));
            tween(10, 0, 4000, setWhiteBlur);
            whiteFadeOut(4000);
            neverEndTextFadeOut(500);
            setHemisphericLightColor(Color3.White());
            setRippleColor("#ffffff");
            break;
        case "この手掴めば": // 全員
            break;
        case "また始まるんだ": // ルカ
            enableHorizontalSpectrum();
            spectrums["horizontal"].setOpacity(0);
            spectrums["horizontal"].setHueOffset(0);
            tween(0, 1, 3000, spectrums["horizontal"].setOpacity);
            tween(Color3.White(), cryptonColors["Luka"], 1000, x => spectrums["horizontal"].setColor(x.toHexString()));
            tween(getHemisphericGroundColor(), cryptonColors["Luka"], 1000, setHemisphericLightColor);
            setFreePosition(-4, 1, -1.5, "free2");
            setFreeRotation(120, 21, 0, "free2");
            switchCameraWithCrossFade("free2", 1000);
            break;
        case "グシャグシャのまま描いた": // ミク
            tween(getHemisphericGroundColor(), cryptonColors["Miku"], 1000, setHemisphericLightColor);
            tween(cryptonColors["Luka"], cryptonColors["Miku"], 1000, x => spectrums["horizontal"].setColor(x.toHexString()));
            switchCameraWithCrossFade("arc", 1000);
            setArcTargetPosition(-2.5, 1.7, -1);
            setArcSphericalCoordinates(35, 75, 1.6);
            tween(35, 130, 5000, setArcAlpha);
            break;
        case "描いた-“アイ”": // ミク
            setFreePosition(-2, 1.55, -2.3);
            setFreeRotation(-14, 30, 0);
            switchCameraWithCrossFade("free", 1000);
            tween(-2, -2.7, 2500, x => setFreePosition(x, 1.55, -2.3));
            break;
        case "It'sallright！": // 全員
            tween(getHemisphericGroundColor(), Color3.White(), 1000, setHemisphericLightColor);

            tween(cryptonColors["Miku"], Color3.White(), 1000, x => spectrums["horizontal"].setColor(x.toHexString()));
            spectrums["vertical"].setOpacity(0);
            spectrums["vertical"].setHueOffset(0);
            enableVerticalSpectrum();
            tween(0, 1, 1000, spectrums["vertical"].setOpacity);
            break;
        case "灯した歌は": // 全員
            break;
        case "君に届く": // レン
            tween(Color3.White(), cryptonColors["Ren"], 1000, x => spectrums["horizontal"].setColor(x.toHexString()));
            tween(Color3.White(), cryptonColors["Ren"], 1000, x => spectrums["vertical"].setColor(x.toHexString()));
            tween(getHemisphericGroundColor(), cryptonColors["Ren"], 1000, setHemisphericLightColor);
            await tween(1, 0, 1000, spectrums["horizontal"].setOpacity).promise;
            disableSpectrum("horizontal");
            break;
        case "躊躇いはない": // カイト
            tween(cryptonColors["Ren"], cryptonColors["KAITO"], 1000, x => spectrums["vertical"].setColor(x.toHexString()));
            tween(getHemisphericGroundColor(), cryptonColors["KAITO"], 1000, setHemisphericLightColor);
            break;
        case "そう、一人じゃないから": // リン
            tween(cryptonColors["KAITO"], cryptonColors["Ren"], 1000, x => spectrums["vertical"].setColor(x.toHexString()));
            tween(getHemisphericGroundColor(), cryptonColors["Ren"], 1000, setHemisphericLightColor);
            break;
        case "(鼓動、心、不可能を超えてゆけ)": // 全員
            tween(getHemisphericGroundColor(), Color3.White(), 1000, setHemisphericLightColor);
            enableCircleSpectrum();
            spectrums["circle"].setOpacity(0);
            spectrums["circle"].setColor(cryptonColorCodes["Miku"]);
            tween(0, 1, 1000, spectrums["circle"].setOpacity);

            tween(cryptonColors["Ren"], Color3.White(), 1000, x => spectrums["vertical"].setColor(x.toHexString()));
            await tween(1, 0, 1000, spectrums["vertical"].setOpacity).promise;
            disableSpectrum("vertical");
            break;
        case "曖昧な夢さえも抱いて": // メイコ
            tween(255, 0, 1000, spectrums["circle"].setHueOffset);
            tween(cryptonColors["Miku"], cryptonColors["MEIKO"], 1000, x => spectrums["circle"].setColor(x.toHexString()));
            enableHorizontalSpectrum();
            spectrums["horizontal"].setOpacity(0);
            spectrums["horizontal"].setHueOffset(0);
            spectrums["horizontal"].setColor(cryptonColorCodes["MEIKO"]);
            tween(0, 1, 1000, spectrums["horizontal"].setOpacity);
            break;
        case "(踊る、震える、重なる想いだけ)": // 全員
            tween(0, 255, 1000, spectrums["circle"].setHueOffset);
            tween(0, 255, 1000, spectrums["horizontal"].setHueOffset);
            tween(cryptonColors["MEIKO"], cryptonColors["Luka"], 1000, x => spectrums["horizontal"].setColor(x.toHexString()));
            tween(cryptonColors["MEIKO"], cryptonColors["Luka"], 1000, x => spectrums["circle"].setColor(x.toHexString()));
            break;
        case "あふれるストーリーに乗せて": // ルカ
            tween(255, 0, 1700, spectrums["horizontal"].setHueOffset);
            tween(255, 0, 1700, spectrums["circle"].setHueOffset);
            spectrums["vertical"].setOpacity(0);
            spectrums["vertical"].setHueOffset(0);
            spectrums["vertical"].setColor(cryptonColorCodes["Luka"]);
            enableVerticalSpectrum();
            tween(0, 1, 1700, spectrums["vertical"].setOpacity);
            await delayForMilSeconds(2800);
            whiteFadeIn(1000);
            break;
        case "立ち尽くす街角": // ミク
            whiteFadeOut(1000);
            break;

    }
}
