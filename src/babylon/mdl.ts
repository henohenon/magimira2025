import "@babylonjs/loaders";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { events } from "./events";
import type { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";
import type { Scene } from "@babylonjs/core/scene";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

// Store loaded model meshes by model name
const modelMeshes: Record<string, Record<string, AbstractMesh>> = {};
// Store animation groups by model name
const modelAnimations: Record<string, Record<string, AnimationGroup>> = {};
const rootModels: Record<string, AbstractMesh> = {};

/**
 * Load a model from the specified source path
 * @param sourcePath Path to the model file
 * @param scene The scene to append the model to
 * @returns The animation groups from the loaded model
 */
export async function loadModel(sourcePath: string, scene: Scene) {
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
	const newMeshes: Record<string, AbstractMesh> = {};

	// Process materials for all meshes
	for (let i = initialMeshCount; i < scene.meshes.length; i++) {
		const mesh = scene.meshes[i];
		newMeshes[mesh.name] = mesh;

		const mat = mesh.material;
		if (mat) {
			// mat.backFaceCulling = false;
			mat.needDepthPrePass = true;
			mesh.material = mat;
		}
		// mesh.alwaysSelectAsActiveMesh = true;

		if(mesh.name === "__root__") {
			rootModels[modelName] = mesh;
		}
	}

	// Store meshes by model name
	modelMeshes[modelName] = newMeshes;

	// Store animation groups by model name
	modelAnimations[modelName] = modelAnimGroups.reduce((
		acc, animGroup) => {
		acc[animGroup.name] = animGroup; return acc;
	}, {} as Record<string, AnimationGroup>);

	console.log(`Model loaded from ${sourcePath} with ${Object.keys(newMeshes).length} meshes and ${modelAnimGroups.length} animations`);
}

events.on("onSceneDefinition", async ({ scene }) => {
	// Load both models and collect their animation groups
	/* --- どっと式ミクさん --- */
	await loadModel("/dotmiku.glb", scene);
	await loadModel("/dotmiku-tanabata.glb", scene);

	// Load room model
	await loadModel("/room.glb", scene);

	hideModel("dotmiku-tanabata");

	// Emit available model names
	const modelNames = getModelNames();
	events.emit("onModelsLoaded", modelNames);

	console.log("All GLTF models loaded!");
});

export const getAnimations = (mdlName: string) => {
	return modelAnimations[mdlName];
}

export function playAnimation(mdl: string, animation: string) {
	const animGroup = modelAnimations[mdl][animation]
	if (animGroup) {
		console.log(`Playing animation: ${animation}`);
		animGroup.reset();
		animGroup.play(false);
	} else {
		console.warn(`Animation group "${animation}" not found.`);
	}
}

/**
 * Get all available model names
 * @returns Array of model names that can be shown/hidden
 */
export function getModelNames(): string[] {
	return Object.keys(modelMeshes);
}

function getMeshes(mdlName: string): AbstractMesh[] | undefined {
	const meshes = Object.values(modelMeshes[mdlName]);
	if (!meshes || meshes.length === 0) {
		console.warn(`Model "${mdlName}" not found.`);
		return undefined;
	}
	return meshes;
}

/**
 * Show a model by making all its meshes visible
 * @param modelName Name of the model to show
 * @returns true if model was found and shown, false otherwise
 */
export function showModel(modelName: string): boolean {
	const meshes = getMeshes(modelName);
	if (!meshes) return false;

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
	const meshes = getMeshes(modelName);
	if (!meshes) return false;

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
	const meshes = getMeshes(modelName);
	if (!meshes) return false;

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
	const meshes = getMeshes(modelName);
	if (!meshes) return false;

	// Use the first mesh to determine visibility
	return meshes[0].isVisible;
}

/**
 * Set the absolute position of a model
 * @param modelName Name of the model to position
 * @param x X coordinate
 * @param y Y coordinate
 * @param z Z coordinate
 * @returns true if model was found and positioned, false otherwise
 */
export function setPosition(modelName: string, x: number, y: number, z: number): boolean {
	const mesh = rootModels[modelName];
	if (!mesh || isNaN(x) || isNaN(y) || isNaN(z)) {
		console.warn(`Invalid model name or position values: ${modelName}, x=${x}, y=${y}, z=${z}`);
		return false;
	}
	mesh.position.set(x, y, z);

	console.log(`Model "${modelName}" position set to: x=${x}, y=${y}, z=${z}`);
	return true;
}

/**
 * Add to the current position of a model
 * @param modelName Name of the model to position
 * @param x X offset to add
 * @param y Y offset to add
 * @param z Z offset to add
 * @returns true if model was found and positioned, false otherwise
 */
export function addPosition(modelName: string, x: number, y: number, z: number): boolean {
	const mesh = rootModels[modelName];
	if (!mesh || isNaN(x) || isNaN(y) || isNaN(z)) {
		console.warn(`Invalid model name or position values: ${modelName}, x=${x}, y=${y}, z=${z}`);
		return false;
	}

	mesh.position.addInPlace(new Vector3(x, y, z));

	console.log(`Model "${modelName}" position adjusted by: x=${x}, y=${y}, z=${z}`);
	return true;
}
