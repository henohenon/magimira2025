import "@babylonjs/loaders";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";

import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { events } from "./events";
import "./mdl";
import "./camera";
import "./camera/normal";
import "./light";

const canvas = document.getElementById("babylon-canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas not found");
}

const engine = new Engine(canvas, true);
const scene = new Scene(engine);
events.emit("onSceneDefinition", { engine, scene });
// デフォルトローディング画面を非表示
engine.hideLoadingUI();


/* 環境光 */
// const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene); // ← 初期ライト設定をlight.tsに移動したのでコメントアウトまたは削除
// light.intensity = 1; // ← 初期ライト設定をlight.tsに移動したのでコメントアウトまたは削除


scene.executeWhenReady(()=>{
	events.emit("onSceneLoaded");
});

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
