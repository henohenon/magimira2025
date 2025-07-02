import { Color3 } from "@babylonjs/core/Maths/math.color";

import {
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
    whiteFadeOut
} from "./dom/fade.ts";

import "./update";
import "./dom/bottom-lyrics.ts";
import "./events";
import {
    disableAllSpectrum
} from "~/game/spectrum.ts";
import {disableAllRipple, enableCircleRipple} from "~/game/ripple.ts";

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
            switchCameraWithCrossFade("free2", 1000);
            break;
        case "揺らめく都市のmagic": // リン
            break;
        case "街明かりが渦巻く躓くmymind": // ミク
            break;
        case "再起動theothernight": // メイコ
            break;
        case "(Don’tyouknow？)": // カイト
            break;
        case "Ah強引にgoin'on": // ルカ
            break;
        case "好きも得意も": // レン
            break;
        case "もう全部奏でたいんだ": // リンルカ
            break;
        case "(Yeahdoit！)": // リン
            break;
        case "めくるめくこの雑踏をかき分けていく": // メイコ
            break;
        case "光差す道を目指して": // ミク
            break;
        case "空回る今だって僕らの祈り毎秒更新": // カイト
            break;
        case "不安感だって攫っていく未来にrideon": // リンレン
            break;
        case "Yeah！": // リンレン
            break;
        case "終わりなんて": // 全員
            break;
        case "ない": // 全員
            break;
        case "この手掴めば": // 全員
            break;
        case "また始まるんだ": // ルカ
            break;
        case "グシャグシャのまま描いた": // ミク
            break;
        case "描いた-“アイ”": // ミク
            break;
        case "It'sallright！": // 全員
            break;
        case "灯した歌は": // 全員
            break;
        case "君に届く": // レン
            break;
        case "躊躇いはない": // カイト
            break;
        case "そう、一人じゃないから": // リン
            break;
        case "(鼓動、心、不可能を超えてゆけ)": // 全員
            break;
        case "曖昧な夢さえも抱いて": // メイコ
            break;
        case "(踊る、震える、重なる想いだけ)": // 全員
            break;
        case "あふれるストーリーに乗せて": // ルカ
            break;
        case "立ち尽くす街角": // ミク
            whiteFadeOut(1000);
            break;
        case "どれほど間違っても": // レン
            break;
        case "この灯火は何度だって輝く": // メイコ
            break;
        case "(宿す against gravity)": // カイト
            break;
        case "ここからはノンストップ": // ルカ
            break;
        case "宵闇の中でも": // リン
            break;
        case "消えない星を繋いでいたい": // ミク
            break;
        case "止め処なく bluff, bluff": // メイコ
            break;
        case "言葉の飾り 毎秒更新": // メイコ
            break;
        case "揺らぐ主役 舞台は未知の最前線": // ルカ・カイト
            break;
        case "Yeah!": // ルカ・カイト
            break;
        case "もう正解なんてない": // 全員
            break;
        case "奏でた今日が": // 全員
            break;
        case "僕らの道だ": // メイコ
            break;
        case "ずっと手放したくないんだ“アイ”": // リン
            break;
        case "いつだって願いを歌えば": // 全員
            break;
        case "君に会える": // カイト
            break;
        case "最高のステージ": // ルカ
            break;
        case "夢はもう譲れないんじゃない？": // レン
            break;
        case "零れたメモリを誘って": // ミク・カイト
            break;
        case "Twilight to tell us": // ルカ・リン
            break;
        case "Starlight to tell us": // レン・メイコ
            break;
        case "終わりなんてないこの手掴めば": // 全員
            break;
        case "咲かせた未来のその先へ": // ミク
            break;

    }
}
