import { Easing, Tween } from "@tweenjs/tween.js";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import {Vector3} from "@babylonjs/core/Maths/math.vector";

import {
    setArcAlpha,
    setArcRadius,
    setArcSphericalCoordinates,
    setArcTargetPosition,
    setCameraMinZ,
    setFreePosition,
    setFreeRotation,
    switchCamera,
    switchCameraWithCrossFade
} from "~/lib/babylon/camera";
import {setModelRotation, setModelVisibility, playAnimation, getRootMesh} from "~/lib/babylon/mdl";
import {
    setLightDiffuse,
    setLightIntensity
} from "~/lib/babylon/light";
import { delayForMilSeconds } from "~/lib/update";
import { tweenGroup } from "~/lib/update/cycle.ts";
import { enableStarParticles } from "~/lib/babylon/star-particle.ts";

import { setLightingPreset } from "./light";
import {events as gameEvents} from "./events";
import {
    neverEndTextFadeIn,
    neverEndTextFadeOut,
    shutterFadeIn,
    shutterFadeOut,
    shutterIn,
    shutterOut,
    whiteFadeIn,
    whiteFadeOut
} from "./dom/fade.ts";
import "./update";
import "./dom/bottom-lyrics.ts";
import "./events";
import {
    disableAllSpectrum,
    enableCircleSpectrum,
    enableHorizontalSpectrum,
    enableVerticalSpectrum
} from "./spectrum.ts";
import {disableAllRipple, enableCircleRipple, enableSquareRipple} from "./ripple.ts";
import { disableAiCameraControl, disableArcCameraControl, enableAiCameraControl, enableArcCameraControl } from "./camera.ts";
import { enableDropStar } from "./drop-star.ts";

const templateColorCodes = {
    "default": "#FFEAC7",
    "MEIKO": "#dd111e",
    "KAITO": "#1247a5",
    "Miku": "#22c0ef",
    "Rin": "#e66334",
    "Ren": "#e68c19",
    "Luka": "#dd448a",
}
const templateColors = {
    "default": Color3.FromHexString(templateColorCodes["default"]),
    "MEIKO": Color3.FromHexString(templateColorCodes["MEIKO"]),
    "KAITO": Color3.FromHexString(templateColorCodes["KAITO"]),
    "Miku": Color3.FromHexString(templateColorCodes["Miku"]),
    "Rin": Color3.FromHexString(templateColorCodes["Rin"]),
    "Ren": Color3.FromHexString(templateColorCodes["Ren"]),
    "Luka": Color3.FromHexString(templateColorCodes["Luka"]),
}

const audio = new Audio("/電気のスイッチを入れる.mp3");
audio.volume = 0.1;


setFreePosition(0, 1.1, 2.1);
setFreeRotation(180, 32, 0);
switchCamera("free");
setLightingPreset("night");
setCameraMinZ(0.01, "free");
setCameraMinZ(0.01, "free2");

disableAllSpectrum();
disableAllRipple();

let dotMikuRoot: AbstractMesh | undefined = undefined;

gameEvents.on("onLoaded", async ()=>{
    dotMikuRoot = getRootMesh("dotmiku");

    enableCircleRipple();    
    await delayForMilSeconds(1000);
    audio.play();
    await delayForMilSeconds(500);
    setLightDiffuse("hemispheric", templateColors["default"]);
    setLightIntensity("hemispheric", 0.8);
    await delayForMilSeconds(3000);
    playAnimation("dotmiku", "歩き2");
    dotMikuRoot.position = new Vector3(0.5, 0, 0.5);
    setModelRotation(dotMikuRoot, 0, -90, 0);
    dotMikuRoot.visibility = 1;
    dotMikuRoot.position = Vector3.Zero();
    setModelRotation(dotMikuRoot, 0, -180, 0);
    playAnimation("dotmiku", "座り");

});

// Listen for key frame events
gameEvents.on("onKeyFrame", ({key}) => {
    updateView(key.name);
});

