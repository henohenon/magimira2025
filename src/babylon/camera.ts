import "@babylonjs/loaders";
import {type Nullable} from "@babylonjs/core";
import type {Scene} from "@babylonjs/core/scene";
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera";
import {FreeCamera} from "@babylonjs/core/Cameras/freeCamera";
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { PostProcess } from "@babylonjs/core/PostProcesses/postProcess";
import { Effect, RenderTargetTexture } from "@babylonjs/core/Materials";

import {degToRad, radToDeg} from ".";
import {events} from "./events";
import {tween, type TweenControl} from "~/update/tween.ts";

export type CameraType = "free" | "arc";
// カメラ管理
const cameras: { "free": Nullable<FreeCamera>, "arc": Nullable<ArcRotateCamera> } = {
	"free": null,
	"arc": null,
}
// ArcRotateCamera specific functions
export const addArcTargetPosition = (x: number, y: number, z: number): void => {
	const camera = cameras.arc;
	if (!camera) return;
    const currentTarget = camera.getTarget();
    // 相対的に移動（現在の位置に加算）
    const newTarget = currentTarget.add(new Vector3(x, y, z));

    // カメラのターゲット（注視点）を更新
    camera.setTarget(newTarget);
};

export const setArcTargetPosition = (x: number, y: number, z: number): void => {
    const camera = cameras.arc;
    if (!camera) return;
    // 位置を直接設定
    const newTarget = new Vector3(x, y, z);
    camera.setTarget(newTarget);
};

export const addArcSphericalCoordinates= (alpha: number, beta: number, radius: number): void => {
    const camera = cameras.arc;
    if (!camera) return;
    // 現在の値に加算 (convert degrees to radians)
    camera.alpha += degToRad(alpha);
    camera.beta += degToRad(beta);
    camera.radius += radius;
};

export const setArcSphericalCoordinates = (alpha: number, beta: number, radius: number): void => {
    const camera = cameras.arc;
    if (!camera) return;
    // 値を直接設定 (convert degrees to radians)
    camera.alpha = degToRad(alpha);
    camera.beta = degToRad(beta);
    camera.radius = radius;
};

export const getArcTargetPosition = (): { x: number, y: number, z: number } | undefined => {
    return cameras.arc?.target;
};

export const getArcSphericalCoordinates = (): { alpha: number, beta: number, radius: number } | undefined => {
    const camera = cameras.arc;
    return camera ? { alpha: radToDeg(camera.alpha), beta: radToDeg(camera.beta), radius: camera.radius } : undefined;
};



// FreeCamera specific functions
export const addFreePosition = (x: number, y: number, z: number): void => {
    const camera = cameras.free;
    if (!camera) return;
    // Add to current position
    const currentPosition = camera.position;
    // Update camera position
    camera.position = currentPosition.add(new Vector3(x, y, z));
};

export const setFreePosition = (x: number, y: number, z: number): void => {
    const camera = cameras.free;
    if (!camera) return;
    // Set position directly
    camera.position = new Vector3(x, y, z);
};

export const addFreeRotation = (yaw: number, pitch: number, roll: number): void => {
    const camera = cameras.free;
    if (!camera) return;
    // Create a quaternion from the yaw, pitch, roll values (convert degrees to radians)
    const rotationToAdd = Quaternion.RotationYawPitchRoll(degToRad(yaw), degToRad(pitch), degToRad(roll));

	const currentRotation = camera.rotationQuaternion || Quaternion.Identity();
	camera.rotationQuaternion = currentRotation.multiply(rotationToAdd);
};

export const setFreeRotation = (yaw: number, pitch: number, roll: number): void => {
    const camera = cameras.free;
    if (!camera) return;
    // Set rotation directly using quaternion (convert degrees to radians)
    camera.rotationQuaternion = Quaternion.RotationYawPitchRoll(
        degToRad(yaw), degToRad(pitch), degToRad(roll)
    );
};

export const getFreePosition = (): { x: number, y: number, z: number } | undefined => {
    const camera = cameras.free;
    return camera ? camera.position : undefined;
};

export const getFreeRotation = (): { x: number, y: number, z: number } | undefined => {
    const camera = cameras.free;
    if (!camera || !camera.rotationQuaternion) return undefined;
	// Convert quaternion to Euler angles
	const euler = camera.rotationQuaternion.toEulerAngles() || new Vector3(0, 0, 0);
	// Return in degrees (pitch, yaw, roll)
	return {
		x: radToDeg(euler.x), // pitch
		y: radToDeg(euler.y), // yaw
		z: radToDeg(euler.z)  // roll
	};
};

let crossRt: RenderTargetTexture;
let crossPp: PostProcess;
let crossFadeRate = 0.0;
let _scene: Scene;
events.on("onSceneDefinition", async ({ engine, scene }) => {
    _scene = scene;

	// Arc camera (rotatable around target)
	cameras.arc = new ArcRotateCamera(
		"camera-arc",
		-Math.PI / 2,
		Math.PI / 3,
		6,
		new Vector3(0, 1, 0),
		scene,
	);

	// Free camera (movable)
	cameras.free = new FreeCamera(
		"camera-free",
		new Vector3(0, 1.5, -5), // Position the camera slightly above ground level and back from origin
		scene,
	);

    _scene.activeCamera = cameras.free;


    // クロスフェード用
    Effect.ShadersStore["crossfadeFragmentShader"] = `
        varying vec2 vUV;
        uniform sampler2D textureSampler;
        uniform sampler2D blendTexture;
        uniform float fade;

        void main(void) {
            vec4 col1 = texture2D(textureSampler, vUV);
            vec4 col2 = texture2D(blendTexture, vUV);
            gl_FragColor = mix(col1, col2, fade);
        }
    `;
    crossRt = new RenderTargetTexture(
        "crossRt",
        { width: engine.getRenderWidth(), height: engine.getRenderHeight() },
        scene,
        false        // generateMipMaps
    );
    crossRt.renderList = scene.meshes;

    crossPp = new PostProcess(
        "crossfade",
        "crossfade",
        ["fade"],                      // ユニフォーム
        ["blendTexture"],              // サンプラ名
        1.0,
        null,                  // 適用したいカメラ
        undefined,
        engine,
        true
    );
    crossPp.onApply = (effect) => {
        effect.setTexture("blendTexture", crossRt);
        effect.setFloat("fade", crossFadeRate);
    };
});

export const switchCamera = (key: CameraType) => {
	if (!cameras[key]) return;
	_scene.activeCamera = cameras[key];
}

let crossFadeTween: TweenControl | null = null;
export const switchCameraWithCrossFade = async (key: CameraType, duration: number) => {
    const currentCamera = _scene.activeCamera;
    const nextCamera = cameras[key];
    if (!currentCamera || !nextCamera) return;

    // Cancel any existing tween
    if (crossFadeTween) {
        crossFadeTween.complete();
        crossFadeTween = null;
    }

    crossRt.activeCamera = currentCamera;
    _scene.customRenderTargets.push(crossRt);

    nextCamera.attachPostProcess(crossPp);

    crossFadeTween = tween(1, 0, duration, (value) => {
        crossFadeRate = value;
    });

    _scene.activeCamera = nextCamera;


    // Wait for the tween to complete using the Promise
    await crossFadeTween.promise;

    // After the tween completes
    nextCamera.detachPostProcess(crossPp);
    _scene.customRenderTargets.pop();
    crossFadeTween = null;
}

export const getActiveCameraType = (): CameraType => {
    return _scene?.activeCamera?.name == "camera-arc" ? "arc" : "free";
}
