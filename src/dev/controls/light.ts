import {
    setLightIntensity,
    type LightType,
    resetHemispheric,
    setHemisphericGroundColor,
    setLightDiffuse,
    setLightEnabled,
    addLightPosition,
    setLightPosition, addLightDirection, setLightDirection, resetPoint, resetSpot
} from "~/babylon/light.ts";
import type {ToggleSwitch} from "../web-components/toggle-switch.ts";
import type {ColorPicker} from "../web-components/color-picker.ts";
import type {InputAndSlider} from "../web-components/input-slider.ts";
import type {TripleInput} from "../web-components/triple-input.ts";

const spotLightEnable = document.getElementById("spot-light-enable") as ToggleSwitch;
const spotLightDiffuse = document.getElementById("spot-light-diffuse") as ColorPicker;
const spotLightIntensity = document.getElementById("spot-light-intensity") as InputAndSlider;
const spotLightAddPositionInput = document.getElementById("spot-light-add-position-input") as TripleInput;
const spotLightAddPositionButton = document.getElementById("spot-light-add-position-button") as HTMLButtonElement;
const spotLightSetPositionInput = document.getElementById("spot-light-set-position-input") as TripleInput;
const spotLightSetPositionButton = document.getElementById("spot-light-set-position-button") as HTMLButtonElement;

const pointLightEnable = document.getElementById("point-light-enable") as ToggleSwitch;
const pointLightDiffuse = document.getElementById("point-light-diffuse") as ColorPicker;
const pointLightIntensity = document.getElementById("point-light-intensity") as InputAndSlider;
const pointLightAddPositionInput = document.getElementById("point-light-add-position-input") as TripleInput;
const pointLightAddPositionButton = document.getElementById("point-light-add-position-button") as HTMLButtonElement;
const pointLightSetPositionInput = document.getElementById("point-light-set-position-input") as TripleInput;
const pointLightSetPositionButton = document.getElementById("point-light-set-position-button") as HTMLButtonElement;
const pointLightAddDirectionInput = document.getElementById("point-light-add-direction-input") as TripleInput;
const pointLightAddDirectionButton = document.getElementById("point-light-add-direction-button") as HTMLButtonElement;
const pointLightSetDirectionInput = document.getElementById("point-light-set-direction-input") as TripleInput;
const pointLightSetDirectionButton = document.getElementById("point-light-set-direction-button") as HTMLButtonElement;

const hemisphericLightEnable = document.getElementById("hemispheric-light-enable") as ToggleSwitch;
const hemisphericLightDiffuse = document.getElementById("hemispheric-light-diffuse") as ColorPicker;
const hemisphericLightGroundColor = document.getElementById("hemispheric-light-ground-color") as ColorPicker;
const hemisphericLightIntensity = document.getElementById("hemispheric-light-intensity") as InputAndSlider;
const hemisphericLightAddDirectionInput = document.getElementById("point-light-add-direction-input") as TripleInput;
const hemisphericLightAddDirectionButton = document.getElementById("point-light-add-direction-button") as HTMLButtonElement;
const hemisphericLightSetDirectionInput = document.getElementById("point-light-set-direction-input") as TripleInput;
const hemisphericLightSetDirectionButton = document.getElementById("point-light-set-direction-button") as HTMLButtonElement;

const presetDefault = document.getElementById("preset-default") as HTMLButtonElement;
const presetPoint = document.getElementById("preset-point") as HTMLButtonElement;
const presetSpot = document.getElementById("preset-spot") as HTMLButtonElement;
const presetHemispheric = document.getElementById("preset-hemispheric") as HTMLButtonElement;
const presetDay = document.getElementById("preset-day") as HTMLButtonElement;
const presetNight = document.getElementById("preset-night") as HTMLButtonElement;
const presetSunset = document.getElementById("preset-sunset") as HTMLButtonElement;
const presetDawn = document.getElementById("preset-dawn") as HTMLButtonElement;

