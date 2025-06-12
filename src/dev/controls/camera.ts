import {
    addCameraPosition,
    setCameraPosition,
    addCameraRotation,
    setCameraRotation,
    switchCamera,
    resetCameraToInitial,
    type CameraType
} from "../../babylon/camera.ts";
import type {Dropdown} from "../web-components/dropdown.ts";
import type {TripleInput} from "../web-components/triple-input.ts";

const activeCameraDropdown = document.getElementById("active-camera-dropdown") as Dropdown;
const cameraAddPositionInput = document.getElementById("camera-add-position-input") as TripleInput;
const cameraAddPositionButton = document.getElementById("camera-add-position-button") as HTMLButtonElement;
const cameraSetPositionInput = document.getElementById("camera-set-position-input") as TripleInput;
const cameraSetPositionButton = document.getElementById("camera-set-position-button") as HTMLButtonElement;
const cameraAddRotationInput = document.getElementById("camera-add-rotation-input") as TripleInput;
const cameraAddRotationButton = document.getElementById("camera-add-rotation-button") as HTMLButtonElement;
const cameraSetRotationInput = document.getElementById("camera-set-rotation-input") as TripleInput;
const cameraSetRotationButton = document.getElementById("camera-set-rotation-button") as HTMLButtonElement;
const cameraResetButton = document.getElementById("camera-reset-button") as HTMLButtonElement;

if (!activeCameraDropdown || !cameraAddPositionInput || !cameraAddPositionButton ||
    !cameraSetPositionInput || !cameraSetPositionButton || !cameraAddRotationInput ||
    !cameraAddRotationButton || !cameraSetRotationInput || !cameraSetRotationButton ||
    !cameraResetButton) {
    throw new Error("Camera controls not found");
}

activeCameraDropdown.subscribe((key) => {
    switchCamera(key as CameraType);
});

cameraAddPositionButton.addEventListener("click", () => {
    console.log(activeCameraDropdown.value, cameraAddPositionInput.value1, cameraAddPositionInput.value2, cameraAddPositionInput.value3);
    addCameraPosition(activeCameraDropdown.value as CameraType, cameraAddPositionInput.value1, cameraAddPositionInput.value2, cameraAddPositionInput.value3);
});

cameraSetPositionButton.addEventListener("click", () => {
    setCameraPosition(activeCameraDropdown.value as CameraType, cameraSetPositionInput.value1, cameraSetPositionInput.value2, cameraSetPositionInput.value3);
});

cameraAddRotationButton.addEventListener("click", () => {
    addCameraRotation(activeCameraDropdown.value as CameraType, cameraAddRotationInput.value1, cameraAddRotationInput.value2, cameraAddRotationInput.value3);
});

cameraSetRotationButton.addEventListener("click", () => {
    setCameraRotation(activeCameraDropdown.value as CameraType, cameraSetRotationInput.value1, cameraSetRotationInput.value2, cameraSetRotationInput.value3);
});

cameraResetButton.addEventListener("click", () => {
    resetCameraToInitial(activeCameraDropdown.value as CameraType);
});