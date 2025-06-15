import "@babylonjs/loaders";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { events } from "./events";
import type { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";
import type { Scene } from "@babylonjs/core/scene";

let animGroups: AnimationGroup[] = [];

/**
 * Load a model from the specified source path
 * @param sourcePath Path to the model file
 * @param scene The scene to append the model to
 * @returns The animation groups from the loaded model
 */
export async function loadModel(sourcePath: string, scene: Scene): Promise<AnimationGroup[]> {
	await AppendSceneAsync(sourcePath, scene);

	// Get the current animation groups
	const modelAnimGroups = scene.animationGroups;

	// Configure animation groups
	for(const animGroup of modelAnimGroups) {
		animGroup.pause();
		animGroup.loopAnimation = false;
	}

	// Process materials for all meshes
	for (const mesh of scene.meshes) {
		const mat = mesh.material;
		if (mat) {
			// mat.backFaceCulling = false;
			mat.needDepthPrePass = true;
			mesh.material = mat;
		}
		// mesh.alwaysSelectAsActiveMesh = true;
	}

	console.log(`Model loaded from ${sourcePath}`);
	return modelAnimGroups;
}

events.on("onSceneDefinition", async ({ scene }) => {
	/* --- どっと式ミクさん --- */
	// Load both models and collect their animation groups
	const dotmikuAnimGroups = await loadModel("/dotmiku.glb", scene);
	const tanabataAnimGroups = await loadModel("/dotmiku-tanabata.glb", scene);

	// Combine animation groups from both models
	animGroups = [...dotmikuAnimGroups, ...tanabataAnimGroups];

	// Emit animation names after loading all models
	const animNames = animGroups.map((group) => group.name);
	events.emit("onMdlAnimLoaded", animNames);

	console.log("All GLTF models loaded!");
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
