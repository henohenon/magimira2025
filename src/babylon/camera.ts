import "@babylonjs/loaders";
import type {Scene} from "@babylonjs/core/scene";
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera";
import {FreeCamera} from "@babylonjs/core/Cameras/freeCamera";
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import {events} from "./events";
import {degToRad, radToDeg} from ".";

export type CameraType = "free" | "arc";
// カメラ管理
const cameras: { "free": FreeCamera | null, "arc": ArcRotateCamera | null } = {
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

let _scene: Scene;
events.on("onSceneDefinition", async ({ scene }) => {
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
});


export const switchCamera = (key: CameraType) => {
	if (!cameras[key]) return;
	_scene.activeCamera = cameras[key];
}

export const getActiveCameraType = (): CameraType => {
    return _scene?.activeCamera?.name == "camera-arc" ? "arc" : "free";
}
