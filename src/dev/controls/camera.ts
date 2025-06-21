import {
    addArcSphericalCoordinates,
    addArcTargetPosition,
    addFreePosition,
    addFreeRotation,
    type CameraType,
    getActiveCameraType,
    getArcSphericalCoordinates,
    getArcTargetPosition,
    getFreePosition,
    getFreeRotation,
    setArcSphericalCoordinates,
    setArcTargetPosition,
    setFreePosition,
    setFreeRotation,
    switchCamera,
} from "~/babylon/camera";
import type {Dropdown} from "../web-components/dropdown.ts";
import type {TripleInput} from "../web-components/triple-input.ts";

// Get active camera dropdown
const activeCameraDropdown = document.getElementById("camera-active-type") as Dropdown;

// Get arc camera controls
const arcCameraAddPositionInput = document.getElementById("camera-arc-position-add") as TripleInput;
const arcCameraAddPositionButton = document.getElementById("camera-arc-position-add-btn") as HTMLButtonElement;
const arcCameraSetPositionInput = document.getElementById("camera-arc-position-set") as TripleInput;
const arcCameraAddRotationInput = document.getElementById("camera-arc-rotation-add") as TripleInput;
const arcCameraAddRotationButton = document.getElementById("camera-arc-rotation-add-btn") as HTMLButtonElement;
const arcCameraSetRotationInput = document.getElementById("camera-arc-rotation-set") as TripleInput;

// Get free camera controls
const freeCameraAddPositionInput = document.getElementById("camera-free-position-add") as TripleInput;
const freeCameraAddPositionButton = document.getElementById("camera-free-position-add-btn") as HTMLButtonElement;
const freeCameraSetPositionInput = document.getElementById("camera-free-position-set") as TripleInput;
const freeCameraAddRotationInput = document.getElementById("camera-free-rotation-add") as TripleInput;
const freeCameraAddRotationButton = document.getElementById("camera-free-rotation-add-btn") as HTMLButtonElement;
const freeCameraSetRotationInput = document.getElementById("camera-free-rotation-set") as TripleInput;

// Validate controls
if (!activeCameraDropdown) {
    throw new Error("Active camera dropdown not found");
}

// Arc camera controls validation
if (!arcCameraAddPositionInput || !arcCameraAddPositionButton || !arcCameraSetPositionInput ||
    !arcCameraAddRotationInput || !arcCameraAddRotationButton || !arcCameraSetRotationInput) {
    throw new Error("Arc camera controls not found");
}

// Free camera controls validation
if (!freeCameraAddPositionInput || !freeCameraAddPositionButton || !freeCameraSetPositionInput ||
    !freeCameraAddRotationInput || !freeCameraAddRotationButton || !freeCameraSetRotationInput) {
    throw new Error("Free camera controls not found");
}

// Subscribe to active camera changes
activeCameraDropdown.subscribe((key) => {
    switchCamera(key as CameraType);
    updateCameraInfo();
});

// Arc camera event listeners
arcCameraAddPositionButton.addEventListener("click", () => {
    const activeCamera = getActiveCameraType();
    // Only apply to arc camera types
    if (activeCamera === "arc" || activeCamera === "arc2") {
        addArcTargetPosition(arcCameraAddPositionInput.value1, arcCameraAddPositionInput.value2, arcCameraAddPositionInput.value3, activeCamera as "arc" | "arc2");
        updateCameraInfo();
    }
});

// Add event listener for arc camera set position button
arcCameraSetPositionInput.subscribe((value1, value2, value3) => {
    const activeCamera = getActiveCameraType();
    // Only apply to arc camera types
    if (activeCamera === "arc" || activeCamera === "arc2") {
        setArcTargetPosition(value1, value2, value3, activeCamera as "arc" | "arc2");
        updateCameraInfo();
    }
});

arcCameraAddRotationButton.addEventListener("click", () => {
    const activeCamera = getActiveCameraType();
    // Only apply to arc camera types
    if (activeCamera === "arc" || activeCamera === "arc2") {
        addArcSphericalCoordinates(arcCameraAddRotationInput.value1, arcCameraAddRotationInput.value2, arcCameraAddRotationInput.value3, activeCamera as "arc" | "arc2");
        updateCameraInfo();
    }
});

