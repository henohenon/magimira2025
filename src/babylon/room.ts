import "@babylonjs/loaders";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { events } from "./events";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";


events.on("onSceneDefinition", async ({ scene }) => {
	await AppendSceneAsync("/room.glb", scene);
});
