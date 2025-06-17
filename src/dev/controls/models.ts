import {events as babylonEvents} from "../../babylon/events.ts";
import {getAnimations, isModelVisible, playAnimation, toggleModelVisibility, setPosition, addPosition, setModelRotation, addModelRotation} from "../../babylon/mdl.ts";
import type {TripleInput} from "../web-components/triple-input.ts";

// Initialize toggle switches for each model when models are loaded
babylonEvents.on("onModelsLoaded", (modelNames) => {
    // Configure each toggle switch
    for (const modelName of modelNames) {
        // Find the existing toggle switch
        const toggleSwitch = document.getElementById(`model-visibility-${modelName}`) as HTMLInputElement;
        if (!toggleSwitch) {
            console.warn(`Toggle switch for model "${modelName}" not found`);
            return;
        }

        // Set initial state based on model visibility
        toggleSwitch.checked = isModelVisible(modelName);

        // Add event listener to toggle model visibility
        toggleSwitch.addEventListener("change", (event) => {
            const target = event.target as HTMLInputElement;
            if (target.checked !== isModelVisible(modelName)) {
                toggleModelVisibility(modelName);
            }
        });

        // Set up position controls
        const addPositionInput = document.getElementById(`model-add-position-${modelName}`) as TripleInput;
        const addPositionButton = document.getElementById(`model-add-position-button-${modelName}`) as HTMLButtonElement;
        const setPositionInput = document.getElementById(`model-set-position-${modelName}`) as TripleInput;
        const setPositionButton = document.getElementById(`model-set-position-button-${modelName}`) as HTMLButtonElement;

        if (addPositionInput && addPositionButton) {
            addPositionButton.addEventListener("click", () => {
                addPosition(modelName, addPositionInput.value1, addPositionInput.value2, addPositionInput.value3);
            });
        } else {
            console.warn(`Add position controls for model "${modelName}" not found`);
        }

        if (setPositionInput && setPositionButton) {
            setPositionButton.addEventListener("click", () => {
                setPosition(modelName, setPositionInput.value1, setPositionInput.value2, setPositionInput.value3);
            });
        } else {
            console.warn(`Set position controls for model "${modelName}" not found`);
        }

        // Set up rotation controls
        const addRotationInput = document.getElementById(`model-add-rotation-${modelName}`) as TripleInput;
        const addRotationButton = document.getElementById(`model-add-rotation-button-${modelName}`) as HTMLButtonElement;
        const setRotationInput = document.getElementById(`model-set-rotation-${modelName}`) as TripleInput;
        const setRotationButton = document.getElementById(`model-set-rotation-button-${modelName}`) as HTMLButtonElement;

        if (addRotationInput && addRotationButton) {
            addRotationButton.addEventListener("click", () => {
                addModelRotation(modelName, addRotationInput.value1, addRotationInput.value2, addRotationInput.value3);
            });
        } else {
            console.warn(`Add rotation controls for model "${modelName}" not found`);
        }

        if (setRotationInput && setRotationButton) {
            setRotationButton.addEventListener("click", () => {
                setModelRotation(modelName, setRotationInput.value1, setRotationInput.value2, setRotationInput.value3);
            });
        } else {
            console.warn(`Set rotation controls for model "${modelName}" not found`);
        }

        if(modelName === "room") continue;
        const animationsElem = document.querySelector(`#animations-accordion-${modelName} details`) as HTMLElement;
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