// Add event listener for arc camera set rotation button
arcCameraSetRotationInput.subscribe((value1, value2, value3) => {
    const activeCamera = getActiveCameraType();
    // Only apply to arc camera types
    if (activeCamera === "arc" || activeCamera === "arc2") {
        setArcSphericalCoordinates(value1, value2, value3, activeCamera as "arc" | "arc2");
    }
})

// Free camera event listeners
freeCameraAddPositionButton.addEventListener("click", () => {
    const activeCamera = getActiveCameraType();
    // Only apply to free camera types
    if (activeCamera === "free" || activeCamera === "free2") {
        addFreePosition(freeCameraAddPositionInput.value1, freeCameraAddPositionInput.value2, freeCameraAddPositionInput.value3, activeCamera as "free" | "free2");
        updateCameraInfo();
    }
});

// Add event listener for free camera set position button
freeCameraSetPositionInput.subscribe((value1, value2, value3) => {
    const activeCamera = getActiveCameraType();
    // Only apply to free camera types
    if (activeCamera === "free" || activeCamera === "free2") {
        setFreePosition(value1, value2, value3, activeCamera as "free" | "free2");
        updateCameraInfo();
    }
});

freeCameraAddRotationButton.addEventListener("click", () => {
    const activeCamera = getActiveCameraType();
    // Only apply to free camera types
    if (activeCamera === "free" || activeCamera === "free2") {
        addFreeRotation(freeCameraAddRotationInput.value1, freeCameraAddRotationInput.value2, freeCameraAddRotationInput.value3, activeCamera as "free" | "free2");
        updateCameraInfo();
    }
});

// Add event listener for free camera set rotation button
freeCameraSetRotationInput.subscribe((value1, value2, value3) => {
    const activeCamera = getActiveCameraType();
    // Only apply to free camera types
    if (activeCamera === "free" || activeCamera === "free2") {
        setFreeRotation(value1, value2, value3, activeCamera as "free" | "free2");
    }
})

// Function to update camera position and rotation inputs in the UI
export function updateCameraInfo() {
    // Get the active camera type
    const activeCamera = getActiveCameraType();

    // Update dropdown to match active camera
    activeCameraDropdown.value = activeCamera;

    // Handle arc camera types
    if (activeCamera === "arc" || activeCamera === "arc2") {
        // Update arc camera position
        const arcPosition = getArcTargetPosition(activeCamera);
        if (arcPosition) {
            arcCameraSetPositionInput.value1 = arcPosition.x;
            arcCameraSetPositionInput.value2 = arcPosition.y;
            arcCameraSetPositionInput.value3 = arcPosition.z;
        }

        // Update arc camera rotation (spherical coordinates)
        const spherical = getArcSphericalCoordinates(activeCamera);
        if (spherical) {
            arcCameraSetRotationInput.value1 = spherical.alpha; // alpha (degrees)
            arcCameraSetRotationInput.value2 = spherical.beta;  // beta (degrees)
            arcCameraSetRotationInput.value3 = spherical.radius; // radius
        }
    }

    // Handle free camera types
    if (activeCamera === "free" || activeCamera === "free2") {
        // Update free camera position
        const freePosition = getFreePosition(activeCamera);
        if (freePosition) {
            freeCameraSetPositionInput.value1 = freePosition.x;
            freeCameraSetPositionInput.value2 = freePosition.y;
            freeCameraSetPositionInput.value3 = freePosition.z;
        }

        // Update free camera rotation
        const rotation = getFreeRotation(activeCamera);
        if (rotation) {
            freeCameraSetRotationInput.value1 = rotation.y; // yaw (y in Euler)
            freeCameraSetRotationInput.value2 = rotation.x; // pitch (x in Euler)
            freeCameraSetRotationInput.value3 = rotation.z; // roll (z in Euler)
        }
    }
}
