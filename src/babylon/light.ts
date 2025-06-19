import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight";
import {SpotLight} from "@babylonjs/core/Lights/spotLight";
import {PointLight} from "@babylonjs/core/Lights/pointLight";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {Color3} from "@babylonjs/core/Maths/math.color";
import {events} from "./events";

export type LightType = 'spot' | 'point' | 'hemispheric';
const lights = {} as Record<LightType, HemisphericLight | SpotLight | PointLight>;

// デフォルト設定の保存
const hemisphericSettings = {
    intensity: 0.7,
    diffuse: new Color3(1, 1, 0.9), // 青みがかった冷たい光
    groundColor: new Color3(0.2, 0.2, 0.3), // 反射光に暗めの青を追加
    direction: new Vector3(0, 1, 0)
};
const spotSettings = {
    intensity: 0,
    diffuse: new Color3(1, 0.8, 0.8), // 暖かい色調
    position: new Vector3(0, 3, -5), // 位置を調整（少し低く、ミクの正面へ）
    direction: new Vector3(0, 0, 1), // 方向を調整（ミクの正面から照らす）
    range: 10, // 光の届く範囲を設定
    exponent: 1 // 減衰を弱く
};
const pointSettings = {
    intensity: 0,
    diffuse: new Color3(0.6, 0.6, 1), // 青みがかった光（少し明るく）
    position: new Vector3(0, 2, 0),
};

export const resetHemispheric = () => {
    const hemi = lights.hemispheric as HemisphericLight;
    hemi.intensity = hemisphericSettings.intensity;
    hemi.diffuse = hemisphericSettings.diffuse;
    hemi.groundColor = hemisphericSettings.groundColor;
    hemi.direction = hemisphericSettings.direction;
}
export const resetSpot = () => {
    const spot = lights.spot as SpotLight;
    spot.intensity = spotSettings.intensity;
    spot.diffuse = spotSettings.diffuse;
    spot.position = spotSettings.position;
    spot.direction = spotSettings.direction;
    spot.range = spotSettings.range;
    spot.exponent = spotSettings.exponent;
}
export const resetPoint = () => {
    const point = lights.point as PointLight;
    point.intensity = pointSettings.intensity;
    point.diffuse = pointSettings.diffuse;
    point.position = pointSettings.position;
}

events.on("onSceneDefinition", ({scene}) => {
    // デフォルトライト (環境光)
    lights.hemispheric = new HemisphericLight("hemisphericLight", hemisphericSettings.direction!, scene);
    resetHemispheric();

    // スポットライト (初期状態では無効)
    lights.spot = new SpotLight("spotLight", spotSettings.position!, spotSettings.direction!, spotSettings.range!, spotSettings.exponent!, scene);
    resetSpot();

    // ポイントライト (初期状態では無効)
    lights.point = new PointLight("pointLight", pointSettings.position!, scene);
    resetPoint();
});

export function setLightEnabled(lightType: LightType, enabled: boolean) {
    lights[lightType].setEnabled(enabled);
}

export function setLightDiffuse(lightType: LightType, color: string) {
    lights[lightType].diffuse = Color3.FromHexString(color);
}

export function setHemisphericGroundColor(color: string) {
    const hemi = lights.hemispheric as HemisphericLight;
    hemi.groundColor = Color3.FromHexString(color);
}

export function setLightIntensity(lightType: LightType, intensity: number) {
    lights[lightType].intensity = intensity;
}

type DirectionLightType = 'spot' | 'hemispheric';
export function addLightDirection(lightType: DirectionLightType, x: number, y: number, z: number) {
    const light = lights[lightType] as SpotLight | HemisphericLight;
    light.direction.addInPlace(new Vector3(x, y, z));
}
export function setLightDirection(lightType: DirectionLightType, x: number, y: number, z: number) {
    const light = lights[lightType] as SpotLight | HemisphericLight;
    light.direction.set(x, y, z);
}

type PositionLightType = 'spot' | 'point';
export function addLightPosition(lightType: PositionLightType, x: number, y: number, z: number) {
    const light = lights[lightType] as SpotLight | PointLight;
    light.position.addInPlace(new Vector3(x, y, z));
}

export function setLightPosition(lightType: PositionLightType, x: number, y: number, z: number) {
    const light = lights[lightType] as SpotLight | PointLight;
    light.position.set(x, y, z);
}

// Getter functions for light properties
export function getLightEnabled(lightType: LightType): boolean {
    return lights[lightType].isEnabled();
}

export function getLightDiffuse(lightType: LightType): Color3 {
    return lights[lightType].diffuse;
}

export function getHemisphericGroundColor(): Color3 {
    const hemi = lights.hemispheric as HemisphericLight;
    return hemi.groundColor;
}

export function getLightIntensity(lightType: LightType): number {
    return lights[lightType].intensity;
}

export function getLightDirection(lightType: DirectionLightType): Vector3 {
    const light = lights[lightType] as SpotLight | HemisphericLight;
    return light.direction;
}

export function getLightPosition(lightType: PositionLightType): Vector3 {
    const light = lights[lightType] as SpotLight | PointLight;
    return light.position;
}
