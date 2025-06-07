import type { Scene } from "@babylonjs/core/scene";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SpotLight } from "@babylonjs/core/Lights/spotLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { events } from "./events";

let scene: Scene;
const lights: { [key: string]: HemisphericLight | SpotLight | PointLight } = {};

// ライトの状態管理
let activeLightType: string = 'default';
let currentLightType: string = 'default';

// デフォルト設定の保存
interface LightSettings {
    intensity: number;
    diffuse: Color3;
    groundColor?: Color3;
    position?: Vector3;
    direction?: Vector3;
    range?: number;
}

const defaultSettings: { [key: string]: LightSettings } = {};

// デフォルト設定を保存する関数
function saveDefaultSettings() {
    if (lights.hemispheric) {
        const hemi = lights.hemispheric as HemisphericLight;
        defaultSettings.hemispheric = {
            intensity: hemi.intensity,
            diffuse: hemi.diffuse.clone(),
            groundColor: hemi.groundColor.clone()
        };
    }
    
    if (lights.spot) {
        const spot = lights.spot as SpotLight;
        defaultSettings.spot = {
            intensity: spot.intensity,
            diffuse: spot.diffuse.clone(),
            position: spot.position.clone(),
            direction: spot.direction.clone()
        };
    }
    
    if (lights.point) {
        const point = lights.point as PointLight;
        defaultSettings.point = {
            intensity: point.intensity,
            diffuse: point.diffuse.clone(),
            position: point.position.clone(),
            range: point.range
        };
    }
}

// デフォルト設定に復元する関数
export function restoreDefaultSettings() {
    if (!scene) return;
    
    // すべてのライトをデフォルト設定に復元
    if (lights.hemispheric && defaultSettings.hemispheric) {
        const hemi = lights.hemispheric as HemisphericLight;
        const settings = defaultSettings.hemispheric;
        hemi.intensity = settings.intensity;
        hemi.diffuse = settings.diffuse.clone();
        if (settings.groundColor) {
            hemi.groundColor = settings.groundColor.clone();
        }
    }
    
    if (lights.spot && defaultSettings.spot) {
        const spot = lights.spot as SpotLight;
        const settings = defaultSettings.spot;
        spot.intensity = settings.intensity;
        spot.diffuse = settings.diffuse.clone();
        if (settings.position) {
            spot.position = settings.position.clone();
        }
        if (settings.direction) {
            spot.direction = settings.direction.clone();
        }
    }
    
    if (lights.point && defaultSettings.point) {
        const point = lights.point as PointLight;
        const settings = defaultSettings.point;
        point.intensity = settings.intensity;
        point.diffuse = settings.diffuse.clone();
        if (settings.position) {
            point.position = settings.position.clone();
        }
        if (settings.range !== undefined) {
            point.range = settings.range;
        }
    }
    
    // 状態をデフォルトに戻す
    activeLightType = 'default';
    currentLightType = 'default';
      console.log('Restored to default lighting settings');
    
    // UIの更新をトリガー
    updateLightUI();
}

events.on("onSceneDefinition", (data) => {
    scene = data.scene;
    
    // デフォルトライト (環境光)
    const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
    hemisphericLight.intensity = 0.7;
    hemisphericLight.groundColor = new Color3(0.2, 0.2, 0.3); // 反射光に暗めの青を追加
    hemisphericLight.diffuse = new Color3(1, 1, 0.9); // 少し暖かみのある色に
    lights.default = hemisphericLight;
    lights.hemispheric = hemisphericLight; // Alias for easy access
    
    // スポットライト (初期状態では無効)
    const spotLight = new SpotLight(
        "spotLight",
        new Vector3(0, 3, -5), // 位置を調整（少し低く、ミクの正面へ）
        new Vector3(0, 0, 1), // 方向を調整（ミクの正面から照らす）
        Math.PI / 1.5, // 角度を広く
        1, // 減衰を弱く
        scene
    );
    spotLight.diffuse = new Color3(1, 0.8, 0.8); // 暖かい色調
    spotLight.intensity = 0;
    lights.spot = spotLight;
      // ポイントライト (初期状態では無効)
    const pointLight = new PointLight("pointLight", new Vector3(0, 2, 0), scene);
    pointLight.diffuse = new Color3(0.6, 0.6, 1); // 青みがかった光（少し明るく）
    pointLight.range = 10; // 光の届く範囲を設定
    pointLight.intensity = 0;
    lights.point = pointLight;
    
    // デフォルト設定を保存
    saveDefaultSettings();
});

