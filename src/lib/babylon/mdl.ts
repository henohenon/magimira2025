import "@babylonjs/loaders";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import type { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";
import type { Scene } from "@babylonjs/core/scene";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import {Quaternion, Vector3} from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { Nullable } from "@babylonjs/core/types";
import { Material } from "@babylonjs/core/Materials/material";

import { templateColors, type CharaNames } from "~/index.ts";

import { events } from "./events";
import {degToRad, radToDeg} from ".";

// Store loaded model meshes by model name
const modelMeshes: Record<string, Record<string, AbstractMesh>> = {};
// Store animation groups by model name
const modelAnimations: Record<string, Record<string, AnimationGroup>> = {};
const rootModels: Record<string, AbstractMesh> = {};
export const starModels: Record<string, AbstractMesh[]> = {};
let lightGl: GlowLayer | undefined = undefined;
let starGl: GlowLayer | undefined = undefined;

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
		if(mesh.name === "__root__") {
			rootModels[modelName] = mesh;
			mesh.setEnabled(false);
		}
	}

	const starMats: Record<string, StandardMaterial> = {};
	for(const mesh of Object.values(newMeshes)){
		const mat = mesh.material;
		if (mat) {
			mat.backFaceCulling = true;
			if(modelName.includes("miku")){
				mat.transparencyMode = Material.MATERIAL_ALPHABLEND;
				mat.needDepthPrePass = true;
				mat.separateCullingPass = true;
				mesh.alwaysSelectAsActiveMesh = true;
			}else if(mesh.name === "pc-display" || mesh.name === "top-light"){
				console.log(mesh);
				const mat = new StandardMaterial("glow-mat", scene);
				mat.emissiveColor = mesh.name === "pc-display" ? new Color3(0.25, 0.25, 0.25) : new Color3(1, 1, 1);
				mesh.material = mat;
				lightGl?.addIncludedOnlyMesh(mesh as Mesh);
				lightGl?.referenceMeshToUseItsOwnMaterial(mesh);
				continue;
			}else if(mesh.name === "pc-display-open" || mesh.name === "pc-display-close"){
				mat.transparencyMode = Material.MATERIAL_ALPHABLEND;
				mat.needDepthPrePass = true;
			}else if(mesh.name.includes("star_")){
				const charaName = getCharaNameFromStarName(mesh.name) as CharaNames;
				let mat = starMats[charaName];
				if(!mat){
					mat = new StandardMaterial(`glow-${charaName}-mat`, scene);
					mat.emissiveColor = templateColors[charaName];
					starMats[charaName] = mat;
				}
				mesh.material = mat;
				starGl?.addIncludedOnlyMesh(mesh as Mesh);
				starGl?.referenceMeshToUseItsOwnMaterial(mesh);
				const starKind = getStarKindFromStarName(mesh.name);
				starModels[starKind] = [...starModels[starKind] || [], mesh];
				continue;
			}
			mesh.material = mat;
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

function getCharaNameFromStarName(starName: string): CharaNames {
	if(starName.includes("_rin")){
		return "Rin";
	}else if(starName.includes("_ren")){
		return "Ren";
	}else if(starName.includes("_miku")){
		return "Miku";
	}else if(starName.includes("_kaito")){
		return "KAITO";
	}else if(starName.includes("_meiko")){
		return "MEIKO";
	}else if(starName.includes("_luka")){
		return "Luka";
	}
	return "default";
}

function getStarKindFromStarName(starName: string): string {
	if(starName.includes("_v1")){
		return "verse1";
	}
	return "not found";
}

const baseUrl = import.meta.env.VITE_BASE_URL;

events.on("onSceneDefinition", async ({ scene }) => {
	lightGl = new GlowLayer("glow", scene, {
		mainTextureFixedSize: 128,
		blurKernelSize: 24
	});
	lightGl.intensity = 0.2;
	starGl = new GlowLayer("glow", scene, {
		mainTextureFixedSize: 512,
		blurKernelSize: 24
	});
	starGl.intensity = 0.3;


	// Load both models and collect their animation groups
	/* --- どっと式ミクさん --- */
	await loadModel(`${baseUrl}dotmiku.glb`, scene);
	// 部屋
	await loadModel(`${baseUrl}room.glb`, scene);

	// 必要なモデルロードの終了
	const modelNames = getModelNames();
	events.emit("onModelsLoaded", modelNames);
	
	// あとから読み込む
	await loadModel(`${baseUrl}sky.glb`, scene);
	// await loadModel(`${baseUrl}hoshi-mk.glb`, scene);
	await loadModel(`${baseUrl}dotmiku-tanabata.glb`, scene);
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

export function getRootMesh(mdlName: string){
	return rootModels[mdlName];
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
export function setModelVisibility(modelName: string, visibility: number): boolean {
	const meshes = getMeshes(modelName);
	if (!meshes) return false;

	for (const mesh of meshes) {
		mesh.visibility = visibility;
	}
	return true;
}

/**
 * Toggle a model's visibility
 * @param modelName Name of the model to toggle
 * @returns true if model was found and toggled, false otherwise
 */
export function toggleModelEnable(modelName: string): boolean {
	// Check if model exists
	const meshes = getMeshes(modelName);
	if (!meshes) return false;

	// Check current visibility and toggle it
	const isCurrentlyVisible = isModelEnable(modelName);
	return setModelVisibility(modelName, isCurrentlyVisible? 0 : 1);
}

/**
 * Check if a model is currently visible
 * @param modelName Name of the model to check
 * @returns true if model is visible, false if hidden or not found
 */
export function isModelEnable(modelName: string): boolean {
	const mesh = getRootMesh(modelName);
	if (!mesh) return false;

	// Use the first mesh to determine visibility
	return mesh.isEnabled();
}

export function setModelEnable(modelName: string, enabled: boolean): boolean {
	const mesh = getRootMesh(modelName);
	if (!mesh) return false;
	mesh.setEnabled(enabled);
	return true;
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
export function setModelRotation(mesh: AbstractMesh, x: number, y: number, z: number) {
	mesh.rotationQuaternion = Quaternion.RotationYawPitchRoll(degToRad(y), degToRad(x), degToRad(z));
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

export function setModelScale(modelName: string, x: number, y: number, z: number) {
	const mesh = rootModels[modelName];
	if (!mesh || isNaN(x) || isNaN(y) || isNaN(z)) {
		console.warn(`Invalid scale name or rotation values: ${modelName}, x=${x}, y=${y}, z=${z}`);
		return false;
	}

	mesh.scaling = new Vector3(x, y, z);

	console.log(`Model "${modelName}" scale adjusted by: x=${x}, y=${y}, z=${z}`);
	return true;
}

function copyChildMeshes(parentMesh: AbstractMesh, createNewName: (currentName: string) => string) {
	for (const child of parentMesh.getChildMeshes()) {
		const newName = createNewName(child.name);
		const cloned = (child as Mesh).createInstance(newName);
		cloned.visibility = 1;
		cloned.parent = parentMesh;
	}
}

export function copyModel(modelName: string, addName: string) {
	function createNewName(currentName: string) {
		return `${currentName}_${addName}`;
	}

	const rootMesh = rootModels[modelName] as Nullable<Mesh>;
	if (!rootMesh) {
		console.error(`${modelName} mesh was not found`);
		return null;
	}

	const rootName = createNewName(rootMesh.name);
	const newRoot = rootMesh.createInstance(rootName);
	rootModels[rootName] = newRoot;

	copyChildMeshes(rootMesh, createNewName);
	return rootName;
}