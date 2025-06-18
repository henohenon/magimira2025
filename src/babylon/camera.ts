import "@babylonjs/loaders";
import type {Scene} from "@babylonjs/core/scene";
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera";
import {FreeCamera} from "@babylonjs/core/Cameras/freeCamera";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import {events} from "./events";

export type CameraType = "default" | "front" | "side" | "top" | "normal";
// カメラ管理
const cameras = {} as Record<CameraType, ArcRotateCamera | FreeCamera>;

// 初期状態の保存
interface CameraInitialState {
	alpha: number;
	beta: number;
	radius: number;
	target: Vector3;
}

const initialCameraStates: { [key: string]: CameraInitialState } = {};

// Normal camera (FreeCamera) implementation
let normalCamera: FreeCamera;
let _scene: Scene;
events.on("onSceneDefinition", async ({ scene }) => {
    _scene = scene;

	// デフォルトカメラ（後ろ固定）
	cameras.default = new ArcRotateCamera(
		"camera-default",
		-Math.PI / 2,
		Math.PI / 3,
		6,
		new Vector3(0, 1, 0),
		scene,
	);

	// 横カメラ（元：正面の設定）
	cameras.side = new ArcRotateCamera(
		"camera-side",
		Math.PI,
		Math.PI / 2.2,
		6,
		new Vector3(0, 1, 0),
		scene,
	);

	// 正面カメラ（元：横の設定）
	cameras.front = new ArcRotateCamera(
		"camera-front",
		Math.PI / 2,
		Math.PI / 2.2,
		6,
		new Vector3(0, 1, 0),
		scene,
	);

	// 上部カメラ
	cameras.top = new ArcRotateCamera(
		"camera-top",
		-Math.PI / 2,
		0.3, // 少し角度を調整（0.2から0.3へ）
		6, // 距離を半分に縮小（10から5へ）
		new Vector3(0, 1.3, 0), // ターゲット位置を少し上に（頭部付近）
		scene,
	);

	// ノーマルカメラ（FreeCamera）
	normalCamera = new FreeCamera(
		"camera-normal",
		new Vector3(0, 1.5, -5), // Position the camera slightly above ground level and back from origin
		scene,
	);

	// Set the target to look at
	normalCamera.setTarget(new Vector3(0, 1, 0)); // Look at a point slightly above the origin

	// Enable camera controls
	normalCamera.attachControl();

	cameras.normal = normalCamera;

	/*
    for(const camera of Object.values(cameras)) {
        camera.detachControl();
    }*/

    // 初期状態を保存
	for (const [key, camera] of Object.entries(cameras)) {
		if (camera instanceof ArcRotateCamera) {
			initialCameraStates[key] = {
				alpha: camera.alpha,
				beta: camera.beta,
				radius: camera.radius,
				target: camera.target.clone()
			};
		} else if (camera instanceof FreeCamera) {
			// For FreeCamera, store position as target and use default values for rotation
			initialCameraStates[key] = {
				alpha: 0,
				beta: 0,
				radius: 0,
				target: camera.position.clone()
			};
		}
	}
});


export function switchCamera(key: CameraType) {
	if (!cameras[key]) return;
	_scene.activeCamera = cameras[key];
}

// カメラの位置に指定された値を加算する関数
export function addCameraPosition(key: CameraType, x: number, y: number, z: number) {
	// キーが存在し、かつ値が数値の場合のみ処理を続行
	if (!cameras[key] || isNaN(x) || isNaN(y) || isNaN(z)) {
		console.warn(`Invalid camera key or position values: ${key}, x=${x}, y=${y}, z=${z}`);
		return false;
	}

	const camera = cameras[key];

	if (camera instanceof ArcRotateCamera) {
		const currentTarget = camera.target;

		// 相対的に移動（現在の位置に加算）
		const newTarget = new Vector3(
			currentTarget.x + x,
			currentTarget.y + y,
			currentTarget.z + z
		);

		// カメラのターゲット（注視点）を更新
		camera.setTarget(newTarget);
	} else if (camera instanceof FreeCamera) {
		// For FreeCamera, adjust the position directly
		camera.position.addInPlace(new Vector3(x, y, z));
	}

	// 現在アクティブなカメラの場合は、シーンのカメラも更新
	/*
	if (_scene.activeCamera === camera) {
		_scene.activeCamera = camera;
	}*/

	console.log(`Camera ${key} position adjusted by: x=${x}, y=${y}, z=${z}`);
	return true;
}