export function switchLight(type: string) {
    if (!scene) return;

    // すべてのライトを一旦無効化 (または強度を0に)
    Object.values(lights).forEach(light => light.intensity = 0);
    
    // デフォルトの環境光を常に初期状態にリセット
    const hemiLight = lights.hemispheric as HemisphericLight;
    hemiLight.diffuse = new Color3(1, 1, 0.9); // デフォルトの暖かい光色
    hemiLight.groundColor = new Color3(0.2, 0.2, 0.3); // デフォルトの地面反射色
    
    const selectedLight = lights[type];

    if (selectedLight) {
        if (type === 'spot') {
            selectedLight.intensity = 1.2; // スポットライトは強めに
            const spotLight = selectedLight as SpotLight;
            spotLight.diffuse = new Color3(1, 0.8, 0.8);
            
            // 環境光も少し弱く残して、シーン全体が暗すぎないようにする
            if (lights.hemispheric) {
                lights.hemispheric.intensity = 0.2;
            }
        } else if (type === 'point') {
            selectedLight.intensity = 1.0; // ポイントライトは標準的な強さ
            const pointLight = selectedLight as PointLight;
            pointLight.diffuse = new Color3(0.6, 0.6, 1);
            
            // 環境光も少し弱く残して、シーン全体が暗すぎないようにする
            if (lights.hemispheric) {
                lights.hemispheric.intensity = 0.2;
            }
        } else if (type === 'hemispheric') {
            // 環境光モード（特殊な雰囲気を出す）
            selectedLight.intensity = 0.9; // 少し強めに
            const hemiLight = selectedLight as HemisphericLight;
            
            // ここで明示的にデフォルトと異なる特殊な光の設定を行う
            hemiLight.diffuse = new Color3(0.7, 0.7, 1.0); // 青みがかった冷たい光
            hemiLight.groundColor = new Color3(0.3, 0.2, 0.4); // 紫色の照り返し
        } else {
            selectedLight.intensity = 0.7; // その他のライトは標準の強度
        }
        console.log(`Switched to ${type} light`);
    } else if (type === 'default') {
        // デフォルトは環境光のみ有効にする
        if (lights.hemispheric) {
            // ライトの強度だけ設定（色などはすでにリセット済み）
            lights.hemispheric.intensity = 0.7;
            console.log(`Switched to default (hemispheric) light`);
        }
    }

    // 状態を更新
    activeLightType = type;
    currentLightType = type;

    // ボタンのハイライト更新
    for (const id of ["default", "spot", "point", "hemispheric"]) {
        const btn = document.getElementById(`light-${id}`);
        if (btn) {
            if (id === type || (type === 'default' && id === 'hemispheric')) {
                btn.classList.add("bg-blue-500", "text-white");
            } else {
                btn.classList.remove("bg-blue-500", "text-white");
            }
        }
    }
    
    // UIの同期を更新
    updateLightUI();
}

/**
 * ライトの有効/無効を切り替える関数
 * @param enabled ライトをオンにする場合はtrue、オフにする場合はfalse
 * @param lightType 特定のライトタイプ（default, spot, point, hemispheric）を指定する。未指定の場合は現在選択されているライトを使用
 * @returns 操作が成功したかどうか
 */
export function setLightEnabled(enabled: boolean, lightType?: string): boolean {
    if (!scene) return false;
    
    // 対象のライトタイプを決定
    const targetLightType = lightType || currentLightType;
    
    // 現在のライトタイプを更新
    currentLightType = targetLightType;
    
    if (enabled) {
        // ライトをオンにする場合は、switchLight関数を使用して適切な設定を適用
        switchLight(targetLightType);
        activeLightType = targetLightType;
    } else {
        // ライトをオフにする場合は、すべてのライトの強度を0に設定
        Object.values(lights).forEach(light => light.intensity = 0);
        
        // ボタンのハイライトを更新（オフの状態を示す）
        for (const id of ["default", "spot", "point", "hemispheric"]) {
            const btn = document.getElementById(`light-${id}`);
            if (btn) {
                btn.classList.remove("bg-blue-500", "text-white");
            }
        }
        activeLightType = 'none';
    }
    
    // UIの同期を更新
    updateLightUI();
    
    console.log(`Light ${targetLightType} ${enabled ? 'enabled' : 'disabled'}`);
    return true;
}

/**
 * ライトの色を設定する関数
 * @param colorHex カラーコード（例: '#ff0000'）
 * @param lightType 特定のライトタイプ（default, spot, point, hemispheric）を指定する。未指定の場合は現在選択されているライトを使用
 * @returns 操作が成功したかどうか
 */
