import {
    addCameraPosition,
    switchCamera,
    type CameraType,
    getCameraPosition,
    getActiveCamera,
} from "~/babylon/camera.ts";
import type {Dropdown} from "../web-components/dropdown.ts";
import type {TripleInput} from "../web-components/triple-input.ts";

const activeCameraDropdown = document.getElementById("active-camera-dropdown") as Dropdown;
const cameraAddPositionInput = document.getElementById("camera-add-position-input") as TripleInput;
const cameraAddPositionButton = document.getElementById("camera-add-position-button") as HTMLButtonElement;
const cameraSetPositionInput = document.getElementById("camera-set-position-input") as TripleInput;

if (!activeCameraDropdown || !cameraAddPositionInput || !cameraAddPositionButton ||
    !cameraSetPositionInput) {
    throw new Error("Camera controls not found");
}

activeCameraDropdown.subscribe((key) => {
    switchCamera(key as CameraType);
});

cameraAddPositionButton.addEventListener("click", () => {
    console.log(activeCameraDropdown.value, cameraAddPositionInput.value1, cameraAddPositionInput.value2, cameraAddPositionInput.value3);
    addCameraPosition(activeCameraDropdown.value as CameraType, cameraAddPositionInput.value1, cameraAddPositionInput.value2, cameraAddPositionInput.value3);
});

// Function to update camera position inputs in the UI
export function updateCameraInfo() {
    const activeCamera = getActiveCamera();
    if (!activeCamera) return;

    const position = getCameraPosition(activeCamera);
    if (position && cameraSetPositionInput) {
        cameraSetPositionInput.value1 = position.x;
        cameraSetPositionInput.value2 = position.y;
        cameraSetPositionInput.value3 = position.z;
    }
}
