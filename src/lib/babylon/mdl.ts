import "@babylonjs/loaders";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { events } from "./events";
import type { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";
import type { Scene } from "@babylonjs/core/scene";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector";
import {degToRad, radToDeg} from ".";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";


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
	const gl = new GlowLayer("glow", scene, {
		mainTextureFixedSize: 256,
		blurKernelSize: 64
	});
	gl.intensity = 0.2;

	// Process materials for all meshes
	for (let i = initialMeshCount; i < scene.meshes.length; i++) {
		const mesh = scene.meshes[i];
		newMeshes[mesh.name] = mesh;
		if(mesh.name === "__root__") {
			rootModels[modelName] = mesh;
		}
	}

	for(const mesh of Object.values(newMeshes)){		
		if(modelName.includes("miku")){
			const mat = mesh.material;
			if (mat) {
				mat.needDepthPrePass = true;
				mat.separateCullingPass = true;
				mesh.material = mat;
				mesh.alwaysSelectAsActiveMesh = true;
			}
		}else if(modelName.includes("hoshi")){
			if(mesh.material){
				const mat = mesh.material as StandardMaterial;
				mat.emissiveColor = new Color3(0, 0.3, 0);
				gl.addIncludedOnlyMesh(mesh as Mesh);
			}
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

const baseUrl = import.meta.env.VITE_BASE_URL;

events.on("onSceneDefinition", async ({ scene }) => {
	// Load both models and collect their animation groups
	/* --- どっと式ミクさん --- */
	await loadModel(`${baseUrl}dotmiku.glb`, scene);
	await loadModel(`${baseUrl}dotmiku-tanabata.glb`, scene);
	// Load room model
	await loadModel(`${baseUrl}room.glb`, scene);
	await loadModel(`${baseUrl}sky.glb`, scene);
	await loadModel(`${baseUrl}hoshi-mk.glb`, scene);

	setModelVisibility("dotmiku-tanabata", false);

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
 * Set a model's visibility
 * @param modelName Name of the model to show/hide
 * @param visible Whether the model should be visible (true) or hidden (false)
 * @returns true if model was found and visibility was set, false otherwise
 */
export function setModelVisibility(modelName: string, visible: boolean): boolean {
	const meshes = getMeshes(modelName);
	if (!meshes) return false;

	for (const mesh of meshes) {
		mesh.isVisible = visible;
	}

	// Emit event for visibility change
	events.emit("onModelVisibilityChanged", { modelName, visible });

	console.log(`Model "${modelName}" is now ${visible ? 'visible' : 'hidden'}.`);
	return true;
}
/**
 * Show a model by making all its meshes visible
 * @param modelName Name of the model to show
 * @returns true if model was found and shown, false otherwise
 * @deprecated Use setModelVisibility(modelName, true) instead
 */
export function showModel(modelName: string): boolean {
	return setModelVisibility(modelName, true);
}

/**
 * Hide a model by making all its meshes invisible
 * @param modelName Name of the model to hide
 * @returns true if model was found and hidden, false otherwise
 * @deprecated Use setModelVisibility(modelName, false) instead
 */
export function hideModel(modelName: string): boolean {
	return setModelVisibility(modelName, false);
}

/**
 * Toggle a model's visibility
 * @param modelName Name of the model to toggle
 * @returns true if model was found and toggled, false otherwise
 */
export function toggleModelVisibility(modelName: string): boolean {
	// Check if model exists
	const meshes = getMeshes(modelName);
	if (!meshes) return false;

	// Check current visibility and toggle it
	const isCurrentlyVisible = isModelVisible(modelName);
	return setModelVisibility(modelName, !isCurrentlyVisible);
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
 * Check if a model is currently enabled (alias for isModelVisible)
 * @param modelName Name of the model to check
 * @returns true if model is enabled, false if disabled or not found
 */
export function isModelEnabled(modelName: string): boolean {
	return isModelVisible(modelName);
}

/**
 * Get the current position of a model
 * @param modelName Name of the model
 * @returns Object with x, y, z coordinates or null if model not found
 */
export function getModelPosition(modelName: string): { x: number, y: number, z: number } | null {
	const mesh = rootModels[modelName];
	if (!mesh) {
		console.warn(`Model "${modelName}" not found.`);
		return null;
	}

	return {
		x: mesh.position.x,
		y: mesh.position.y,
		z: mesh.position.z
	};
}

/**
 * Get the current rotation of a model (in degrees)
 * @param modelName Name of the model
 * @returns Object with x, y, z rotation values or null if model not found
 */
export function getModelRotation(modelName: string): { x: number, y: number, z: number } | null {
	const mesh = rootModels[modelName];
	if (!mesh) {
		console.warn(`Model "${modelName}" not found.`);
		return null;
	}

	// If rotationQuaternion is not set, return zero rotation
	if (!mesh.rotationQuaternion) {
		return { x: 0, y: 0, z: 0 };
	}

	// Convert quaternion to Euler angles
	const euler = mesh.rotationQuaternion.toEulerAngles();

	// Convert radians to degrees
	return {
		x: radToDeg(euler.x),
		y: radToDeg(euler.y),
		z: radToDeg(euler.z)
	};
}

/**
 * Set the absolute position of a model
 * @param modelName Name of the model to position
 * @param x X coordinate
 * @param y Y coordinate
 * @param z Z coordinate
 * @returns true if model was found and positioned, false otherwise
 */
export function setModelPosition(modelName: string, x: number, y: number, z: number): boolean {
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

/**
 * Set the absolute rotation of a model (in radians)
 * @param modelName Name of the model to rotate
 * @param x Rotation around X axis (in radians)
 * @param y Rotation around Y axis (in radians)
 * @param z Rotation around Z axis (in radians)
 * @returns true if model was found and rotated, false otherwise
 */
export function setModelRotation(modelName: string, x: number, y: number, z: number): boolean {
	const mesh = rootModels[modelName];
	if (!mesh || isNaN(x) || isNaN(y) || isNaN(z)) {
		console.warn(`Invalid model name or rotation values: ${modelName}, x=${x}, y=${y}, z=${z}`);
		return false;
	}

	mesh.rotationQuaternion = Quaternion.RotationYawPitchRoll(degToRad(y), degToRad(x), degToRad(z));

	console.log(`Model "${modelName}" rotation set to: x=${x}, y=${y}, z=${z}`);
	return true;
}

/**
 * Add to the current rotation of a model (in radians)
 * @param modelName Name of the model to rotate
 * @param x Additional rotation around X axis (in radians)
 * @param y Additional rotation around Y axis (in radians)
 * @param z Additional rotation around Z axis (in radians)
 * @returns true if model was found and rotated, false otherwise
 */
export function addModelRotation(modelName: string, x: number, y: number, z: number): boolean {
	const mesh = rootModels[modelName];
	if (!mesh || isNaN(x) || isNaN(y) || isNaN(z)) {
		console.warn(`Invalid model name or rotation values: ${modelName}, x=${x}, y=${y}, z=${z}`);
		return false;
	}

	const currentRotation = mesh.rotationQuaternion || Quaternion.Identity();
	mesh.rotationQuaternion = currentRotation.multiply(Quaternion.RotationYawPitchRoll(degToRad(y), degToRad(x), degToRad(z)));

	console.log(`Model "${modelName}" rotation adjusted by: x=${x}, y=${y}, z=${z}`);
	return true;
}