// X軸方向のみ位置調整
export function addCameraPositionX(key: CameraType, x: number) {
	return addCameraPosition(key, x, 0, 0);
}

// Y軸方向のみ位置調整
export function addCameraPositionY(key: CameraType, y: number) {
	return addCameraPosition(key, 0, y, 0);
}

// Z軸方向のみ位置調整
export function addCameraPositionZ(key: CameraType, z: number) {
	return addCameraPosition(key, 0, 0, z);
}

// カメラの位置を直接設定する関数
export function setCameraPosition(key: CameraType, x: number, y: number, z: number) {
	if (!cameras[key] || isNaN(x) || isNaN(y) || isNaN(z)) {
		console.warn(`Invalid camera key or position values: ${key}, x=${x}, y=${y}, z=${z}`);
		return false;
	}

	const camera = cameras[key];

	if (camera instanceof ArcRotateCamera) {
		// 位置を直接設定
		const newTarget = new Vector3(x, y, z);
		camera.setTarget(newTarget);
	} else if (camera instanceof FreeCamera) {
		// For FreeCamera, set the position directly
		camera.position = new Vector3(x, y, z);
	}

	/*
	// 現在アクティブなカメラの場合は、シーンのカメラも更新
	if (_scene.activeCamera === camera) {
		_scene.activeCamera = camera;
	}*/

	console.log(`Camera ${key} position set to: x=${x}, y=${y}, z=${z}`);
	return true;
}

// カメラの回転を調整する関数（アルファ、ベータ、半径を変更）
export function addCameraRotation(key: CameraType, alpha: number, beta: number, radius: number) {
	if (!cameras[key] || isNaN(alpha) || isNaN(beta) || isNaN(radius)) {
		console.warn(`Invalid camera key or rotation values: ${key}, alpha=${alpha}, beta=${beta}, radius=${radius}`);
		return false;
	}

	const camera = cameras[key];

	if (camera instanceof ArcRotateCamera) {
		// 現在の値に加算
		camera.alpha += alpha;
		camera.beta += beta;
		camera.radius += radius;

		applyArcLimit(camera);

		console.log(`ArcRotateCamera ${key} rotation adjusted by: alpha=${alpha}, beta=${beta}, radius=${radius}`);
	} else if (camera instanceof FreeCamera) {
		// For FreeCamera, rotation is handled differently
		// alpha affects rotation around Y axis (yaw)
		// beta affects rotation around X axis (pitch)
		// radius is not applicable for FreeCamera

		// Convert alpha and beta to radians if they're not already
		camera.rotation.y += alpha;
		camera.rotation.x += beta;

		console.log(`FreeCamera ${key} rotation adjusted by: yaw=${alpha}, pitch=${beta}`);
	}

	return true;
}

// アルファ（水平角）のみ調整
export function addCameraRotationX(key: CameraType, alpha: number) {
	return addCameraRotation(key, alpha, 0, 0);
}

// ベータ（垂直角）のみ調整
export function addCameraRotationY(key: CameraType, beta: number) {
	return addCameraRotation(key, 0, beta, 0);
}

// 半径（距離）のみ調整
export function addCameraRotationZ(key: CameraType, radius: number) {
	return addCameraRotation(key, 0, 0, radius);
}

