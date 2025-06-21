import {
    whiteFadeIn,
    whiteFadeOut,
    blackFadeIn,
    blackFadeOut,
    textaliveBannerFadeIn,
    textaliveBannerFadeOut,
    loadingWrapperFadeIn,
    loadingWrapperFadeOut,
    playingContainerFadeIn,
    playingContainerFadeOut,
    initContainerFadeIn,
    initContainerFadeOut,
    shutterIn,
    shutterOut
} from "~/effects/dom/fade";
import type { Dropdown } from "../web-components/dropdown.ts";
import type { NumberInput } from "../web-components/number-input.ts";

// Get DOM fade controls
const fadeDurationInput = document.getElementById("dom-fade-duration") as NumberInput;
const fadeTypeDropdown = document.getElementById("dom-fade-type") as Dropdown;
const fadeInButton = document.getElementById("dom-fade-in-btn") as HTMLButtonElement;
const fadeOutButton = document.getElementById("dom-fade-out-btn") as HTMLButtonElement;

// Validate controls
if (!fadeDurationInput || !fadeTypeDropdown || !fadeInButton || !fadeOutButton) {
    throw new Error("DOM fade controls not found");
}

// Function to execute fade in based on selected type
const executeFadeIn = () => {
    const duration = fadeDurationInput.value;
    const fadeType = fadeTypeDropdown.value;

    console.log(`Executing fade in for ${fadeType} with duration ${duration}ms`);

    switch (fadeType) {
        case "white":
            whiteFadeIn(duration);
            break;
        case "black":
            blackFadeIn(duration);
            break;
        case "textalive-banner":
            textaliveBannerFadeIn(duration);
            break;
        case "loading-wrapper":
            loadingWrapperFadeIn(duration);
            break;
        case "playing-container":
            playingContainerFadeIn(duration);
            break;
        case "init-container":
            initContainerFadeIn(duration);
            break;
        case "shutter":
            shutterIn(duration);
            break;
        default:
            console.error(`Unknown fade type: ${fadeType}`);
    }
};

// Function to execute fade out based on selected type
const executeFadeOut = () => {
    const duration = fadeDurationInput.value;
    const fadeType = fadeTypeDropdown.value;

    console.log(`Executing fade out for ${fadeType} with duration ${duration}ms`);

    switch (fadeType) {
        case "white":
            whiteFadeOut(duration);
            break;
        case "black":
            blackFadeOut(duration);
            break;
        case "textalive-banner":
            textaliveBannerFadeOut(duration);
            break;
        case "loading-wrapper":
            loadingWrapperFadeOut(duration);
            break;
        case "playing-container":
            playingContainerFadeOut(duration);
            break;
        case "init-container":
            initContainerFadeOut(duration);
            break;
        case "shutter":
            shutterOut(duration);
            break;
        default:
            console.error(`Unknown fade type: ${fadeType}`);
    }
};

// Add event listeners for fade buttons
fadeInButton.addEventListener("click", executeFadeIn);
fadeOutButton.addEventListener("click", executeFadeOut);