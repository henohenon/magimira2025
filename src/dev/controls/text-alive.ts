import {player} from "~/text-alive";
import {events} from "~/text-alive/events.ts";
import type {InputAndSlider} from "../web-components/input-slider.ts";
import {cameraActions} from "~/game/events";

const autoStartToggle = document.getElementById("auto-start-toggle") as HTMLInputElement;
// Store auto-start preference - load from localStorage or default to false
let autoStart = localStorage.getItem("autoStart") === "true";

if (autoStartToggle) {
    // Set initial state
    autoStartToggle.checked = autoStart;

    // Add event listener for changes
    autoStartToggle.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        autoStart = target.checked;
        // Save preference to localStorage
        localStorage.setItem("autoStart", autoStart.toString());
    });
}

// Listen for app ready event to auto-start if enabled
events.on("onAppReady", () => {
    if (autoStart) {
        setTimeout(() => {
            player.requestMediaSeek(0);
            player.requestPlay();
        }, 3000); // Small delay to ensure everything is ready
    }
});

const pauseUnpauseButton = document.getElementById("pause-unpause-button");
pauseUnpauseButton?.addEventListener("click", () => {
    if(player.isPlaying){
        player.requestPause();
    }else {
        player.requestPlay();
    }
})

const volumeInputSlider = document.getElementById("volume-input-slider") as InputAndSlider;
volumeInputSlider?.subscribe((volume) => {
    player.volume = volume;
})

const timeInputSlider = document.getElementById("time-input-slider") as InputAndSlider;
if (!timeInputSlider) {
    throw new Error("Time controls not found");
}

events.on("onAppReady", () => {
    timeInputSlider.max = player.video.duration;
});

timeInputSlider.subscribe((time) => {
    player.requestMediaSeek(Math.round(time));
})

// Function to format milliseconds to MM:SS format
function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Get the details element inside the camera action timestamps accordion
const cameraActionAccordionDetails = document.querySelector('#camera-action-timestamps-accordion details') as HTMLElement;

// Function to generate timestamp buttons for each camera action
if (!cameraActionAccordionDetails) throw new Error("Camera action timestamps accordion details not found");

// Sort camera actions by position
const sortedActions = [...cameraActions].sort((a, b) => a.position - b.position);

// Create a button for each camera action
sortedActions.forEach(action => {
    const button = document.createElement('button');
    button.textContent = `${action.name} (${formatTime(action.position)})`;

    // Add click event listener to seek to the camera action position and play
    button.addEventListener('click', () => {
        player.requestMediaSeek(action.position);
    });

    cameraActionAccordionDetails.appendChild(button);
});
