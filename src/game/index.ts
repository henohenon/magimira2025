import { Easing, Tween } from "@tweenjs/tween.js";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import {Vector3} from "@babylonjs/core/Maths/math.vector";

import {
    getFreeCamera,
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
import {setModelRotation, setModelVisibility, playAnimation, getRootMesh, starModels} from "~/lib/babylon/mdl";
import {
    getLightDiffuse,
    setLightDiffuse,
    setLightIntensity
} from "~/lib/babylon/light";
import { delayForMilSeconds } from "~/lib/update";
import { tweenGroup } from "~/lib/update/cycle.ts";
import { disableStarParticles, enableStarParticles } from "~/lib/babylon/star-particle.ts";
import { templateColors } from "~/index.ts";

import { setLightingPreset } from "./light";
import {events as gameEvents} from "./events";
import {
    endWrapperFadeIn,
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
import { scene } from "~/lib/babylon/index.ts";


const baseUrl = import.meta.env.VITE_BASE_URL;

const lightSwitch = new Audio(`${baseUrl}電気のスイッチを入れる.mp3`);
lightSwitch.volume = 0.45;
const street = new Audio(`${baseUrl}閑静な住宅街1.mp3`);
street.volume = 0.18;
street.loop = true;
street.addEventListener("canplaythrough", () => {
    console.log("can play");
    street.play();
});
const doorOpen = new Audio(`${baseUrl}ドアを閉める1.mp3`);
doorOpen.volume = 0.15;
const doorClose = new Audio(`${baseUrl}ドアを閉める2.mp3`);
doorClose.volume = 0.11;

const audios = [
    lightSwitch,
    street,
    doorOpen,
    doorClose,
];

const free1 = getFreeCamera("free");
const free2 = getFreeCamera("free2");
// const arc2 = getArcCamera("arc");
// const arc = getArcCamera("arc2");

setFreePosition(0, 1.1, 2.1);
setFreeRotation(180, 32, 0);
switchCamera("free");
setLightingPreset("night");
setCameraMinZ(0.001, "free");
setCameraMinZ(0.001, "free2");

disableAllSpectrum();
disableAllRipple();


let mikuModel: AbstractMesh | undefined = undefined;
let roomModel: AbstractMesh | undefined = undefined;
let tanabataModel: AbstractMesh | undefined = undefined;
let skyModel: AbstractMesh | undefined = undefined;

let skipOpening: () => void = () => {};
let finishOpening = false;
gameEvents.on("onLoaded", async ()=>{
    mikuModel = getRootMesh("dotmiku");
    roomModel = getRootMesh("room");
    const pcOpen = scene.getMeshByName("pc-display-open");
    const pcClose = scene.getMeshByName("pc-display-close");    
    const pcDisplay = scene.getMeshByName("pc-display");
    if(!pcOpen || !pcClose || !pcDisplay) throw Error("pc-display-open, pc-display, pc-display-close not found");
    pcOpen.visibility = 0;
    pcClose.visibility = 1;
    pcDisplay.isVisible = false;
    for(const star of Object.values(starModels).flat()){
        star.setEnabled(false);
    }

    console.log(roomModel);
    roomModel.setEnabled(true);

    const miku_fadeIn = new Tween({ visibility: 0 }).to({ visibility: 1 }, 300)
    .onUpdate((e) => setModelVisibility("dotmiku", e.visibility))
    const miku_fadeOut = new Tween({ visibility: 1 }).to({ visibility: 0 }, 300)
    .onUpdate((e) => setModelVisibility("dotmiku", e.visibility))
    tweenGroup.add(miku_fadeOut, miku_fadeIn);
    
    enableCircleRipple();

    async function delayWithSkip(ms: number) {
        return new Promise<void>(async (resolve, reject) => {
            skipOpening = reject;
            await delayForMilSeconds(ms);
            skipOpening = () => {};
            resolve();
        });
    }

    let mikuModelVisible = false;
    let isLight = false;
    setModelVisibility("dotmiku", 0);
    mikuModel.setEnabled(true);

    try{
        if(isStart) throw Error();
        await delayWithSkip(1000);
        if(isStart) throw Error();

        doorOpen.play();
        street.volume = 0.3;
        const streetVolTween = new Tween({ volume: 0.3 }).to({ volume: 0.18 }, 2250).start()
        .onUpdate((e) => street.volume = e.volume)
        .onComplete(() => tweenGroup.remove(streetVolTween));
        tweenGroup.add(streetVolTween);
        if(isStart) throw Error();
        await delayWithSkip(1500);
        if(isStart) throw Error();

        lightSwitch.play();
        setLightDiffuse("hemispheric", templateColors["default"]);
        setLightIntensity("hemispheric", 0.8);
        isLight = true;
        if(isStart) throw Error();
        await delayWithSkip(2700);
        if(isStart) throw Error();
        doorClose.play();
        if(isStart) throw Error();
        await delayWithSkip(800);
        
        if(isStart) throw Error();
        playAnimation("dotmiku", "walk1");
        mikuModel.position = new Vector3(-0.5, 0, 0.5);
        setModelRotation(mikuModel, 0, -90, 0);
        miku_fadeIn.start();
        await delayForMilSeconds(300);
        mikuModelVisible = true;
        if(isStart) throw Error();
        await delayWithSkip(1500);
        
        if(isStart) throw Error();
        miku_fadeOut.start();
        await delayForMilSeconds(300);
        mikuModelVisible = false;
        
        if(isStart) throw Error();
        playAnimation("dotmiku", "walk2");
        mikuModel.position = new Vector3(-0.07, 0, 0.5);
        setModelRotation(mikuModel, 0, -90, 0);
        miku_fadeIn.start();
        await delayForMilSeconds(300);
        mikuModelVisible = true;
        if(isStart) throw Error();
        await delayWithSkip(1200);
    }catch(e){
    }

    if(mikuModelVisible){
        miku_fadeOut.start();
        await delayForMilSeconds(300);
    }
    if(!isLight){
        const initLightTween = new Tween({ intensity: 0.08, color: getLightDiffuse("hemispheric")})
        .to({ intensity: 0.8, color: templateColors["default"]}, 1000).start()
        .onUpdate((e) => {
            setLightIntensity("hemispheric", e.intensity);
            setLightDiffuse("hemispheric", e.color);
        })
        .onComplete(() => tweenGroup.remove(initLightTween));
        tweenGroup.add(initLightTween);
    }

    mikuModel.position = Vector3.Zero();
    setModelRotation(mikuModel, 0, -180, 0);
    playAnimation("dotmiku", "sitdown");
    miku_fadeIn.start();
    await delayForMilSeconds(700);
    tweenGroup.remove(miku_fadeIn, miku_fadeOut);

    const pcOpenFadeIn = new Tween({ visibility: 0 }).to({ visibility: 1 }, 1500).start()
    .onUpdate((e) => {
        pcOpen.visibility = e.visibility;
    })
    .onComplete(() => tweenGroup.remove(pcOpenFadeIn));
    tweenGroup.add(pcOpenFadeIn);
    const pcCloseFadeOut = new Tween({ visibility: 1 }).to({ visibility: 0 }, 1500).start()
    .onUpdate((e) => pcClose.visibility = e.visibility)
    .onComplete(() => tweenGroup.remove(pcCloseFadeOut));
    tweenGroup.add(pcCloseFadeOut);
    await delayForMilSeconds(1500);
    pcDisplay.isVisible = true;
    finishOpening = true;

    startAnimation();
});

let startListening = false;
function startAnimation(){
    if(!startListening && isStart && finishOpening) {
        startListening = true;
        playAnimation("dotmiku", "listen");
        return;
    }
}

let isStart = false;
gameEvents.on("onGameStart", async () => {
    for(const audio of audios) {
        audio.pause();
        audio.volume = 0;
        audio.src = "";
        audio.load();
    }
    isStart = true;
    skipOpening();

    startAnimation();
});


// Listen for key frame events
gameEvents.on("onKeyFrame", ({key}) => {
    updateView(key.name);
});

const updateView = async (viewKey: string) => {
    switch(viewKey) {
        case "Sotellusストリートライト": // 全員
            for(const star of starModels["verse1"]){
                star.setEnabled(true);
            }
            setFreeRotation(-155, 10, 0, "free2");
            setFreePosition(1.5, 1.1, 4, "free2");
            free2.fov = Math.PI / 4;
            switchCamera("free2");
            await delayForMilSeconds(2700);
            for(const star of starModels["verse1"]){
                star.setEnabled(false);
            }
            break;
        case "揺らめく都市のmagic": // リン
            setFreeRotation(120, 20, 0);
            setFreePosition(0.5, 0.8, 3.2);
            switchCamera("free");
            const tween_v1_01 = new Tween({x: 0.5, z: 3.2}).to({x: -2, z: 1}, 18000).start().onUpdate(pos => {
                free1.position.x = pos.x;
                free1.position.z = pos.z;
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
            disableAllRipple();
            enableVerticalSpectrum();

            setFreeRotation(-104, 0, 84);
            free1.position = new Vector3(-2.8, 1, -1.8);
            setCameraMinZ(0.01, "free");
            const tween_v1_03 = new Tween({z: -1.8}).to({z: -3.4}, 8000).start().onUpdate(pos => {
                free1.position.z = pos.z;
            }).onComplete(() => tweenGroup.remove(tween_v1_03));
            tweenGroup.add(tween_v1_03);
            switchCameraWithCrossFade('free', 1000);
            break;
        case "めくるめくこの雑踏をかき分けていく": // メイコ
            break;
        case "光差す道を目指して": // ミク
            setCameraMinZ(0.01, "free2");
            setFreeRotation(105, 47, 7, "free2");
            setFreePosition(2.1, 1, -2.9, "free2");
            switchCamera("free2");
            const tween_v1_04 = new Tween({z: -2.9}).to({z: -2.6}, 5000).start().onUpdate(pos => {
                free2.position.z = pos.z;
            }).onComplete(() => tweenGroup.remove(tween_v1_04));
            tweenGroup.add(tween_v1_04);
            break;
        case "空回る今だって僕らの祈り毎秒更新": // カイト
            setFreeRotation(40, 11, 0);
            setFreePosition(-2.65, 1.2, -3.3);
            setCameraMinZ(0.001, "free");
            switchCamera("free");
            const tween_v1_05 = new Tween({x: -2.65, z:-3.3}).to({x: -2.3, z:-4}, 5000).start().onUpdate(pos => {
                free1.position.x = pos.x;
                free1.position.z = pos.z;
            }).onComplete(() => tweenGroup.remove(tween_v1_05));
            tweenGroup.add(tween_v1_05);
            break;
        case "不安感だって攫っていく未来にrideon": // リンレン
            disableAllSpectrum();
            enableCircleSpectrum();

            setFreeRotation(180, 40, 0, "free2");
            free2.position = new Vector3(1.7, 2, -2);
            switchCamera("free2");
            const tween_v1_06 = new Tween({pitch: 40, y: 2, z: -2}).to({pitch: -10, y:1, z: -2.5}, 10000).start().onUpdate(props => {
                setFreeRotation(180, props.pitch, 0, "free2");
                free2.position.y = props.y;
                free2.position.z = props.z;
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

            setArcTargetPosition(0, 0.5, 0);
            setArcSphericalCoordinates(90, 80, 2)
            switchCamera("arc");
            const tween_c1_01 = new Tween({radius: 2}).to({radius: 8}, 9000).start().onUpdate(pos => {
                setArcRadius(pos.radius);
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_c1_01));
            tweenGroup.add(tween_c1_01);
            whiteFadeOut(500);
            neverEndTextFadeOut(500);

            playAnimation("dotmiku", "stand");
            break;
        case "c1-この手掴めば": // 全員
            playAnimation("dotmiku", "grab-hand");
        break;
        case "c1-また始まるんだ": // ルカ
            playAnimation("dotmiku", "grab-to-heart");
        break;
        case "c1-グシャグシャのまま描いた": // ミク
            disableArcCameraControl();
            enableAiCameraControl();

            setFreeRotation(0, 0, 0);
            setFreePosition(0, 0.5, -5);
            switchCamera("free");
            break;
        case "c1-“アイ”": // ミク
            break;
        case "c1-It'sallright！": // 全員
            playAnimation("dotmiku", "heart-to-shake");
            disableAiCameraControl();

            enableDropStar();

            setFreeRotation(180, -10, 0, "free2");
            setFreePosition(0, 1.5, 5, "free2");
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
            playAnimation("dotmiku", "shake-to-raise");
            break;
        case "c1-君に届く": // レン
            playAnimation("dotmiku", "raise-to-stand");
            break;
        case "c1-躊躇いはない": // カイト
            setFreeRotation(90, 0, 0, "free2");
            setFreePosition(-0.7, 1.6, 0, "free2");
            playAnimation("dotmiku", "stand-to-face-raise");
            break;
        case "c1-そう、一人じゃないから": // リン
            playAnimation("dotmiku", "face-raise-to-one-hand-raise");
            setFreePosition(0, 0.5, 7, "free2");
            setFreeRotation(180, -20, 0, "free2");
            
            await delayForMilSeconds(1000);
            const c1SouTween = new Tween({y: 0.5}).to({y: 2.8}, 2000).start().onUpdate(e =>
                free2.position.y = e.y
            ).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(c1SouTween));
            tweenGroup.add(c1SouTween);
            break;
        case "c1-(鼓動)": // 全員
            shutterFadeIn(1000);
            enableCircleRipple();

            setFreeRotation(90, 0, 0);
            setFreePosition(1.5, 0.5, 1.3);
            setCameraMinZ(0.1, "free");
            switchCamera("free");
            const c1KodouTween = new Tween({z: 1.3}).to({z: 0.8}, 1125).start().onUpdate(e =>
                free1.position.z = e.z
            ).onComplete(() => tweenGroup.remove(c1KodouTween));
            tweenGroup.add(c1KodouTween);
            break;
        case "c1-(心)": // 全員
            disableAllRipple();
            enableSquareRipple();
            const c1KokoroTween = new Tween({y: 0.5}).to({y: 1.5}, 850).start().onUpdate(e =>
                free1.position.y = e.y
            ).onComplete(() => tweenGroup.remove(c1KokoroTween));
            tweenGroup.add(c1KokoroTween);
            break;
        case "c1-(不可能を超えてゆけ)": // 全員
            enableCircleRipple();

            const c1HukanouTween = new Tween({z: 0.8}).to({z: 1.3}, 3000).start().onUpdate(e =>
                free1.position.z = e.z
            ).onComplete(() => tweenGroup.remove(c1HukanouTween));
            tweenGroup.add(c1HukanouTween);
            break;
        case "c1-曖昧な夢さえも抱いて": // メイコ
            playAnimation("dotmiku", "sleep");
            if(mikuModel) {
                mikuModel.position.z = 0.3;
                mikuModel.position.x = -0.05;
            }
            setFreeRotation(180, 90, 0, "free2");
            setFreePosition(-0.1, 3, -0.1, "free2");
            switchCamera("free2");
            const tween_c1_08 = new Tween({y: 3}).to({y: 4.5}, 8000).start().onUpdate(props => {
                free2.position.y = props.y;
            }).onComplete(() => tweenGroup.remove(tween_c1_08));
            tweenGroup.add(tween_c1_08);
            break;
        case "c1-(踊る)": // 全員
            mikuModel?.setEnabled(false);
            disableAllRipple();
            enableVerticalSpectrum();

            setFreeRotation(180, 0, 0);
            setFreePosition(2.3, 2, 3);
            setCameraMinZ(0.1, "free");
            switchCamera("free");
            const c1OdoruTween = new Tween({z: 3}).to({z:  0}, 1000).start().onUpdate(props => {
                free1.position.z = props.z;
            }).onComplete(() => tweenGroup.remove(c1OdoruTween));
            tweenGroup.add(c1OdoruTween);

            break;
        case "c1-(震える)": // 全員
            enableHorizontalSpectrum();
            
            setFreeRotation(-75, 0, 0, "free2");
            setFreePosition(2, 0.8, 0.8, "free2");
            switchCamera("free2");
            const c1HurueruTween = new Tween({x: 2, z: 0.4}).to({x: 0, z: 0.8}, 1500).start().onUpdate(props => {
                free2.position.z = props.z;
                free2.position.x = props.x;
            }).onComplete(() => tweenGroup.remove(c1HurueruTween));
            tweenGroup.add(c1HurueruTween);
            break;
        case "c1-(重なる想いだけ)": // 全員
            enableCircleSpectrum();

            setFreeRotation(-150, 0, 0);
            setFreePosition(-1.5, 1, -0.4);
            switchCamera("free");
            const tween_c1_09 = new Tween({z: -0.4}).to({z: -1.5}, 5500).start().onUpdate(props => {
                free1.position.z = props.z;
            }).onComplete(() => tweenGroup.remove(tween_c1_09));
            tweenGroup.add(tween_c1_09);
            break;
        case "c1-あふれるストーリーに乗せて": // ルカ
            setArcTargetPosition(0, 0, 0);
            setArcSphericalCoordinates(180, 70, 25)
            switchCamera("arc");
            const tween_c1_10 = new Tween({alpha: 180}).to({alpha: -180}, 5000).start().onUpdate(prop => {
                setArcAlpha(prop.alpha);
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_c1_10));
            tweenGroup.add(tween_c1_10);
            break;
        case "立ち尽くす街角": // ミク
            if(mikuModel){
                mikuModel?.setEnabled(true);
            }
            playAnimation("dotmiku", "sitdown");
            disableAllSpectrum();
            enableCircleRipple();

            setFreeRotation(-120, 20, 0, "free2");
            setFreePosition(-0.7, 0.8, 3.2, "free2");
            switchCamera("free2");
            const tween_v2_01 = new Tween({x: -0.7, z: 3.2}).to({x: 1.8, z: 1}, 10000).start().onUpdate(pos => {
                free2.position.x = pos.x;
                free2.position.z = pos.z;
            }).onComplete(() => tweenGroup.remove(tween_v2_01));
            tweenGroup.add(tween_v2_01);
            break;
        case "どれほど間違っても": // レン
            break;
        case "この灯火は何度だって輝く": // メイコ
            break;
        case "(宿すagainstgravity)": // カイト
            setFreeRotation(135, 20, 0);
            setFreePosition(-0.5, 1, 0);
            const tween_v2_02 = new Tween({x: -0.5, z: 0}).to({x: 0.8, z: 1.5}, 10000).start().onUpdate(pos => {
                setFreePosition(pos.x, 1, pos.z);
            }).onComplete(() => tweenGroup.remove(tween_v2_02));
            tweenGroup.add(tween_v2_02);
            shutterIn(500).onComplete(()=>{
                disableAllSpectrum();
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

            setFreeRotation(90, -5, 0, "free2");
            setFreePosition(1.45, 0.1, 0.05, "free2");
            setCameraMinZ(0.01, "free2");
            const tween_v2_03 = new Tween({y: 0.1}).to({y: 1.2}, 10000).start().onUpdate(pos => {
                free2.position.y = pos.y
            }).onComplete(() => tweenGroup.remove(tween_v2_03));
            tweenGroup.add(tween_v2_03);
            switchCameraWithCrossFade('free2', 1000);
            break;
        case "言葉の飾り毎秒更新": // メイコ
            break;
        case "揺らぐ主役舞台は未知の最前線": // ルカ・カイト
            disableAllSpectrum();
            enableVerticalSpectrum();

            setFreeRotation(-23, 23, 0, "free2");
            setFreePosition(-0.8, 0.8, -2, "free2");
            setCameraMinZ(0.001, "free2");
            switchCamera("free2");
            const tween_v2_05 = new Tween({yaw: -23, x: -0.8, z: -2}).to({yaw: -53, x: -1.2, z: -1}, 10000).start().onUpdate(props => {
                setFreeRotation(props.yaw, 23, 0, "free2");
                free2.position.x = props.x;
                free2.position.z = props.z;
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_v2_05));
            tweenGroup.add(tween_v2_05);
            break;
        case "c2-Yeah！": // ルカ・カイト
            whiteFadeIn(1000);
            shutterFadeOut(1000);
            break;
        case "c2-もう正解なんてない": // 全員
            disableAllSpectrum();
            enableArcCameraControl();

            setArcTargetPosition(0, 0.5, 0);
            setArcSphericalCoordinates(90, 20, 2)
            switchCamera("arc");
            const tween_c2_01 = new Tween({radius: 2}).to({radius: 8}, 9000).start().onUpdate(pos => {
                setArcRadius(pos.radius);
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_c2_01));
            tweenGroup.add(tween_c2_01);
            whiteFadeOut(500);
            neverEndTextFadeOut(500);

            playAnimation("dotmiku", "stand");
            break;
        case "c2-奏でた今日が": // 全員
            playAnimation("dotmiku", "stand-to-grab");
            break;
        case "c2-僕らの道だ": // メイコ
            playAnimation("dotmiku", "grab-to-heart");
            playAnimation("dotmiku-tanabata", "grab-to-heart");
            break;
        case "c2-ずっと手放したくないんだ": // リン
            disableArcCameraControl();
            enableAiCameraControl(-1);

            setFreeRotation(180, 0, 0);
            setFreePosition(0, 0.5, 5);
            switchCamera("free");
            break;
        case "c2-“アイ”": // リン
            await delayForMilSeconds(1000);
            mikuModel?.setEnabled(false);
            tanabataModel?.setEnabled(true);
            break;
        case "c2-いつだって": // 全員
            playAnimation("dotmiku", "heart-to-shake");
            playAnimation("dotmiku-tanabata", "heart-to-shake");
            disableAiCameraControl();

            enableDropStar();

            setFreeRotation(180, 0, 0, "free2");
            setFreePosition(0.5, 1.3, 0.5, "free2");
            setCameraMinZ(0.1, "free2");
            switchCamera("free2");
            break;
        case "c2-願いを歌えば": // 全員
            playAnimation("dotmiku", "shake-to-raise");
            setFreeRotation(180, -10, 0, "free2");
            setFreePosition(0, 1.5, 5, "free2");
            mikuModel?.setEnabled(true);
            tanabataModel?.setEnabled(false);
            break;
        case "c2-君に会える": // カイト
            playAnimation("dotmiku", "raise-to-stand");
            break;
        case "c2-最高のステージ": // ルカ
            setFreeRotation(90, 0, 0, "free2");
            setFreePosition(-0.7, 1.6, 0, "free2");
            playAnimation("dotmiku", "stand-to-face-raise");
            break;
        case "c2-夢はもう譲れないんじゃない？": // レン
            playAnimation("dotmiku", "face-raise-to-one-hand-raise");
            setFreePosition(0, 0.5, 7, "free2");
            setFreeRotation(180, -20, 0, "free2");
            
            const c2SouTween = new Tween({y: 0.5}).to({y: 2.8}, 3000).start().onUpdate(e =>
                free2.position.y = e.y
            ).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(c2SouTween));
            tweenGroup.add(c2SouTween);
            break;
        case "零れたメモリを誘って": // ミク・カイト
            const c2KoboretaTween = new Tween({visibility: 1}).to({visibility: 0}, 3000).onUpdate(p => {
                setModelVisibility("room", p.visibility);
            }).start().onComplete(
                () => tweenGroup.remove(c2KoboretaTween)
            );
            tweenGroup.add(c2KoboretaTween);
            shutterFadeIn(1000);
            enableCircleRipple();
            setFreePosition(0, 1, -3);
            setFreeRotation(0, -20, 0);
            switchCameraWithCrossFade("free", 1000);
            const c2KoboretaTween2 = new Tween({y: 1}).to({y: 2.5}, 20000).start().onUpdate(props => {
                free1.position.y = props.y;
            }).start().onComplete(
                () => tweenGroup.remove(c2KoboretaTween2)
            );
            tweenGroup.add(c2KoboretaTween2);
            
            break;
        case "Twilighttotellus": // ルカ・リン
            break;
        case "Starlighttotellus": // レン・メイコ
            await delayForMilSeconds(3000);
            whiteFadeIn(1000);
            shutterFadeOut(1000);
            break;
        case "lc-終わりなんて": // 全員
        //         disableAllRipple();
            neverEndTextFadeIn(0);
        
            mikuModel?.setEnabled(false);
            tanabataModel = getRootMesh("dotmiku-tanabata");
            skyModel = getRootMesh("sky");
            setModelVisibility("room", 1);

            skyModel?.setEnabled(true);
            tanabataModel?.setEnabled(true);
            enableStarParticles();
            neverEndTextFadeIn(0);
            break;
        case "lc-ない": // 全員
            disableAllSpectrum();
            enableArcCameraControl();

            setArcTargetPosition(0, 0.5, 0);
            setArcSphericalCoordinates(90, 80, 2)
            switchCamera("arc");
            const tween_lc_01 = new Tween({radius: 2}).to({radius: 8}, 9000).start().onUpdate(pos => {
                setArcRadius(pos.radius);
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_lc_01));
            tweenGroup.add(tween_lc_01);
            whiteFadeOut(500);
            neverEndTextFadeOut(500);

            playAnimation("dotmiku-tanabata", "stand");
            break;
        case "lc-この手掴めば": // 全員
            playAnimation("dotmiku-tanabata", "grab-hand");
        break;
        case "lc-また始まるんだ": // ルカ
            playAnimation("dotmiku-tanabata", "grab-to-heart");
        break;
        case "lc-グシャグシャのまま描いた": // ミク
            disableArcCameraControl();
            enableAiCameraControl();

            setFreeRotation(0, 0, 0);
            setFreePosition(0, 0.5, -5);
            switchCamera("free");
            break;
        case "lc-“アイ”": // ミク
            break;
        case "lc-It'sallright！": // 全員
            playAnimation("dotmiku-tanabata", "heart-to-shake");
            disableAiCameraControl();

            enableDropStar();

            setFreeRotation(180, -10, 0, "free2");
            setFreePosition(0, 1.5, 5, "free2");
            setCameraMinZ(0.1, "free2");
            switchCamera("free2");
            /*
            const tween_c1_04 = new Tween({y: 0.1, pitch: -5}).to({y: 0.3, pitch: -15}, 4000).start().onUpdate(props => {
                setFreePosition(-1.9, props.y, 2, "free2");
                setFreeRotation(160, props.pitch, -0.3, "free2");
            }).onComplete(() => tweenGroup.remove(tween_c1_04));
            tweenGroup.add(tween_c1_04);*/
            break;
        case "lc-灯した歌は": // 全員
            playAnimation("dotmiku-tanabata", "shake-to-raise");
            break;
        case "lc-君に届く": // レン
            playAnimation("dotmiku-tanabata", "raise-to-stand");
            break;
        case "lc-躊躇いはない": // カイト
            setFreeRotation(90, 0, 0, "free2");
            setFreePosition(-0.7, 1.6, 0, "free2");
            playAnimation("dotmiku-tanabata", "stand-to-face-raise");
            break;
        case "lc-そう、一人じゃないから": // リン
            playAnimation("dotmiku-tanabata", "face-raise-to-one-hand-raise");
            setFreePosition(0, 0.5, 7, "free2");
            setFreeRotation(180, -20, 0, "free2");
            
            const lcSouTween = new Tween({y: 0.5}).to({y: 2.8}, 3000).start().onUpdate(e =>
                free2.position.y = e.y
            ).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(lcSouTween));
            tweenGroup.add(lcSouTween);
            break;
        case "lc-(鼓動)": // 全員
            shutterFadeIn(1000);
            enableCircleRipple();

            setFreeRotation(90, 0, 0);
            setFreePosition(1.5, 0.5, 1.3);
            setCameraMinZ(0.1, "free");
            switchCamera("free");
            const lcKodouTween = new Tween({z: 1.3}).to({z: 0.8}, 1125).start().onUpdate(e =>
                free1.position.z = e.z
            ).onComplete(() => tweenGroup.remove(lcKodouTween));
            tweenGroup.add(lcKodouTween);
            break;
        case "lc-(心)": // 全員
            disableAllRipple();
            enableSquareRipple();
            const lcKokoroTween = new Tween({y: 0.5}).to({y: 1.5}, 850).start().onUpdate(e =>
                free1.position.y = e.y
            ).onComplete(() => tweenGroup.remove(lcKokoroTween));
            tweenGroup.add(lcKokoroTween);
            break;
        case "lc-(不可能を超えてゆけ)": // 全員
            enableCircleRipple();

            const lcHukanouTween = new Tween({z: 0.8}).to({z: 1.3}, 1250).start().onUpdate(e =>
                free1.position.z = e.z
            ).onComplete(() => tweenGroup.remove(lcHukanouTween));
            tweenGroup.add(lcHukanouTween);
            break;
        case "lc-曖昧な夢さえも抱いて": // メイコ
            playAnimation("dotmiku", "sleep");
            if(tanabataModel) {
                tanabataModel.position.z = 0.3;
                tanabataModel.position.x = -0.05;
            }
            setFreeRotation(180, 90, 0, "free2");
            setFreePosition(-0.1, 3, -0.1, "free2");
            switchCamera("free2");
            const tween_lc_08 = new Tween({y: 3}).to({y: 4.5}, 6000).start().onUpdate(props => {
                free2.position.y = props.y;
            }).onComplete(() => tweenGroup.remove(tween_lc_08));
            tweenGroup.add(tween_lc_08);
            break;
        case "lc-(踊る)": // 全員
            tanabataModel?.setEnabled(false);
            disableAllRipple();
            enableVerticalSpectrum();

            setFreeRotation(180, 0, 0);
            setFreePosition(2.3, 2, 3);
            setCameraMinZ(0.1, "free");
            switchCamera("free");
            const lcOdoruTween = new Tween({z: 3}).to({z:  5}, 1500).start().onUpdate(props => {
                free1.position.z = props.z;
            }).onComplete(() => tweenGroup.remove(lcOdoruTween));
            tweenGroup.add(lcOdoruTween);

            break;
        case "lc-(震える)": // 全員
            enableHorizontalSpectrum();
            
            setFreeRotation(-75, 0, 0);
            setFreePosition(2, 0.8, 0.4);
            const lcHurueruTween = new Tween({x: 2, z: 0.4}).to({x: 0, z: 0.8}, 1500).start().onUpdate(props => {
                free1.position.z = props.z;
                free1.position.x = props.x;
            }).onComplete(() => tweenGroup.remove(lcHurueruTween));
            tweenGroup.add(lcHurueruTween);
            break;
        case "lc-(重なる想いだけ)": // 全員
            enableCircleSpectrum();

            setFreeRotation(-150, 0, 0);
            setFreePosition(-1.5, 1, -1);
            const tween_lc_09 = new Tween({z: -1}).to({z: -1.5}, 3500).start().onUpdate(props => {
                free1.position.z = props.z;
            }).onComplete(() => tweenGroup.remove(tween_lc_09));
            tweenGroup.add(tween_lc_09);
            break;
        case "lc-あふれるストーリーに乗せて": // ルカ
            setArcTargetPosition(0, 0, 0);
            setArcSphericalCoordinates(180, 70, 25)
            switchCamera("arc");
            const tween_lc_10 = new Tween({alpha: 180}).to({alpha: -180}, 5000).start().onUpdate(prop => {
                setArcAlpha(prop.alpha);
            }).easing(Easing.Quintic.Out).onComplete(() => tweenGroup.remove(tween_lc_10));
            tweenGroup.add(tween_lc_10);
            break;
        case "咲かせた未来のその先へ": // ミク
            enableCircleRipple();
            enableSquareRipple();
            await delayForMilSeconds(5000);
            disableAllRipple();
            disableAllSpectrum();
            disableStarParticles();
            endWrapperFadeIn(1000);
            break;
    }
}
