import "@babylonjs/loaders";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { events } from "./events";
// Babylon Inspector（デバッグ用・任意）
// import "@babylonjs/inspector";

events.on("onSceneDefinition", ({ scene }) => {
	/* --- どっと式ミクさん --- */
	AppendSceneAsync("./dotmiku.glb", scene).then(() => {
		for(const mesh of scene.meshes) {
			const mat = mesh.material;
			if(mat) {
				// mat.backFaceCulling = false;
				mat.needDepthPrePass = true;
				mesh.material = mat;
			}
			// mesh.alwaysSelectAsActiveMesh = true;
		}
		console.log("GLTF loaded!");
	});
});