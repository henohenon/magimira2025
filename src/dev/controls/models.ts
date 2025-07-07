import {events as babylonEvents} from "~/lib/babylon/events";
import {
    addModelRotation,
    addPosition,
    getAnimations,
    getModelPosition,
    getModelRotation,
    isModelEnable,
    playAnimation,
    setModelRotation,
    setModelPosition,
    getRootMesh,
    setModelEnable
} from "~/lib/babylon/mdl";

import type {ToggleSwitch} from "../web-components/toggle-switch";
import type {TripleInput} from "../web-components/triple-input";

// Function to update model position and rotation inputs in the UI
export function updateModelInfo() {
    for (const modelName of Object.keys(toggleSwitches)) {
        // Update position input with current model position
        const position = getModelPosition(modelName);
        if (position) {
            setPositionInputs[modelName].value1 = position.x;
            setPositionInputs[modelName].value2 = position.y;
            setPositionInputs[modelName].value3 = position.z;
        }

        // Update rotation input with current model rotation
        const rotation = getModelRotation(modelName);
        if (rotation) {
            setRotationInputs[modelName].value1 = rotation.x;
            setRotationInputs[modelName].value2 = rotation.y;
            setRotationInputs[modelName].value3 = rotation.z;
        }

        toggleSwitches[modelName].checked = isModelEnable(modelName);
    }
}

const setPositionInputs: Record<string, TripleInput> = {};
const setRotationInputs: Record<string, TripleInput> = {};
const toggleSwitches: Record<string, ToggleSwitch> = {};

// Initialize toggle switches for each model when models are loaded
babylonEvents.on("onModelsLoaded", (modelNames) => {
    // Configure each toggle switch
    for (const modelName of modelNames) {
        const addPositionInput = document.getElementById(`model-add-position-${modelName}`) as TripleInput;
        const addPositionButton = document.getElementById(`model-add-position-button-${modelName}`) as HTMLButtonElement;
        const addRotationInput = document.getElementById(`model-add-rotation-${modelName}`) as TripleInput;
        const addRotationButton = document.getElementById(`model-add-rotation-button-${modelName}`) as HTMLButtonElement;
        const setPositionInput = document.getElementById(`model-set-position-${modelName}`) as TripleInput;
        const setRotationInput = document.getElementById(`model-set-rotation-${modelName}`) as TripleInput;
        const toggleSwitch = document.getElementById(`model-visibility-${modelName}`) as ToggleSwitch;

        if (!(addPositionInput && addPositionButton && addRotationInput && addRotationButton && setPositionInput && setRotationInput && toggleSwitch)) {
            console.error(`Model "${modelName}" has missing controls`);
            continue;
        }

        setPositionInputs[modelName] = setPositionInput;
        setRotationInputs[modelName] = setRotationInput;
        toggleSwitches[modelName] = toggleSwitch;


        toggleSwitch.subscribe((checked) => {
            setModelEnable(modelName, checked);
            console.log(modelName, checked?1:0)
        });

        addPositionButton.addEventListener("click", () => {
            addPosition(modelName, addPositionInput.value1, addPositionInput.value2, addPositionInput.value3);
        });

        setPositionInput.subscribe((value1, value2, value3) => {
            setModelPosition(modelName, value1, value2, value3);
        });

        addRotationButton.addEventListener("click", () => {
            addModelRotation(modelName, addRotationInput.value1, addRotationInput.value2, addRotationInput.value3);
        });

        setRotationInput.subscribe((value1, value2, value3) => {
            const mesh = getRootMesh(modelName);
            setModelRotation(mesh, value1, value2, value3);
        });

        if(!modelName.includes("miku")) continue;
        const animationsElem = document.querySelector(`#animations-accordion-${modelName} details`) as HTMLElement;
        if (!animationsElem) {
            console.error(`Model "${modelName}" has missing animations`);
            continue;
        }
        const animations = getAnimations(modelName);
        for (const animation of Object.keys(animations)) {
            const button = document.createElement("button");
            button.innerText = animation;
            button.addEventListener("click", () => {
                playAnimation(modelName, animation);
            });
            animationsElem.appendChild(button);
        }
    }
});