if (!spotLightEnable || !pointLightEnable || !hemisphericLightEnable ||
    !spotLightDiffuse || !pointLightDiffuse || !hemisphericLightDiffuse ||
    !hemisphericLightGroundColor ||
    !spotLightIntensity || !pointLightIntensity || !hemisphericLightIntensity ||
    !spotLightAddPositionInput || !pointLightAddPositionInput || !hemisphericLightAddDirectionInput ||
    !spotLightAddPositionButton || !pointLightAddPositionButton || !hemisphericLightAddDirectionButton ||
    !spotLightSetPositionInput || !pointLightSetPositionInput || !hemisphericLightSetDirectionInput ||
    !spotLightSetPositionButton || !pointLightSetPositionButton || !hemisphericLightSetDirectionButton || !presetDefault ||
    !presetPoint || !presetSpot || !presetHemispheric || !presetDay || !presetNight || !presetSunset || !presetDawn){
    console.error("Missing DOM elements",
        spotLightEnable, pointLightEnable, hemisphericLightEnable,
        spotLightDiffuse, pointLightDiffuse, hemisphericLightDiffuse,
        hemisphericLightGroundColor,
        spotLightIntensity, pointLightIntensity, hemisphericLightIntensity,
        spotLightAddPositionInput, pointLightAddPositionInput, hemisphericLightAddDirectionInput,
        spotLightAddPositionButton, pointLightAddPositionButton, hemisphericLightAddDirectionButton,
        spotLightSetPositionInput, pointLightSetPositionInput, hemisphericLightSetDirectionInput,
        spotLightSetPositionButton, pointLightSetPositionButton, hemisphericLightSetDirectionButton,
        presetDefault, presetPoint, presetSpot, presetHemispheric, presetDay, presetNight, presetSunset, presetDawn,
        );
    throw new Error("Missing DOM elements");
}

spotLightEnable.subscribe(toggle => {
    setLightEnabled("spot", toggle);
});
pointLightEnable.subscribe(toggle => {
    setLightEnabled("point", toggle);
});
hemisphericLightEnable.subscribe(toggle => {
    setLightEnabled("hemispheric", toggle);
});

spotLightDiffuse.subscribe(color => {
    if (!color) return;
    setLightDiffuse("spot", color);
});
pointLightDiffuse.subscribe(color => {
    if (!color) return;
    setLightDiffuse("point", color);
});
hemisphericLightDiffuse.subscribe(color => {
    if (!color) return;
    setLightDiffuse("hemispheric", color);
});
hemisphericLightGroundColor.subscribe(color => {
    if (!color) return;
    setHemisphericGroundColor(color);
});

spotLightIntensity.subscribe(value => {
    setLightIntensity("spot", value);
});
pointLightIntensity.subscribe(value => {
    setLightIntensity("point", value);
});
hemisphericLightIntensity.subscribe(value => {
    setLightIntensity("hemispheric", value);
});

spotLightAddPositionButton.addEventListener("click", () => {
    addLightPosition("spot", spotLightAddPositionInput.value1, spotLightAddPositionInput.value2, spotLightAddPositionInput.value3);
});
spotLightSetPositionButton.addEventListener("click", () => {
    setLightPosition("spot", spotLightSetPositionInput.value1, spotLightSetPositionInput.value2, spotLightSetPositionInput.value3);
});
pointLightAddPositionButton.addEventListener("click", () => {
    addLightPosition("point", pointLightAddPositionInput.value1, pointLightAddPositionInput.value2, pointLightAddPositionInput.value3);
});
pointLightSetPositionButton.addEventListener("click", () => {
    setLightPosition("point", pointLightSetPositionInput.value1, pointLightSetPositionInput.value2, pointLightSetPositionInput.value3);
});
pointLightAddDirectionButton.addEventListener("click", () => {
    addLightPosition("point", pointLightAddDirectionInput.value1, pointLightAddDirectionInput.value2, pointLightAddDirectionInput.value3);
});
pointLightSetDirectionButton.addEventListener("click", () => {
    setLightPosition("point", pointLightSetDirectionInput.value1, pointLightSetDirectionInput.value2, pointLightSetDirectionInput.value3);
});
hemisphericLightAddDirectionButton.addEventListener("click", () => {
    addLightDirection("hemispheric", hemisphericLightAddDirectionInput.value1, hemisphericLightAddDirectionInput.value2, hemisphericLightAddDirectionInput.value3);
});
hemisphericLightSetDirectionButton.addEventListener("click", () => {
    setLightDirection("hemispheric", hemisphericLightSetDirectionInput.value1, hemisphericLightSetDirectionInput.value2, hemisphericLightSetDirectionInput.value3);
});

presetDefault.addEventListener("click", () => {
    resetSpot()
    resetPoint();
    resetHemispheric();
});
presetPoint.addEventListener("click", () => {
    switchLight("point");
});
presetSpot.addEventListener("click", () => {
    switchLight("spot");
});
presetHemispheric.addEventListener("click", () => {
    switchLight("hemispheric");
});
presetDay.addEventListener("click", () => {
    setLightingPreset("day");
});
presetNight.addEventListener("click", () => {
    setLightingPreset("night");
});
presetSunset.addEventListener("click", () => {
    setLightingPreset("sunset");
});
presetDawn.addEventListener("click", () => {
    setLightingPreset("dawn");
});


