import { Color3 } from "@babylonjs/core/Maths/math.color";
import {
    type LightType, resetHemispheric,
    setHemisphericGroundColor,
    setLightDiffuse,
    setLightEnabled,
    setLightIntensity
} from "~/lib/babylon/light.ts";


export const setHemisphericLightColor = (color: Color3) => {
    setHemisphericGroundColor(color);
    setLightDiffuse("hemispheric", color);
}

export const setLightingPreset = (preset: "day" | "night" | "sunset" | "dawn"): boolean => {
    // すべてのライトを有効か
    setLightEnabled("spot", true);
    setLightEnabled("point", true);
    setLightEnabled("hemispheric", true);

    switch (preset) {
        case 'day':
            // 昼間：非常に明るく鮮やかな快晴の日差し
            setLightIntensity("hemispheric", 2.5); // より明るく
            setLightDiffuse("hemispheric", Color3.FromHexString("#FFFFE6")); // 純白に近い強い日光
            setHemisphericGroundColor(Color3.FromHexString("#E6F2FF")); // 明るい青空の反射

            // 太陽の強烈な直射光
            setLightIntensity("spot", 2.0); // 非常に強く
            setLightDiffuse("spot", Color3.FromHexString("#FFF2BF")); // 強い太陽光の黄色味

            // 明るい空からの散乱光
            setLightIntensity("point", 0.8); // より明るく
            setLightDiffuse("point", Color3.FromHexString("#CCE6FF")); // 青空の散乱光
            break;
        case 'night':
            // 夜間：暗く神秘的な月夜
            setLightIntensity("hemispheric", 0.08); // さらに暗く
            setLightDiffuse("hemispheric", Color3.FromHexString("#0D1A4D"));  // 深い夜の藍色
            setHemisphericGroundColor(Color3.FromHexString("#030514"));

            // 月の冷たく美しい光
            setLightIntensity("point", 1.2); // 月光をメインに
            setLightDiffuse("point", Color3.FromHexString("#4D80FF")); // 冷たい青白い月光

            // 微かなスポットライト（星明かりの効果）
            setLightIntensity("spot", 0.1); // 非常に微弱
            setLightDiffuse("spot", Color3.FromHexString("#334080")); // 淡い星の光
            break;
        case 'sunset':
            // 夕焼け：劇的で美しい黄金の夕日
            setLightIntensity("hemispheric", 1.2); // もっと明るく
            setLightDiffuse("hemispheric", Color3.FromHexString("#FF731A")); // より鮮やかなオレンジ
            setHemisphericGroundColor(Color3.FromHexString("#FF400D"));

            // 夕日のメインライト（太陽の直射光）
            setLightIntensity("spot", 1.8); // 非常に強い夕日
            setLightDiffuse("spot", Color3.FromHexString("#FF4D00")); // 燃えるような赤オレンジ

            // 夕焼け空の暖かい散乱光
            setLightIntensity("point", 0.7);
            setLightDiffuse("point", Color3.FromHexString("#FF8033")); // 暖かい金色の散乱光
            break;
        case 'dawn':
            // 朝焼け：幻想的で美しい薔薇色の夜明け
            setLightIntensity("hemispheric", 1.3); // より明るく
            setLightDiffuse("hemispheric", Color3.FromHexString("#FFB3D9")); // より鮮やかなピンク
            setHemisphericGroundColor(Color3.FromHexString("#F280BF")); // 地面の薔薇色の反射

            // 朝日の黄金の光
            setLightIntensity("spot", 1.6); // 強い朝日
            setLightDiffuse("spot", Color3.FromHexString("#FFA666")); // 温かい金色の朝日

            // 神秘的な朝霧の光
            setLightIntensity("point", 0.6);
            setLightDiffuse("point", Color3.FromHexString("#E6CCFF")); // 薄紫の朝霧光
            break;
        default:
            console.warn(`Unknown lighting preset: ${preset}`);
            return false;
    }

    console.log(`Applied enhanced lighting preset: ${preset}`);
    return true;
}

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
            setLightDiffuse("spot", Color3.FromHexString("#ffcccc"));
            // 環境光も少し弱く残して、シーン全体が暗すぎないようにする
            setLightIntensity("hemispheric", 0.2);
            break;
        case "point":
            setLightEnabled("point", true);
            setLightIntensity("point", 1.0);
            setLightDiffuse("point", Color3.FromHexString("#9999FF"));
            // 環境光も少し弱く残して、シーン全体が暗すぎないようにする
            setLightIntensity("hemispheric", 0.2);
            break;
        case "hemispheric":
            setLightIntensity("hemispheric", 0.9);
            // ここで明示的にデフォルトと異なる特殊な光の設定を行う
            setLightDiffuse("hemispheric", Color3.FromHexString("#B3B3FF"));
            setHemisphericGroundColor(Color3.FromHexString("#4D3366"));
            break;
    }
    console.log(`Switched to ${type} light`);
}