// カメラの回転を直接設定する関数
export function setCameraRotation(key: CameraType, alpha: number, beta: number, radius: number) {
	if (!cameras[key] || isNaN(alpha) || isNaN(beta) || isNaN(radius)) {
		console.warn(`Invalid camera key or rotation values: ${key}, alpha=${alpha}, beta=${beta}, radius=${radius}`);
		return false;
	}

	const camera = cameras[key];

	if (camera instanceof ArcRotateCamera) {
		// 値を直接設定
		camera.alpha = alpha;
		camera.beta = beta;
		camera.radius = radius;

		applyArcLimit(camera);

		console.log(`ArcRotateCamera ${key} rotation set to: alpha=${alpha}, beta=${beta}, radius=${radius}`);
	} else {
		// For FreeCamera, set rotation directly
		// alpha affects rotation around Y axis (yaw)
		// beta affects rotation around X axis (pitch)
		// radius is not applicable for FreeCamera
		camera.rotation.y = alpha;
		camera.rotation.x = beta;

		console.log(`FreeCamera ${key} rotation set to: yaw=${alpha}, pitch=${beta}`);
	}

	return true;
}

function applyArcLimit(camera: ArcRotateCamera) {
	// 値の範囲を制限（必要に応じて）
	if (camera.beta < 0.1) camera.beta = 0.1;
	if (camera.beta > Math.PI - 0.1) camera.beta = Math.PI - 0.1;
	if (camera.radius < 1) camera.radius = 1;
}

// カメラの現在位置を取得する関数
export function getCameraPosition(key: CameraType): { x: number, y: number, z: number } | null {
	if (!cameras[key]) {
		console.warn(`カメラ "${key}" が見つかりません`);
		return null;
	}

	const camera = cameras[key];
	return {
		x: camera.target.x,
		y: camera.target.y,
z: camera.target.z
	};
}

// カメラの現在の回転情報を取得する関数
export function getCameraRotation(key: CameraType): { alpha: number, beta: number, radius: number } | null {
	if (!cameras[key]) {
		console.warn(`カメラ "${key}" が見つかりません`);
		return null;
	}

	const camera = cameras[key] as ArcRotateCamera;
	return {
		alpha: camera.alpha,
		beta: camera.beta,
		radius: camera.radius
	};
}

// 現在アクティブなカメラのキーを取得する関数
export function getActiveCamera(): CameraType | null {
	for (const [key, camera] of Object.entries(cameras)) {
		if (_scene.activeCamera === camera) {
			return key as CameraType
		}
	}
	return null;
}

// 全カメラを初期状態に戻す関数
export function resetAllCamerasToInitial() {
    for (const key of Object.keys(cameras)) {
		resetCameraToInitial(key as CameraType)
    }
    console.log('All cameras reset to initial state');
    return true;
}

// 特定のカメラを初期状態に戻す関数
export function resetCameraToInitial(key: CameraType) {
    const camera = cameras[key];
    const initialState = initialCameraStates[key];

    if (!camera || !initialState) {
        console.warn(`Camera "${key}" or its initial state not found`);
        return false;
    }

    if (camera instanceof ArcRotateCamera) {
        camera.alpha = initialState.alpha;
        camera.beta = initialState.beta;
        camera.radius = initialState.radius;
        camera.setTarget(initialState.target.clone());

        console.log(`ArcRotateCamera ${key} reset to initial state`);
    } else if (camera instanceof FreeCamera) {
        // For FreeCamera, restore the position
        camera.position = initialState.target.clone();
        // Reset rotation to default (looking forward)
        camera.rotation.x = 0;
        camera.rotation.y = 0;
        camera.rotation.z = 0;

        console.log(`FreeCamera ${key} reset to initial state`);
    }

    return true;
}

// Function to get the normal camera instance
export function getNormalCamera(): FreeCamera {
    return normalCamera;
}

// Function to activate the normal camera
export function activateNormalCamera() {
    if (!normalCamera || !_scene) return;
    _scene.activeCamera = normalCamera;
}

// Function to set the position of the normal camera
export function setNormalCameraPosition(x: number, y: number, z: number) {
    if (!normalCamera) return false;
    normalCamera.position = new Vector3(x, y, z);
    return true;
}

// Function to set the target of the normal camera
export function setNormalCameraTarget(x: number, y: number, z: number) {
    if (!normalCamera) return false;
    normalCamera.setTarget(new Vector3(x, y, z));
    return true;
}

