import "@babylonjs/loaders";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import type { ILoadingScreen } from "@babylonjs/core/Loading/loadingScreen";
import { events } from "./events";
import "./mdl";
import "./room";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
if (!canvas) {
	throw new Error("Canvas not found");
}

const engine = new Engine(canvas, true);
const scene = new Scene(engine);
events.emit("onSceneDefinition", { engine, scene });
// デフォルトローディング画面を非表示
engine.hideLoadingUI();

/* カメラ */
const camera = new ArcRotateCamera(
	"camera",
	-Math.PI / 2,
	Math.PI / 3,
	6,
	new Vector3(0, 1, 0),
	scene,
);
// camera.minZ = 0.001;
camera.attachControl(canvas, true);

/* 環境光 */
const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
light.intensity = 1;

/* --- レンダリング開始 --- */
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());

scene.executeWhenReady(()=>{
	events.emit("onSceneLoaded");
});