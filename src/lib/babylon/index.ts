import "@babylonjs/loaders";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";

import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { events } from "./events";
import "./mdl";
import "./camera";
import "./light";

const canvas = document.getElementById("babylon-canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas not found");
}

export const engine = new Engine(canvas, true);
export const scene = new Scene(engine);
events.emit("onSceneDefinition", { engine, scene });
// デフォルトローディング画面を非表示
engine.hideLoadingUI();

// シーン生成後 (onSceneDefinition や scene作成箇所で)
const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);

const skyboxMaterial = new StandardMaterial("skyBoxMaterial", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.diffuseColor = new Color3(0.85, 0.93, 1.0); // 淡い水色系
skyboxMaterial.specularColor = new Color3(0, 0, 0);

skybox.material = skyboxMaterial;
skybox.infiniteDistance = true; // skyboxは無限遠に見せる

/* 環境光 */
// const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene); // ← 初期ライト設定をlight.tsに移動したのでコメントアウトまたは削除
// light.intensity = 1; // ← 初期ライト設定をlight.tsに移動したのでコメントアウトまたは削除


scene.executeWhenReady(()=>{
	events.emit("onSceneLoaded");
});

window.addEventListener("resize", () => engine.resize());


export const degToRad = (deg: number) => deg * Math.PI / 180;
export const radToDeg = (rad: number) => rad * 180 / Math.PI;