export function setLightColor(colorHex: string, lightType?: string): boolean {
    if (!scene) return false;
    
    // 対象のライトタイプを決定
    const targetLightType = lightType || currentLightType;
    
    // 現在のライトタイプを更新
    currentLightType = targetLightType;
    
    // デフォルトの場合は環境光を使用
    const actualType = targetLightType === 'default' ? 'hemispheric' : targetLightType;
    const targetLight = lights[actualType];
    
    if (!targetLight) {
        console.warn(`Light type "${targetLightType}" not found`);
        return false;
    }
    
    // 16進数カラーコードをRGB値に変換
    const r = parseInt(colorHex.substring(1, 3), 16) / 255;
    const g = parseInt(colorHex.substring(3, 5), 16) / 255;
    const b = parseInt(colorHex.substring(5, 7), 16) / 255;
    
    // ライトの種類に応じて色を設定
    if (targetLight instanceof HemisphericLight) {
        // 環境光の場合は拡散色を設定
        targetLight.diffuse = new Color3(r, g, b);
    } else {
        // その他のライトはdiffuseプロパティを直接設定
        targetLight.diffuse = new Color3(r, g, b);
    }
    
    // ライトが無効になっている場合は有効にする
    if (targetLight.intensity === 0) {
        setLightEnabled(true, targetLightType);
    }
    
    // UIの同期を更新
    updateLightUI();
    
    console.log(`Light ${targetLightType} color set to ${colorHex}`);
    return true;
}

/**
 * ライトの明るさを設定する関数
 * @param intensity 明るさ（0.0から2.0程度）
 * @param lightType 特定のライトタイプ（default, spot, point, hemispheric）を指定する。未指定の場合は現在選択されているライトを使用
 * @returns 操作が成功したかどうか
 */
export function setLightIntensity(intensity: number, lightType?: string): boolean {
    if (!scene) return false;
    
    // 対象のライトタイプを決定
    const targetLightType = lightType || currentLightType;
    
    // 現在のライトタイプを更新
    currentLightType = targetLightType;
    
    // デフォルトの場合は環境光を使用
    const actualType = targetLightType === 'default' ? 'hemispheric' : targetLightType;
    const targetLight = lights[actualType];
    
    if (!targetLight) {
        console.warn(`Light type "${targetLightType}" not found`);
        return false;
    }
    
    // 明るさを設定（範囲チェック）
    const clampedIntensity = Math.max(0, Math.min(2, intensity));
    targetLight.intensity = clampedIntensity;
    
    // 明るさが0より大きい場合はライトを有効状態にする
    if (clampedIntensity > 0) {
        activeLightType = targetLightType;
    } else {
        activeLightType = 'none';
    }
    
    // UIの同期を更新
    updateLightUI();
    
    console.log(`Light ${targetLightType} intensity set to ${clampedIntensity}`);
    return true;
}

/**
 * UIの状態を現在のライト設定と同期する関数
 */
function updateLightUI(): void {
    // LightsetEnableセクションの同期
    const lightEnableKeySelect = document.getElementById('light-enable-key') as HTMLSelectElement;
    const lightToggle = document.getElementById('light-toggle') as HTMLInputElement;
    
    if (lightEnableKeySelect) {
        lightEnableKeySelect.value = currentLightType;
    }
    
    if (lightToggle) {
        lightToggle.checked = activeLightType !== 'none';
    }
    
    // LightsetColorセクションの同期
    const lightColorKeySelect = document.getElementById('light-color-key') as HTMLSelectElement;
    
    if (lightColorKeySelect) {
        lightColorKeySelect.value = currentLightType;
    }
      // 明るさスライダーがあれば同期
    const lightIntensitySlider = document.getElementById('light-intensity-slider') as HTMLInputElement;
    const lightIntensityValue = document.getElementById('light-intensity-value') as HTMLSpanElement;
    const lightIntensityKeySelect = document.getElementById('light-intensity-key') as HTMLSelectElement;
    
    if (lightIntensitySlider) {
        const actualType = currentLightType === 'default' ? 'hemispheric' : currentLightType;
        const currentLight = lights[actualType];
        if (currentLight) {
            lightIntensitySlider.value = currentLight.intensity.toString();
            
            // 値の表示も更新
            if (lightIntensityValue) {
                lightIntensityValue.textContent = currentLight.intensity.toFixed(1);
            }
        }
    }
    
    // 明るさキー選択も同期
    if (lightIntensityKeySelect) {
        lightIntensityKeySelect.value = currentLightType;
    }
}

/**
 * 昼夜切り替えのプリセット機能（改善版）
 * @param preset プリセット名（'day', 'night', 'sunset', 'dawn'）
 */