const updateView = async (viewKey: string) => {
    switch(viewKey) {
        case "Sotellusストリートライト": // 全員
            setFreeRotation(145, 15, 0, "free2");
            setFreePosition(-5, 2, 5, "free2");
            switchCamera("free2");
            break;
        case "揺らめく都市のmagic": // リン
            setFreeRotation(-45, 20, 0);
            setFreePosition(-1, 1, -3);
            switchCamera("free");
            const tween_v1_01 = new Tween({x: -1, z: -3}).to({x: 0.3, z: 0}, 18000).start().onUpdate(pos => {
                setFreePosition(pos.x, 1, pos.z);
            }).onComplete(() => tweenGroup.remove(tween_v1_01));
            tweenGroup.add(tween_v1_01);
            break;
        case "街明かりが渦巻く躓くmymind": // ミク
            disableAllRipple();
            enableHorizontalSpectrum();
            break;
        case "再起動theothernight": // メイコ
            break;
        case "(Don’tyouknow？)": // カイト
            setFreeRotation(-135, 20, 0, "free2");
            setFreePosition(0.3, 1, 0, "free2");
            const tween_v1_02 = new Tween({x: 0.3, z: 0}).to({x: -1, z: 1.5}, 10000).start().onUpdate(pos => {
                setFreePosition(pos.x, 1, pos.z, "free2");
            }).onComplete(() => tweenGroup.remove(tween_v1_02));
            tweenGroup.add(tween_v1_02);
            shutterIn(500).onComplete(()=>{
                disableAllSpectrum();
                enableSquareRipple();

                switchCamera("free2");
                shutterOut(500);
            });
            break;
        case "Ah強引にgoin'on": // ルカ
            break;
        case "好きも得意も": // レン
            break;
        case "もう全部奏でたいんだ": // リンルカ
            break;
        case "(Yeahdoit！)": // リン
            setFreeRotation(70, 5, 0);
            setFreePosition(0.2, 0.78, 1.6);
            setCameraMinZ(0.01, "free");
            const tween_v1_03 = new Tween({z: 1.6}).to({z: 1.8}, 6000).start().onUpdate(pos => {
                setFreePosition(0.2, 0.78, pos.z);
                disableAllRipple();
                enableVerticalSpectrum();
            }).onComplete(() => tweenGroup.remove(tween_v1_03));
            tweenGroup.add(tween_v1_03);
            switchCameraWithCrossFade('free', 1000);
            break;
        case "めくるめくこの雑踏をかき分けていく": // メイコ
            break;
        case "光差す道を目指して": // ミク
            setCameraMinZ(0.01, "free2");
            setFreeRotation(-75, 50, 5, "free2");
            setFreePosition(-4.38, 0.8, 2.2, "free2");
            switchCamera("free2");
            const tween_v1_04 = new Tween({z: 2.2}).to({z: 2.35}, 5000).start().onUpdate(pos => {
                setFreePosition(-4.38, 0.8, pos.z, "free2");
            }).onComplete(() => tweenGroup.remove(tween_v1_04));
            tweenGroup.add(tween_v1_04);
            break;
        case "空回る今だって僕らの祈り毎秒更新": // カイト
            setFreeRotation(70, 11, 0);
            setFreePosition(-4, 1.6, 2.2);
            setCameraMinZ(0.001, "free");
            switchCamera("free");
            const tween_v1_05 = new Tween({x: -5}).to({x: -3.5}, 5000).start().onUpdate(pos => {
                setFreePosition(pos.x, 1.6, 2.2);
            }).onComplete(() => tweenGroup.remove(tween_v1_05));
            tweenGroup.add(tween_v1_05);
            break;
        case "不安感だって攫っていく未来にrideon": // リンレン
            disableAllSpectrum();
            enableCircleSpectrum();

            setFreeRotation(0, 40, 0, "free2");
            setFreePosition(-4, 2, 0.8, "free2");
            switchCamera("free2");
            const tween_v1_06 = new Tween({pitch: 40, y: 2, z: 0.8}).to({pitch: -10, y:0.8, z: 1.3}, 10000).start().onUpdate(props => {
                setFreeRotation(0, props.pitch, 0, "free2");
                setFreePosition(-4, props.y, props.z, "free2");
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_v1_06));
            tweenGroup.add(tween_v1_06);
            break;
        case "c1-Yeah！": // リンレン
            whiteFadeIn(1000);
            shutterFadeOut(1000);
            break;
        case "c1-終わりなんて": // 全員
            neverEndTextFadeIn(0);
            break;
        case "c1-ない": // 全員
            disableAllSpectrum();
            enableArcCameraControl();

            setArcTargetPosition(-2.5, 0.5, -0.5);
            setArcSphericalCoordinates(-90, 80, 2)
            switchCamera("arc");
            const tween_c1_01 = new Tween({radius: 2}).to({radius: 8}, 9000).start().onUpdate(pos => {
                setArcRadius(pos.radius);
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_c1_01));
            tweenGroup.add(tween_c1_01);
            whiteFadeOut(500);
            neverEndTextFadeOut(500);
            break;
        case "c1-この手掴めば": // 全員
        break;
        case "c1-また始まるんだ": // ルカ
        break;
        case "c1-グシャグシャのまま描いた": // ミク
            disableArcCameraControl();
            enableAiCameraControl();

            setFreeRotation(180, 0, 0);
            setFreePosition(-2.5, 0.5, 3);
            switchCamera("free");
            break;
        case "c1-“アイ”": // ミク
            break;
        case "c1-It'sallright！": // 全員
            disableAiCameraControl();

            enableDropStar();

            setFreeRotation(0, -10, 0, "free2");
            setFreePosition(-2.5, 1.5, -5, "free2");
            setCameraMinZ(0.1, "free2");
            switchCamera("free2");
            /*
            const tween_c1_04 = new Tween({y: 0.1, pitch: -5}).to({y: 0.3, pitch: -15}, 4000).start().onUpdate(props => {
                setFreePosition(-1.9, props.y, 2, "free2");
                setFreeRotation(160, props.pitch, -0.3, "free2");
            }).onComplete(() => tweenGroup.remove(tween_c1_04));
            tweenGroup.add(tween_c1_04);*/
            break;
        case "c1-灯した歌は": // 全員
            break;
        case "c1-君に届く": // レン
            break;
        case "c1-躊躇いはない": // カイト
            break;
        case "c1-そう、一人じゃないから": // リン
            setFreeRotation(-17, 10, 0, "free2");
            setFreePosition(1, 1, -7, "free2");
            setCameraMinZ(0.1, "free2");
            switchCamera("free2");
            await delayForMilSeconds(5000);
            shutterFadeIn(1000);
            break;
        case "c1-(鼓動)": // 全員
            enableCircleRipple();

            setFreeRotation(43, -10, 4);
            setFreePosition(-4.8, 0.72, 2.6);
            setCameraMinZ(0.1, "free");
            switchCamera("free");
            break;
        case "c1-(心)": // 全員
            disableAllRipple();
            enableSquareRipple();

            setFreeRotation(-35, 18, 0.5);
            setFreePosition(-3.25, 1, 2.55);
            break;
        case "c1-(不可能を超えてゆけ)": // 全員
            enableCircleRipple();

            setFreeRotation(70, 15, 0.5);
            setFreePosition(-1.3, 0.7, 0.8);
            const tween_c1_07 = new Tween({z: 0.8}).to({z: 1.3}, 3500).start().onUpdate(props => {
                setFreePosition(-1.3, 0.7, props.z, "free");
            }).onComplete(() => tweenGroup.remove(tween_c1_07));
            tweenGroup.add(tween_c1_07);
            break;
        case "c1-曖昧な夢さえも抱いて": // メイコ
            setFreeRotation(0, 75, 0, "free2");
            setFreePosition(-2.45, 1.5, -0.5, "free2");
            setCameraMinZ(0.1, "free2");
            switchCamera("free2");
            const tween_c1_08 = new Tween({y: 1.3}).to({y: 1.75}, 6000).start().onUpdate(props => {
                setFreePosition(-2.45, props.y, -0.5, "free2");
            }).onComplete(() => tweenGroup.remove(tween_c1_08));
            tweenGroup.add(tween_c1_08);
            break;
        case "c1-(踊る)": // 全員
            disableAllRipple();
            enableVerticalSpectrum();

            setFreeRotation(43, -10, 4);
            setFreePosition(-4.8, 0.72, 2.6);
            setCameraMinZ(0.1, "free");
            switchCamera("free");
            break;
        case "c1-(震える)": // 全員
            enableHorizontalSpectrum();
            
            setFreeRotation(-35, 18, 0.5);
            setFreePosition(-3.25, 1, 2.55);
            break;
        case "c1-(重なる想いだけ)": // 全員
            enableCircleSpectrum();

            setFreeRotation(70, 15, 0.5);
            setFreePosition(-1.3, 0.7, 0.8);
            const tween_c1_09 = new Tween({z: 0.8}).to({z: 1.3}, 3500).start().onUpdate(props => {
                setFreePosition(-1.3, 0.7, props.z, "free");
            }).onComplete(() => tweenGroup.remove(tween_c1_09));
            tweenGroup.add(tween_c1_09);
            break;
        case "c1-あふれるストーリーに乗せて": // ルカ
            setFreeRotation(0, 0, 0);
            setFreePosition(-2.5, 1.5, -4);
            switchCamera("free");
            const tween_c1_10 = new Tween({z: -4, y: 1.5}).to({z: -30, y:3}, 9000).start().onUpdate(pos => {
                setFreePosition(-2.5, pos.y, pos.z, "free")
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_c1_10));
            tweenGroup.add(tween_c1_10);
            break;
        case "立ち尽くす街角": // ミク
            disableAllSpectrum();
            enableCircleRipple();

            setFreeRotation(45, 20, 0, "free2");
            setFreePosition(-3.5, 1, -3, "free2");
            switchCameraWithCrossFade("free2", 1000);
            const tween_v2_01 = new Tween({x: -3.5, z: -3}).to({x: -4.2, z: 0}, 18000).start().onUpdate(pos => {
                setFreePosition(pos.x, 1, pos.z, "free2");
            }).onComplete(() => tweenGroup.remove(tween_v2_01));
            tweenGroup.add(tween_v2_01);
            break;
        case "どれほど間違っても": // レン
            break;
        case "この灯火は何度だって輝く": // メイコ
            break;
        case "(宿すagainstgravity)": // カイト
            setFreeRotation(135, 20, 0);
            setFreePosition(-4.2, 1, 0);
            setCameraMinZ(0.01, "free");
            const tween_v2_02 = new Tween({x: -4.2, z: 0}).to({x: -2.9, z: 1.5}, 10000).start().onUpdate(pos => {
                setFreePosition(pos.x, 1, pos.z);
            }).onComplete(() => tweenGroup.remove(tween_v2_02));
            tweenGroup.add(tween_v2_02);
            shutterIn(500).onComplete(()=>{
                disableAllRipple();
                enableSquareRipple();

                switchCamera("free");
                shutterOut(500);
            });
            break;
        case "ここからはノンストップ": // ルカ
            break;
        case "宵闇の中でも": // リン
            break;
        case "消えない星を繋いでいたい": // ミク
            break;
        case "止め処なくbluff,bluff": // メイコ
            disableAllRipple();
            enableHorizontalSpectrum();

            setFreeRotation(-90, 0, 0, "free2");
            setFreePosition(-3.75, 0.1, 1.25, "free2");
            setCameraMinZ(0.01, "free2");
            const tween_v2_03 = new Tween({y: 0.1}).to({y: 1}, 10000).start().onUpdate(pos => {
                setFreePosition(-3.75, pos.y, 1.25, "free2");
            }).onComplete(() => tweenGroup.remove(tween_v2_03));
            tweenGroup.add(tween_v2_03);
            switchCameraWithCrossFade('free2', 1000);
            break;
        case "言葉の飾り毎秒更新": // メイコ
            break;
        case "揺らぐ主役舞台は未知の最前線": // ルカ・カイト
            disableAllSpectrum();
            enableVerticalSpectrum();

            setFreeRotation(-150, 20, 0, "free2");
            setFreePosition(-0.5, 0.8, 0.8, "free2");
            setCameraMinZ(0.001, "free2");
            switchCamera("free2");
            const tween_v2_05 = new Tween({pitch: 35, x: -0.35, y: 0.4, z: 0.5}).to({pitch: 20, x: -0.5, y:0.8, z: 0.8}, 10000).start().onUpdate(props => {
                setFreeRotation(-150, props.pitch, 0, "free2");
                setFreePosition(props.x, props.y, props.z, "free2");
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_v2_05));
            tweenGroup.add(tween_v2_05);
            break;
        case "c2-Yeah！": // ルカ・カイト
            whiteFadeIn(1000);
            shutterFadeOut(1000);
            break;
        case "c2-もう正解なんてない": // 全員
            disableAllSpectrum();

            setFreeRotation(0, 0, 0 );
            setFreePosition(-2.5, 1, -3);
            switchCamera("free");
            const tween_c2_01 = new Tween({z: -3, y: 1}).to({z: -7, y:1.5}, 7000).start().onUpdate(pos => {
                setFreePosition(-2.5, pos.y, pos.z, "free")
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_c2_01));
            tweenGroup.add(tween_c2_01);
            whiteFadeOut(500);
            break;
        case "c2-奏でた今日が": // 全員
            setArcTargetPosition(-2.5, 0.5, -0.5);
            setArcSphericalCoordinates(-15, 90, 3);
            setCameraMinZ(1.5, "arc");
            switchCamera('arc');
            const tween_2c_02 = new Tween({alpha: -15}).to({alpha: -180}, 4000).start().onUpdate(prop => {
                setArcAlpha(prop.alpha);
            }).onComplete(() => tweenGroup.remove(tween_2c_02));
            tweenGroup.add(tween_2c_02);
            break;
        case "c2-僕らの道だ": // メイコ
            break;
        case "c2-ずっと手放したくないんだ": // リン
            break;
        case "c2-“アイ”": // リン
            setFreeRotation(0, 90, 90);
            setFreePosition(-2.5, 4.5, -0.5);
            switchCamera("free");
            const tween_2c_03 = new Tween({x: -2.5}).to({x: -1}, 1000).start().onUpdate(pos => {
                setFreePosition(pos.x, 4.5, -0.5, "free")
            }).onComplete(() => tweenGroup.remove(tween_2c_03));
            tweenGroup.add(tween_2c_03);
            break;
        case "c2-いつだって願いを歌えば": // 全員
            setFreeRotation(160, -5, -0.3, "free2");
            setFreePosition(-1.9, 0.1, 2, "free2");
            setCameraMinZ(0.1, "free2");
            switchCamera("free2");
            const tween_2c_04 = new Tween({y: 0.1, pitch: -5}).to({y: 0.3, pitch: -15}, 4000).start().onUpdate(props => {
                setFreePosition(-1.9, props.y, 2, "free2");
                setFreeRotation(160, props.pitch, -0.3, "free2");
            }).onComplete(() => tweenGroup.remove(tween_2c_04));
            tweenGroup.add(tween_2c_04);
            break;
        case "c2-君に会える": // カイト
            break;
        case "c2-最高のステージ": // ルカ
            break;
        case "c2-夢はもう譲れないんじゃない？": // レン
            setFreeRotation(0, 0, 0);
            setFreePosition(-2.5, 1.5, -4);
            switchCamera("free");
            const tween_2c_07 = new Tween({z: -4, y: 1.5}).to({z: -30, y:3}, 9000).start().onUpdate(pos => {
                setFreePosition(-2.5, pos.y, pos.z, "free")
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_2c_07));
            tweenGroup.add(tween_2c_07);
            break;
        case "零れたメモリを誘って": // ミク・カイト
            shutterFadeIn(1000);
            enableCircleRipple();
            break;
        case "Twilighttotellus": // ルカ・リン
            break;
        case "Starlighttotellus": // レン・メイコ
            await delayForMilSeconds(3000);
            whiteFadeIn(1000);
            shutterFadeOut(1000);
            break;
        case "lc-終わりなんて": // 全員
            disableAllRipple();
        
            setModelVisibility("sky", true);
            setModelVisibility("dotmiku-tanabata", true);
            setModelVisibility("dotmiku", true);
            enableStarParticles();
            neverEndTextFadeIn(0);
            break;
        case "lc-ない": // 全員
            setArcTargetPosition(-2.5, 0.5, -0.5);
            setArcSphericalCoordinates(-15, 90, 3);
            setCameraMinZ(1.5, "arc");
            switchCamera('arc');
            const tween_lc_02 = new Tween({alpha: -15}).to({alpha: -180}, 4000).start().onUpdate(prop => {
                setArcAlpha(prop.alpha);
            }).onComplete(() => tweenGroup.remove(tween_lc_02));
            tweenGroup.add(tween_lc_02);            
            whiteFadeOut(500);
            neverEndTextFadeOut(500);
            break;
        case "lc-この手掴めばまた始まるんだ": // ルカ
            break;
        case "lc-グシャグシャのまま描いた": // ミク
            break;
        case "lc-“アイ”": // ミク
            setFreeRotation(0, 90, 90);
            setFreePosition(-2.5, 4.5, -0.5);
            switchCamera("free");
            const tween_lc_03 = new Tween({x: -2.5}).to({x: -1}, 1000).start().onUpdate(pos => {
                setFreePosition(pos.x, 4.5, -0.5, "free")
            }).onComplete(() => tweenGroup.remove(tween_lc_03));
            tweenGroup.add(tween_lc_03);
            break;
        case "lc-It'sallright！": // 全員
            setFreeRotation(160, -5, -0.3, "free2");
            setFreePosition(-1.9, 0.1, 2, "free2");
            setCameraMinZ(0.1, "free2");
            switchCamera("free2");
            const tween_lc_04 = new Tween({y: 0.1, pitch: -5}).to({y: 0.3, pitch: -15}, 4000).start().onUpdate(props => {
                setFreePosition(-1.9, props.y, 2, "free2");
                setFreeRotation(160, props.pitch, -0.3, "free2");
            }).onComplete(() => tweenGroup.remove(tween_lc_04));
            tweenGroup.add(tween_lc_04);
            break;
        case "lc-灯した歌は君に届く": // 全員・レン
            break;
        case "lc-躊躇いはない": // カイト
            break;
        case "lc-そう、一人じゃないから": // リン
            setFreeRotation(-17, 10, 0, "free2");
            setFreePosition(1, 1, -7, "free2");
            setCameraMinZ(0.1, "free2");
            switchCamera("free2");
            break;
        case "lc-(鼓動)": // 全員
            enableCircleRipple();

            setFreeRotation(43, -10, 4);
            setFreePosition(-4.8, 0.72, 2.6);
            setCameraMinZ(0.1, "free");
            switchCamera("free");
            break;
        case "lc-(心)": // 全員
            enableSquareRipple();

            setFreeRotation(-35, 18, 0.5);
            setFreePosition(-3.25, 1, 2.55);
            break;
        case "lc-(不可能を超えてゆけ)": // 全員
            setFreeRotation(70, 15, 0.5);
            setFreePosition(-1.3, 0.7, 0.8);
            const tween_lc_07 = new Tween({z: 0.8}).to({z: 1.3}, 3500).start().onUpdate(props => {
                setFreePosition(-1.3, 0.7, props.z, "free");
            }).onComplete(() => tweenGroup.remove(tween_lc_07));
            tweenGroup.add(tween_lc_07);
            break;
        case "lc-曖昧な夢さえも抱いて": // メイコ
            setFreeRotation(0, 75, 0, "free2");
            setFreePosition(-2.45, 1.5, -0.5, "free2");
            setCameraMinZ(0.1, "free2");
            switchCamera("free2");
            const tween_lc_08 = new Tween({y: 1.3}).to({y: 1.75}, 6000).start().onUpdate(props => {
                setFreePosition(-2.45, props.y, -0.5, "free2");
            }).onComplete(() => tweenGroup.remove(tween_lc_08));
            tweenGroup.add(tween_lc_08);
            break;
        case "lc-(踊る)": // 全員
            disableAllRipple();
            enableVerticalSpectrum();

            setFreeRotation(43, -10, 4);
            setFreePosition(-4.8, 0.72, 2.6);
            setCameraMinZ(0.1, "free");
            switchCamera("free");
            break;
        case "lc-(震える)": // 全員
            enableHorizontalSpectrum();

            setFreeRotation(-35, 18, 0.5);
            setFreePosition(-3.25, 1, 2.55);
            break;
        case "lc-(重なる想いだけ)": // 全員
            enableCircleSpectrum();

            setFreeRotation(70, 15, 0.5);
            setFreePosition(-1.3, 0.7, 0.8);
            const tween_lc_09 = new Tween({z: 0.8}).to({z: 1.3}, 3500).start().onUpdate(props => {
                setFreePosition(-1.3, 0.7, props.z, "free");
            }).onComplete(() => tweenGroup.remove(tween_lc_09));
            tweenGroup.add(tween_lc_09);
            break;
        case "lc-あふれるストーリーに乗せて": // ルカ
            setFreeRotation(0, 0, 0);
            setFreePosition(-2.5, 1.5, -4);
            switchCamera("free");
            const tween_lc_10 = new Tween({z: -4, y: 1.5}).to({z: -30, y:3}, 9000).start().onUpdate(pos => {
                setFreePosition(-2.5, pos.y, pos.z, "free")
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_lc_10));
            tweenGroup.add(tween_lc_10);
            break;
        case "咲かせた未来のその先へ": // ミク
            enableCircleRipple();
            enableSquareRipple();
            await delayForMilSeconds(10000);
            disableAllRipple();
            disableAllSpectrum();
            break;
    }
}
