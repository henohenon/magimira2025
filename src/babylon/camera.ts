import "@babylonjs/loaders";
import type { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { events } from "./events";

const canvas = document.getElementById("babylon-canvas") as HTMLCanvasElement;
if (!canvas) {
    throw new Error("Canvas not found");
}

// カメラ管理
const cameras: { [key: string]: ArcRotateCamera } = {};
let activeCamera: ArcRotateCamera;
let _scene: Scene;
events.on("onSceneDefinition", async ({ scene }) => {
    _scene = scene;

	// デフォルトカメラ（後ろ固定）
	const cameraDefault = new ArcRotateCamera(
		"camera-default",
		-Math.PI / 2,
		Math.PI / 3,
		6,
		new Vector3(0, 1, 0),
		scene,
	);
	cameras.default = cameraDefault;

	// 横カメラ（元：正面の設定）
	const cameraSide = new ArcRotateCamera(
		"camera-side",
		Math.PI,
		Math.PI / 2.2,
		6,
		new Vector3(0, 1, 0),
		scene,
	);
	cameras.side = cameraSide;

	// 正面カメラ（元：横の設定）
	const cameraFront = new ArcRotateCamera(
		"camera-front",
		Math.PI / 2,
		Math.PI / 2.2,
		6,
		new Vector3(0, 1, 0),
		scene,
	);
	cameras.front = cameraFront;

	// 上部カメラ
	const cameraTop = new ArcRotateCamera(
		"camera-top",
		-Math.PI / 2,
		0.3, // 少し角度を調整（0.2から0.3へ）
		6, // 距離を半分に縮小（10から5へ）
		new Vector3(0, 1.3, 0), // ターゲット位置を少し上に（頭部付近）
		scene,
	);
	cameras.top = cameraTop;

	// 自由視点カメラ（ユーザーがマウスで自由に動かせる）
	const cameraFree = new ArcRotateCamera(
		"camera-free",
		-Math.PI / 2,
		Math.PI / 3,
		6,
		new Vector3(0, 1, 0),
		scene,
	);
	// 自由視点カメラの操作設定
	cameraFree.panningSensibility = 50;
	cameraFree.wheelPrecision = 50;
	cameraFree.angularSensibilityX = 500;
	cameraFree.angularSensibilityY = 500;
    cameraFree.attachControl(canvas, true);
	cameras.free = cameraFree;
    
    activeCamera = cameras.default;
    _scene.activeCamera = activeCamera;

    for(const camera of Object.values(cameras)) {
        camera.detachControl();
    };
});


export function switchCamera(key: string) {
	if (!cameras[key]) return;
	if (_scene.activeCamera) {
		(_scene.activeCamera as ArcRotateCamera).detachControl();
	}
	activeCamera = cameras[key];
	_scene.activeCamera = activeCamera;
	// 前回のカメラを完全に無効化
	for (const cam of Object.values(cameras)) {
		cam.detachControl();
	}

	// 新しいカメラを設定
	activeCamera = cameras[key];
	_scene.activeCamera = activeCamera;

	// 自由視点のみマウスで自由に動かせる
	if (key === "free") {
		// 自由視点の場合は操作を有効化
		canvas.style.cursor = "grab";
		canvas.style.touchAction = "none"; // タッチ操作の標準動作を無効化
		activeCamera.inputs.attached.mouse.detachControl(); // 一度リセット
		activeCamera.attachControl(canvas, true); // 再アタッチ

		// カメラの動作制限を緩和
		activeCamera.lowerBetaLimit = 0.01;
		activeCamera.upperBetaLimit = Math.PI - 0.01;
		activeCamera.lowerRadiusLimit = 1;
		activeCamera.upperRadiusLimit = 30;
		activeCamera.panningSensibility = 50;
		activeCamera.wheelPrecision = 50;
		activeCamera.angularSensibilityX = 500;
		activeCamera.angularSensibilityY = 500;

		// イベントリスナーをクリア（重複防止）
		canvas.onpointerdown = null;
		canvas.onpointerup = null;

		// カーソル変更用のリスナー
		canvas.onpointerdown = () => {
			canvas.style.cursor = "grabbing";
		};
		canvas.onpointerup = () => {
			canvas.style.cursor = "grab";
		};
	} else {
		// 固定視点カメラ
		canvas.style.cursor = "default";
		canvas.style.touchAction = "auto";
		activeCamera.inputs.clear(); // すべての入力を無効化
	}

	// ボタンのハイライト切替
	for (const id of ["default", "front", "side", "top", "free"]) {
		const btn = document.getElementById(`camera-${id}`);
		if (btn) {
			if (id === key) {
				btn.classList.add("bg-blue-500", "text-white");
			} else {
				btn.classList.remove("bg-blue-500", "text-white");
			}
		}
	}
}

// カメラの位置に指定された値を加算する関数
export function addCameraPosition(key: string, x: number, y: number, z: number) {
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
	if (_scene.activeCamera === camera) {
		_scene.activeCamera = camera;
	}
	
	console.log(`Camera ${key} position adjusted by: x=${x}, y=${y}, z=${z}`);
	return true;
}

// X軸方向のみ位置調整
export function addCameraPositionX(key: string, x: number) {
	return addCameraPosition(key, x, 0, 0);
}

// Y軸方向のみ位置調整
export function addCameraPositionY(key: string, y: number) {
	return addCameraPosition(key, 0, y, 0);
}

// Z軸方向のみ位置調整
export function addCameraPositionZ(key: string, z: number) {
	return addCameraPosition(key, 0, 0, z);
}

// カメラの位置を直接設定する関数
export function setCameraPosition(key: string, x: number, y: number, z: number) {
	if (!cameras[key] || isNaN(x) || isNaN(y) || isNaN(z)) {
		console.warn(`Invalid camera key or position values: ${key}, x=${x}, y=${y}, z=${z}`);
		return false;
	}

	const camera = cameras[key];
	
	// 位置を直接設定
	const newTarget = new Vector3(x, y, z);
	camera.setTarget(newTarget);
	
	// 現在アクティブなカメラの場合は、シーンのカメラも更新
	if (_scene.activeCamera === camera) {
		_scene.activeCamera = camera;
	}
	
	console.log(`Camera ${key} position set to: x=${x}, y=${y}, z=${z}`);
	return true;
}

// カメラの回転を調整する関数（アルファ、ベータ、半径を変更）
export function addCameraRotation(key: string, alpha: number, beta: number, radius: number) {
	if (!cameras[key] || isNaN(alpha) || isNaN(beta) || isNaN(radius)) {
		console.warn(`Invalid camera key or rotation values: ${key}, alpha=${alpha}, beta=${beta}, radius=${radius}`);
		return false;
	}

	const camera = cameras[key] as ArcRotateCamera;
	
	// 現在の値に加算
	camera.alpha += alpha;
	camera.beta += beta;
	camera.radius += radius;
	
	// 値の範囲を制限（必要に応じて）
	if (camera.beta < 0.1) camera.beta = 0.1;
	if (camera.beta > Math.PI - 0.1) camera.beta = Math.PI - 0.1;
	if (camera.radius < 1) camera.radius = 1;
	
	console.log(`Camera ${key} rotation adjusted by: alpha=${alpha}, beta=${beta}, radius=${radius}`);
	return true;
}

// アルファ（水平角）のみ調整
export function addCameraRotationX(key: string, alpha: number) {
	return addCameraRotation(key, alpha, 0, 0);
}

// ベータ（垂直角）のみ調整
export function addCameraRotationY(key: string, beta: number) {
	return addCameraRotation(key, 0, beta, 0);
}

// 半径（距離）のみ調整
export function addCameraRotationZ(key: string, radius: number) {
	return addCameraRotation(key, 0, 0, radius);
}

// カメラの回転を直接設定する関数
export function setCameraRotation(key: string, alpha: number, beta: number, radius: number) {
	if (!cameras[key] || isNaN(alpha) || isNaN(beta) || isNaN(radius)) {
		console.warn(`Invalid camera key or rotation values: ${key}, alpha=${alpha}, beta=${beta}, radius=${radius}`);
		return false;
	}

	const camera = cameras[key] as ArcRotateCamera;
	
	// 値を直接設定
	camera.alpha = alpha;
	camera.beta = beta;
	camera.radius = radius;
	
	// 値の範囲を制限（必要に応じて）
	if (camera.beta < 0.1) camera.beta = 0.1;
	if (camera.beta > Math.PI - 0.1) camera.beta = Math.PI - 0.1;
	if (camera.radius < 1) camera.radius = 1;
	
	console.log(`Camera ${key} rotation set to: alpha=${alpha}, beta=${beta}, radius=${radius}`);
	return true;
}

// カメラの現在位置を取得する関数
export function getCameraPosition(key: string): { x: number, y: number, z: number } | null {
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
export function getCameraRotation(key: string): { alpha: number, beta: number, radius: number } | null {
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
export function getActiveCamera(): string | null {
	for (const [key, camera] of Object.entries(cameras)) {
		if (camera === activeCamera) {
			return key;
		}
	}
	return null;
}