export function setLightingPreset(preset: string): boolean {
    if (!scene) return false;
    
    // 全てのライトを一旦リセット
    Object.values(lights).forEach(light => light.intensity = 0);
    
    switch (preset) {        case 'day':
            // 昼間：非常に明るく鮮やかな快晴の日差し
            const dayHemiLight = lights.hemispheric as HemisphericLight;
            dayHemiLight.intensity = 2.5; // より明るく
            dayHemiLight.diffuse = new Color3(1.0, 1.0, 0.9); // 純白に近い強い日光
            dayHemiLight.groundColor = new Color3(0.9, 0.95, 1.0); // 明るい青空の反射
            
            // 太陽の強烈な直射光
            const daySpotLight = lights.spot as SpotLight;
            daySpotLight.intensity = 2.0; // 非常に強く
            daySpotLight.diffuse = new Color3(1.0, 0.95, 0.75); // 強い太陽光の黄色味
            
            // 明るい空からの散乱光
            const dayPointLight = lights.point as PointLight;
            dayPointLight.intensity = 0.8; // より明るく
            dayPointLight.diffuse = new Color3(0.8, 0.9, 1.0); // 青空の散乱光
            break;        case 'night':
            // 夜間：暗く神秘的な月夜
            const nightHemiLight = lights.hemispheric as HemisphericLight;
            nightHemiLight.intensity = 0.08; // さらに暗く
            nightHemiLight.diffuse = new Color3(0.05, 0.1, 0.3); // 深い夜の藍色
            nightHemiLight.groundColor = new Color3(0.01, 0.02, 0.08); // ほぼ真っ黒
            
            // 月の冷たく美しい光
            const nightPointLight = lights.point as PointLight;
            nightPointLight.intensity = 1.2; // 月光をメインに
            nightPointLight.diffuse = new Color3(0.3, 0.5, 1.0); // 冷たい青白い月光
            
            // 微かなスポットライト（星明かりの効果）
            const nightSpotLight = lights.spot as SpotLight;
            nightSpotLight.intensity = 0.1; // 非常に微弱
            nightSpotLight.diffuse = new Color3(0.2, 0.25, 0.5); // 淡い星の光
            break;case 'sunset':
            // 夕焼け：劇的で美しい黄金の夕日
            const sunsetHemiLight = lights.hemispheric as HemisphericLight;
            sunsetHemiLight.intensity = 1.2; // もっと明るく
            sunsetHemiLight.diffuse = new Color3(1.0, 0.45, 0.1); // より鮮やかなオレンジ
            sunsetHemiLight.groundColor = new Color3(1.0, 0.25, 0.05); // 地面に映る強烈な夕焼け
            
            // 夕日のメインライト（太陽の直射光）
            const sunsetSpotLight = lights.spot as SpotLight;
            sunsetSpotLight.intensity = 1.8; // 非常に強い夕日
            sunsetSpotLight.diffuse = new Color3(1.0, 0.3, 0.0); // 燃えるような赤オレンジ
            
            // 夕焼け空の暖かい散乱光
            const sunsetPointLight = lights.point as PointLight;
            sunsetPointLight.intensity = 0.7;
            sunsetPointLight.diffuse = new Color3(1.0, 0.5, 0.2); // 暖かい金色の散乱光
            break;        case 'dawn':
            // 朝焼け：幻想的で美しい薔薇色の夜明け
            const dawnHemiLight = lights.hemispheric as HemisphericLight;
            dawnHemiLight.intensity = 1.3; // より明るく
            dawnHemiLight.diffuse = new Color3(1.0, 0.7, 0.85); // より鮮やかなピンク
            dawnHemiLight.groundColor = new Color3(0.95, 0.5, 0.75); // 地面の薔薇色の反射
            
            // 朝日の黄金の光
            const dawnSpotLight = lights.spot as SpotLight;
            dawnSpotLight.intensity = 1.6; // 強い朝日
            dawnSpotLight.diffuse = new Color3(1.0, 0.65, 0.4); // 温かい金色の朝日
            
            // 神秘的な朝霧の光
            const dawnPointLight = lights.point as PointLight;
            dawnPointLight.intensity = 0.6;
            dawnPointLight.diffuse = new Color3(0.9, 0.8, 1.0); // 薄紫の朝霧光
            break;
            
        default:
            console.warn(`Unknown lighting preset: ${preset}`);
            return false;
    }
    
    // 現在のライトタイプとアクティブタイプを更新
    currentLightType = preset;
    activeLightType = preset;
    
    // UIの同期を更新
    updateLightUI();
    
    console.log(`Applied enhanced lighting preset: ${preset}`);
    return true;
}
