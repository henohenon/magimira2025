import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";
import { events } from "../events";

// Normal camera (FreeCamera) implementation
let normalCamera: FreeCamera;
let _scene: Scene;

// Initialize the normal camera when the scene is defined
events.on("onSceneDefinition", async ({ scene }) => {
    _scene = scene;

    // Create a new FreeCamera
    normalCamera = new FreeCamera(
        "camera-normal",
        new Vector3(0, 1.5, -5), // Position the camera slightly above ground level and back from origin
        scene,
    );

    // Set the target to look at
    normalCamera.setTarget(new Vector3(0, 1, 0)); // Look at a point slightly above the origin

    // Enable camera controls
    normalCamera.attachControl();
});

// Function to get the normal camera instance
export function getNormalCamera(): FreeCamera {
    return normalCamera;
}

// Function to activate the normal camera
export function activateNormalCamera() {
    if (!normalCamera || !_scene) return;
    _scene.activeCamera = normalCamera;
}

// Function to set the position of the normal camera
export function setNormalCameraPosition(x: number, y: number, z: number) {
    if (!normalCamera) return false;
    normalCamera.position = new Vector3(x, y, z);
    return true;
}

// Function to set the target of the normal camera
export function setNormalCameraTarget(x: number, y: number, z: number) {
    if (!normalCamera) return false;
    normalCamera.setTarget(new Vector3(x, y, z));
    return true;
}