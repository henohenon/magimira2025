import {events as babylonEvents} from "../../babylon/events.ts";
import {getAnimations, isModelVisible, playAnimation, toggleModelVisibility} from "../../babylon/mdl.ts";

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
