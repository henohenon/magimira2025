import { Color3 } from "@babylonjs/core/Maths/math.color";

import {
    setArcAlpha,
    setArcSphericalCoordinates,
    setArcTargetPosition,
    setCameraMinZ,
    setFreePosition,
    setFreeRotation,
    switchCamera,
    switchCameraWithCrossFade
} from "~/lib/babylon/camera";
import {setModelRotation, setModelPosition} from "~/lib/babylon/mdl";
import {
    setLightDiffuse,
    setLightIntensity
} from "~/lib/babylon/light";
import { delayForMilSeconds } from "~/lib/update";

import { setLightingPreset } from "./light";
import {events as gameEvents} from "./events";
import {
    neverEndTextFadeIn,
    neverEndTextFadeOut,
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
    disableAllSpectrum
} from "~/game/spectrum.ts";
import {disableAllRipple, enableCircleRipple} from "~/game/ripple.ts";
import { Easing, Tween } from "@tweenjs/tween.js";
import { tweenGroup } from "~/lib/update/cycle.ts";

setLightingPreset("night");
switchCamera("free");
setFreePosition(-2.5, 1.5, -8);
setFreeRotation(0, 0, 0);
disableAllSpectrum();
disableAllRipple();

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

gameEvents.on("onLoaded", async ()=>{
    // setModelPosition("dotmiku", -2.5, 0 , -1);
    // setModelRotation("dotmiku", 0, 0, 0);
    setModelPosition("room", -2.1, 0 , 0);
    setModelRotation("room", 0, 0, 0);
    setFreePosition(-2.5, 1, -2);
    setFreeRotation(0, 25, 0);
    enableCircleRipple();

    await delayForMilSeconds(1000);
    audio.play();
    await delayForMilSeconds(500);
    setLightDiffuse("hemispheric", templateColors["default"]);
    setLightIntensity("hemispheric", 0.8);
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
            break;
        case "再起動theothernight": // メイコ
            break;
        case "(Don’tyouknow？)": // カイト
            setFreeRotation(-135, 20, 0, "free2");
            setFreePosition(0.3, 1, 0, "free2");
            const tween_v1_02 = new Tween({x: 0.3, z: 0}).to({x: -1, z: 1.5}, 9000).start().onUpdate(pos => {
                setFreePosition(pos.x, 1, pos.z, "free2");
            }).onComplete(() => tweenGroup.remove(tween_v1_02));
            tweenGroup.add(tween_v1_02);
            shutterIn(500).onComplete(()=>{
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
            setFreeRotation(80, 0, 0);
            setFreePosition(-1, 1.1, 0.8);
            const tween_v1_03 = new Tween({z: 0.8}).to({z: 1.8}, 6000).start().onUpdate(pos => {
                setFreePosition(-1, 1, pos.z);
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
            setFreeRotation(-95, 0, 0 );
            setFreePosition(-3, 0.5,-2);
            switchCamera("free");
            const tween_v1_05 = new Tween({z: -2}).to({z: -1.5}, 5000).start().onUpdate(pos => {
                setFreePosition(-3, 0.5, pos.z, "free");
            }).onComplete(() => tweenGroup.remove(tween_v1_05));
            tweenGroup.add(tween_v1_05);
            break;
        case "不安感だって攫っていく未来にrideon": // リンレン
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
            setFreeRotation(0, 0, 0 );
            setFreePosition(-2.5, 1, -3);
            switchCamera("free");
            const tween_c1_01 = new Tween({z: -3, y: 1}).to({z: -7, y:1.5}, 7000).start().onUpdate(pos => {
                setFreePosition(-2.5, pos.y, pos.z, "free")
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_c1_01));
            tweenGroup.add(tween_c1_01);
            whiteFadeOut(500);
            neverEndTextFadeOut(500);
            break;
        case "c1-この手掴めば": // 全員
        break;
        case "c1-また始まるんだ": // ルカ
            setArcTargetPosition(-2.5, 0.5, -0.5);
            setArcSphericalCoordinates(-15, 90, 3);
            setCameraMinZ(1.5, "arc");
            switchCamera('arc');
            const tween_c1_02 = new Tween({alpha: -15}).to({alpha: -180}, 4000).start().onUpdate(prop => {
                setArcAlpha(prop.alpha);
            }).onComplete(() => tweenGroup.remove(tween_c1_02));
            tweenGroup.add(tween_c1_02);
        break;
        case "c1-グシャグシャのまま描いた": // ミク
        break;
        case "c1-“アイ”": // ミク
            setFreeRotation(0, 90, 90);
            setFreePosition(-2.5, 4.5, -0.5);
            switchCamera("free");
            const tween_c1_03 = new Tween({x: -2.5}).to({x: -1}, 1000).start().onUpdate(pos => {
                setFreePosition(pos.x, 4.5, -0.5, "free")
            }).onComplete(() => tweenGroup.remove(tween_c1_03));
            tweenGroup.add(tween_c1_03);
            break;
        case "c1-It'sallright！": // 全員
            setFreeRotation(160, -5, -0.3, "free2");
            setFreePosition(-1.9, 0.1, 2, "free2");
            setCameraMinZ(0.1, "free2");
            switchCamera("free2");
            const tween_c1_04 = new Tween({y: 0.1, pitch: -5}).to({y: 0.3, pitch: -15}, 4000).start().onUpdate(props => {
                setFreePosition(-1.9, props.y, 2, "free2");
                setFreeRotation(160, props.pitch, -0.3, "free2");
            }).onComplete(() => tweenGroup.remove(tween_c1_04));
            tweenGroup.add(tween_c1_04);
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
            break;
        case "c1-(鼓動)": // 全員
            setFreeRotation(43, -10, 4);
            setFreePosition(-4.8, 0.72, 2.6);
            setCameraMinZ(0.1, "free");
            switchCamera("free");
            break;
        case "c1-(心)": // 全員
            setFreeRotation(-35, 18, 0.5);
            setFreePosition(-3.25, 1, 2.55);
            break;
        case "c1-(不可能を超えてゆけ)": // 全員
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
            setFreeRotation(43, -10, 4);
            setFreePosition(-4.8, 0.72, 2.6);
            setCameraMinZ(0.1, "free");
            switchCamera("free");
            break;
        case "c1-(震える)": // 全員
            setFreeRotation(-35, 18, 0.5);
            setFreePosition(-3.25, 1, 2.55);
            break;
        case "c1-(重なる想いだけ)": // 全員
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
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_c1_01));
            tweenGroup.add(tween_c1_10);
            break;
        case "立ち尽くす街角": // ミク
            setFreeRotation(-45, 20, 0, "free2");
            setFreePosition(-1, 1, -3, "free2");
            switchCameraWithCrossFade("free2", 1000);
            const tween_v2_01 = new Tween({x: -1, z: -3}).to({x: 0.3, z: 0}, 18000).start().onUpdate(pos => {
                setFreePosition(pos.x, 1, pos.z, "free2");
            }).onComplete(() => tweenGroup.remove(tween_v1_01));
            tweenGroup.add(tween_v2_01);
            break;
        case "どれほど間違っても": // レン
            break;
        case "この灯火は何度だって輝く": // メイコ
            break;
        case "(宿すagainstgravity)": // カイト
            setFreeRotation(-135, 20, 0);
            setFreePosition(0.3, 1, 0);
            const tween_v2_02 = new Tween({x: 0.3, z: 0}).to({x: -1, z: 1.5}, 9000).start().onUpdate(pos => {
                setFreePosition(pos.x, 1, pos.z);
            }).onComplete(() => tweenGroup.remove(tween_v2_02));
            tweenGroup.add(tween_v2_02);
            shutterIn(500).onComplete(()=>{
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
            setFreeRotation(80, 0, 0, "free2");
            setFreePosition(-1, 1.1, 0.8, "free2");
            const tween_v2_03 = new Tween({z: 0.8}).to({z: 1.8}, 6000).start().onUpdate(pos => {
                setFreePosition(-1, 1, pos.z, "free2");
            }).onComplete(() => tweenGroup.remove(tween_v1_03));
            tweenGroup.add(tween_v2_03);
            switchCameraWithCrossFade('free2', 1000);
            break;
        case "言葉の飾り毎秒更新": // メイコ
            setFreeRotation(-95, 0, 0);
            setFreePosition(-3, 0.5,-2);
            switchCamera("free");
            const tween_v2_04 = new Tween({z: -2}).to({z: -1.5}, 5000).start().onUpdate(pos => {
                setFreePosition(-3, 0.5, pos.z, "free");
            }).onComplete(() => tweenGroup.remove(tween_v2_04));
            tweenGroup.add(tween_v2_04);
            break;
        case "揺らぐ主役舞台は未知の最前線": // ルカ・カイト
            setFreeRotation(0, 40, 0, "free2");
            setFreePosition(-4, 2, 0.8, "free2");
            switchCamera("free2");
            const tween_v2_05 = new Tween({pitch: 40, y: 2, z: 0.8}).to({pitch: -10, y:0.8, z: 1.3}, 10000).start().onUpdate(props => {
                setFreeRotation(0, props.pitch, 0, "free2");
                setFreePosition(-4, props.y, props.z, "free2");
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_v2_05));
            tweenGroup.add(tween_v2_05);
            break;
        case "c2-Yeah!": // ルカ・カイト
            whiteFadeIn(1000);
            shutterFadeOut(1000);
            break;
        case "c2-もう正解なんてない": // 全員
            setFreeRotation(0, 0, 0 );
            setFreePosition(-2.5, 1, -3);
            switchCamera("free");
            const tween_c2_01 = new Tween({z: -3, y: 1}).to({z: -7, y:1.5}, 7000).start().onUpdate(pos => {
                setFreePosition(-2.5, pos.y, pos.z, "free")
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_c1_01));
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
            break;
        case "Twilighttotellus": // ルカ・リン
            break;
        case "Starlighttotellus": // レン・メイコ
            break;
        case "lc-終わりなんてない": // 全員
            neverEndTextFadeIn(0);
            break;
        case "lc-この手掴めばまた始まるんだ": // ルカ
            setArcTargetPosition(-2.5, 0.5, -0.5);
            setArcSphericalCoordinates(-15, 90, 3);
            setCameraMinZ(1.5, "arc");
            switchCamera('arc');
            const tween_lc_02 = new Tween({alpha: -15}).to({alpha: -180}, 4000).start().onUpdate(prop => {
                setArcAlpha(prop.alpha);
            }).onComplete(() => tweenGroup.remove(tween_lc_02));
            tweenGroup.add(tween_lc_02);
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
            setFreeRotation(43, -10, 4);
            setFreePosition(-4.8, 0.72, 2.6);
            setCameraMinZ(0.1, "free");
            switchCamera("free");
            break;
        case "lc-(心)": // 全員
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
            setFreeRotation(43, -10, 4);
            setFreePosition(-4.8, 0.72, 2.6);
            setCameraMinZ(0.1, "free");
            switchCamera("free");
            break;
        case "lc-(震える)": // 全員
            setFreeRotation(-35, 18, 0.5);
            setFreePosition(-3.25, 1, 2.55);
            break;
        case "lc-(重なる想いだけ)": // 全員
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
        case "咲かせた未来の先へ": // ミク
            break;
    }
}
