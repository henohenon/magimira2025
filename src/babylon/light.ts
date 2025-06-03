import type { Scene } from "@babylonjs/core/scene";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SpotLight } from "@babylonjs/core/Lights/spotLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { events } from "./events";

let scene: Scene;
const lights: { [key: string]: HemisphericLight | SpotLight | PointLight } = {};

events.on("onSceneDefinition", (data) => {
    scene = data.scene;    // デフォルトライト (環境光)
    const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
    hemisphericLight.intensity = 0.7;
    hemisphericLight.groundColor = new Color3(0.2, 0.2, 0.3); // 反射光に暗めの青を追加
    hemisphericLight.diffuse = new Color3(1, 1, 0.9); // 少し暖かみのある色に
    lights.default = hemisphericLight;
    lights.hemispheric = hemisphericLight; // Alias for easy access// スポットライト (初期状態では無効)
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
    lights.spot = spotLight;    // ポイントライト (初期状態では無効)
    const pointLight = new PointLight("pointLight", new Vector3(0, 2, 0), scene);
    pointLight.diffuse = new Color3(0.6, 0.6, 1); // 青みがかった光（少し明るく）
    pointLight.range = 10; // 光の届く範囲を設定
    pointLight.intensity = 0;
    lights.point = pointLight;
});

export function switchLight(type: string) {
    if (!scene) return;

    // すべてのライトを一旦無効化 (または強度を0に)
    Object.values(lights).forEach(light => light.intensity = 0);
    
    // デフォルトの環境光を常に初期状態にリセット
    const hemiLight = lights.hemispheric as HemisphericLight;
    hemiLight.diffuse = new Color3(1, 1, 0.9); // デフォルトの暖かい光色
    hemiLight.groundColor = new Color3(0.2, 0.2, 0.3); // デフォルトの地面反射色
    
    const selectedLight = lights[type];if (selectedLight) {
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
        }        else if (type === 'hemispheric') {
            // 環境光モード（特殊な雰囲気を出す）
            selectedLight.intensity = 0.9; // 少し強めに
            const hemiLight = selectedLight as HemisphericLight;
            
            // ここで明示的にデフォルトと異なる特殊な光の設定を行う
            hemiLight.diffuse = new Color3(0.7, 0.7, 1.0); // 青みがかった冷たい光
            hemiLight.groundColor = new Color3(0.3, 0.2, 0.4); // 紫色の照り返し
        }else {
            selectedLight.intensity = 0.7; // その他のライトは標準の強度
        }
        console.log(`Switched to ${type} light`);    } else if (type === 'default') {
        // デフォルトは環境光のみ有効にする
        if (lights.hemispheric) {
            // ライトの強度だけ設定（色などはすでにリセット済み）
            lights.hemispheric.intensity = 0.7;
            console.log(`Switched to default (hemispheric) light`);
        }
    }

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
}
