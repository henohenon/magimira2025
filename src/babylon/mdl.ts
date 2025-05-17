import "@babylonjs/loaders";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { events } from "./events";
import type { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";

let animGroups: AnimationGroup[] = [];

events.on("onSceneDefinition", async ({ scene }) => {
	/* --- どっと式ミクさん --- */
	await AppendSceneAsync("/dotmiku.glb", scene);

	animGroups = scene.animationGroups;
	for(const animGroup of animGroups) {
		animGroup.pause();
		animGroup.loopAnimation = false;
	}

	for (const mesh of scene.meshes) {
		const mat = mesh.material;
		if (mat) {
			// mat.backFaceCulling = false;
			mat.needDepthPrePass = true;
			mesh.material = mat;
		}
		// mesh.alwaysSelectAsActiveMesh = true;
	}
	
	// const mikuMesh = scene.getMeshByName("__root__");
    console.log("GLTF loaded!");
});

export function playAnimation(name: string) {
	const animGroup = animGroups.find((group) => group.name === name);
	if (animGroup) {
		console.log(`Playing animation: ${name}`);
		animGroup.reset();
		animGroup.play(false);
	} else {
		console.warn(`Animation group "${name}" not found.`);
	}
}