export function switchLight(type: LightType) {
    // すべてのライトを一旦無効化
    setLightEnabled("spot", false);
    setLightEnabled("point", false);
    setLightEnabled("hemispheric", false);

    // デフォルトの環境光を常に初期状態にリセット
    setLightEnabled("hemispheric", true);
    resetHemispheric();

    switch (type) {
        case "spot":
            setLightEnabled("spot", true);
            setLightIntensity("spot", 1.2);
            setLightDiffuse("spot", "#ffcccc");
            // 環境光も少し弱く残して、シーン全体が暗すぎないようにする
            setLightIntensity("hemispheric", 0.2);
            break;
        case "point":
            setLightEnabled("point", true);
            setLightIntensity("point", 1.0);
            setLightDiffuse("point", "#9999FF");
            // 環境光も少し弱く残して、シーン全体が暗すぎないようにする
            setLightIntensity("hemispheric", 0.2);
            break;
        case "hemispheric":
            setLightIntensity("hemispheric", 0.9);
            // ここで明示的にデフォルトと異なる特殊な光の設定を行う
            setLightDiffuse("hemispheric", "#B3B3FF");
            setHemisphericGroundColor("#4D3366");
            break;
    }
    console.log(`Switched to ${type} light`);
}

/**
 * 昼夜切り替えのプリセット機能（改善版）
 * @param preset プリセット名（'day', 'night', 'sunset', 'dawn'）
 */
export function setLightingPreset(preset: "day" | "night" | "sunset" | "dawn"): boolean {
    // すべてのライトを有効か
    setLightEnabled("spot", true);
    setLightEnabled("point", true);
    setLightEnabled("hemispheric", true);

    switch (preset) {
        case 'day':
            // 昼間：非常に明るく鮮やかな快晴の日差し
            setLightIntensity("hemispheric", 2.5); // より明るく
            setLightDiffuse("hemispheric", "#FFFFE6"); // 純白に近い強い日光
            setHemisphericGroundColor("#E6F2FF"); // 明るい青空の反射

            // 太陽の強烈な直射光
            setLightIntensity("spot", 2.0); // 非常に強く
            setLightDiffuse("spot", "#FFF2BF"); // 強い太陽光の黄色味

            // 明るい空からの散乱光
            setLightIntensity("point", 0.8); // より明るく
            setLightDiffuse("point", "#CCE6FF"); // 青空の散乱光
            break;
        case 'night':
            // 夜間：暗く神秘的な月夜
            setLightIntensity("hemispheric", 0.08); // さらに暗く
            setLightDiffuse("hemispheric", "#0D1A4D");  // 深い夜の藍色
            setHemisphericGroundColor("#030514");

            // 月の冷たく美しい光
            setLightIntensity("point", 1.2); // 月光をメインに
            setLightDiffuse("point", "#4D80FF"); // 冷たい青白い月光

            // 微かなスポットライト（星明かりの効果）
            setLightIntensity("spot", 0.1); // 非常に微弱
            setLightDiffuse("spot", "#334080"); // 淡い星の光
            break;
        case 'sunset':
            // 夕焼け：劇的で美しい黄金の夕日
            setLightIntensity("hemispheric", 1.2); // もっと明るく
            setLightDiffuse("hemispheric", "#FF731A"); // より鮮やかなオレンジ
            setHemisphericGroundColor("#FF400D");

            // 夕日のメインライト（太陽の直射光）
            setLightIntensity("spot", 1.8); // 非常に強い夕日
            setLightDiffuse("spot", "#FF4D00"); // 燃えるような赤オレンジ

            // 夕焼け空の暖かい散乱光
            setLightIntensity("point", 0.7);
            setLightDiffuse("point", "#FF8033"); // 暖かい金色の散乱光
            break;
        case 'dawn':
            // 朝焼け：幻想的で美しい薔薇色の夜明け
            setLightIntensity("hemispheric", 1.3); // より明るく
            setLightDiffuse("hemispheric", "#FFB3D9"); // より鮮やかなピンク
            setHemisphericGroundColor("#F280BF"); // 地面の薔薇色の反射

            // 朝日の黄金の光
            setLightIntensity("spot", 1.6); // 強い朝日
            setLightDiffuse("spot", "#FFA666"); // 温かい金色の朝日

            // 神秘的な朝霧の光
            setLightIntensity("point", 0.6);
            setLightDiffuse("point", "#E6CCFF"); // 薄紫の朝霧光
            break;
        default:
            console.warn(`Unknown lighting preset: ${preset}`);
            return false;
    }

    console.log(`Applied enhanced lighting preset: ${preset}`);
    return true;
}
