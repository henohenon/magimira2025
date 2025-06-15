import "@babylonjs/loaders";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { events } from "./events";
import type { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";
import type { Scene } from "@babylonjs/core/scene";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";

let animGroups: AnimationGroup[] = [];
// Store loaded model meshes by model name
const modelMeshes: Record<string, AbstractMesh[]> = {};

/**
 * Load a model from the specified source path
 * @param sourcePath Path to the model file
 * @param scene The scene to append the model to
 * @returns The animation groups from the loaded model
 */
export async function loadModel(sourcePath: string, scene: Scene): Promise<AnimationGroup[]> {
	// Get the initial mesh count to identify new meshes
	const initialMeshCount = scene.meshes.length;

	await AppendSceneAsync(sourcePath, scene);

	// Get the current animation groups
	const modelAnimGroups = scene.animationGroups;

	// Configure animation groups
	for(const animGroup of modelAnimGroups) {
		animGroup.pause();
		animGroup.loopAnimation = false;
	}

	// Extract model name from source path (remove path and extension)
	const modelName = sourcePath.split('/').pop()?.split('.')[0] || 'unknown';

	// Store the new meshes for this model
	const newMeshes: AbstractMesh[] = [];

	// Process materials for all meshes
	for (let i = initialMeshCount; i < scene.meshes.length; i++) {
		const mesh = scene.meshes[i];
		newMeshes.push(mesh);

		const mat = mesh.material;
		if (mat) {
			// mat.backFaceCulling = false;
			mat.needDepthPrePass = true;
			mesh.material = mat;
		}
		// mesh.alwaysSelectAsActiveMesh = true;
	}

	// Store meshes by model name
	modelMeshes[modelName] = newMeshes;

	console.log(`Model loaded from ${sourcePath} with ${newMeshes.length} meshes`);
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

	// Emit available model names
	const modelNames = getModelNames();
	events.emit("onModelsLoaded", modelNames);

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

/**
 * Get all available model names
 * @returns Array of model names that can be shown/hidden
 */
export function getModelNames(): string[] {
	return Object.keys(modelMeshes);
}

/**
 * Show a model by making all its meshes visible
 * @param modelName Name of the model to show
 * @returns true if model was found and shown, false otherwise
 */
export function showModel(modelName: string): boolean {
	const meshes = modelMeshes[modelName];
	if (!meshes || meshes.length === 0) {
		console.warn(`Model "${modelName}" not found.`);
		return false;
	}

	for (const mesh of meshes) {
		mesh.isVisible = true;
	}

	// Emit event for visibility change
	events.emit("onModelVisibilityChanged", { modelName, visible: true });

	console.log(`Model "${modelName}" is now visible.`);
	return true;
}

/**
 * Hide a model by making all its meshes invisible
 * @param modelName Name of the model to hide
 * @returns true if model was found and hidden, false otherwise
 */
export function hideModel(modelName: string): boolean {
	const meshes = modelMeshes[modelName];
	if (!meshes || meshes.length === 0) {
		console.warn(`Model "${modelName}" not found.`);
		return false;
	}

	for (const mesh of meshes) {
		mesh.isVisible = false;
	}

	// Emit event for visibility change
	events.emit("onModelVisibilityChanged", { modelName, visible: false });

	console.log(`Model "${modelName}" is now hidden.`);
	return true;
}

/**
 * Toggle a model's visibility
 * @param modelName Name of the model to toggle
 * @returns true if model was found and toggled, false otherwise
 */
export function toggleModelVisibility(modelName: string): boolean {
	const meshes = modelMeshes[modelName];
	if (!meshes || meshes.length === 0) {
		console.warn(`Model "${modelName}" not found.`);
		return false;
	}

	// Check current visibility (use first mesh as reference)
	const isCurrentlyVisible = meshes[0].isVisible;

	// Toggle visibility for all meshes
	for (const mesh of meshes) {
		mesh.isVisible = !isCurrentlyVisible;
	}

	// Emit event for visibility change
	events.emit("onModelVisibilityChanged", { modelName, visible: !isCurrentlyVisible });

	console.log(`Model "${modelName}" is now ${!isCurrentlyVisible ? 'visible' : 'hidden'}.`);
	return true;
}

/**
 * Check if a model is currently visible
 * @param modelName Name of the model to check
 * @returns true if model is visible, false if hidden or not found
 */
export function isModelVisible(modelName: string): boolean {
	const meshes = modelMeshes[modelName];
	if (!meshes || meshes.length === 0) {
		console.warn(`Model "${modelName}" not found.`);
		return false;
	}

	// Use the first mesh to determine visibility
	return meshes[0].isVisible;
}
