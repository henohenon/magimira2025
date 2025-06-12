import "@babylonjs/loaders";
import type {Scene} from "@babylonjs/core/scene";
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import {events} from "./events";

export type CameraType = "default" | "front" | "side" | "top";
// カメラ管理
const cameras = {} as Record<CameraType, ArcRotateCamera>;

// 初期状態の保存
interface CameraInitialState {
	alpha: number;
	beta: number;
	radius: number;
	target: Vector3;
}

const initialCameraStates: { [key: string]: CameraInitialState } = {};

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

	/*
    for(const camera of Object.values(cameras)) {
        camera.detachControl();
    }*/
    
    // 初期状態を保存
	for (const [key, camera] of Object.entries(cameras)) {
		const arcCamera = camera as ArcRotateCamera;
		initialCameraStates[key] = {
			alpha: arcCamera.alpha,
			beta: arcCamera.beta,
			radius: arcCamera.radius,
			target: arcCamera.target.clone()
		};
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
	const currentTarget = camera.target;
	
	// 相対的に移動（現在の位置に加算）
	const newTarget = new Vector3(
		currentTarget.x + x,
		currentTarget.y + y,
		currentTarget.z + z
	);
	
	// カメラのターゲット（注視点）を更新
	camera.setTarget(newTarget);

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
	
	// 位置を直接設定
	const newTarget = new Vector3(x, y, z);
	camera.setTarget(newTarget);

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

	const camera = cameras[key] as ArcRotateCamera;
	
	// 現在の値に加算
	camera.alpha += alpha;
	camera.beta += beta;
	camera.radius += radius;

	applyArcLimit(camera);

	console.log(`Camera ${key} rotation adjusted by: alpha=${alpha}, beta=${beta}, radius=${radius}`);
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

	const camera = cameras[key] as ArcRotateCamera;

	// 値を直接設定
	camera.alpha = alpha;
	camera.beta = beta;
	camera.radius = radius;

	applyArcLimit(camera);
	
	console.log(`Camera ${key} rotation set to: alpha=${alpha}, beta=${beta}, radius=${radius}`);
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
    const camera = cameras[key] as ArcRotateCamera;
    const initialState = initialCameraStates[key];
    
    if (!camera || !initialState) {
        console.warn(`Camera "${key}" or its initial state not found`);
        return false;
    }
    
    camera.alpha = initialState.alpha;
    camera.beta = initialState.beta;
    camera.radius = initialState.radius;
    camera.setTarget(initialState.target.clone());
    
    console.log(`Camera ${key} reset to initial state`);
    return true;
}
