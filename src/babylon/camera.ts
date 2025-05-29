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
