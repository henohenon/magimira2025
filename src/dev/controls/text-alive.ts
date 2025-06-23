import {player} from "~/lib/text-alive";
import {keyFrames, events, phraseFrames} from "~/game/events";

import type {Dropdown} from "../web-components/dropdown.ts";
import type {InputAndSlider} from "../web-components/input-slider.ts";
import {restartUpdateCycle} from "~/lib/update/cycle.ts";

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
events.on("onLoaded", () => {
    timeInputSlider.max = player.video.duration;
    if (autoStart) {
        // Check if there's a default key frame selected in the dropdown
        if (keyFrameDropdown.value) {
            // Find the corresponding key frame
            const actionName = keyFrameDropdown.value.split(' (')[0];
            const action = sortedActions.find(a => a.name === actionName);

            if (action) {
                // Seek to the key frame position
                player.requestMediaSeek(action.position);
            } else {
                // Fallback to beginning if key frame not found
                player.requestMediaSeek(0);
            }
        } else {
            // No key frame selected, start from beginning
            player.requestMediaSeek(0);
        }
        events.emit("onGameStart");
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
if (!timeInputSlider) throw new Error("Time controls not found");
export const updateTextAliveInfo = (position: number) => {
    timeInputSlider.value = position;
}

timeInputSlider.subscribe((time) => {
    if (!player.isPlaying) return;
    player.requestMediaSeek(Math.round(time));
    restartUpdateCycle(time);
})

// Function to format milliseconds to MM:SS format
function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Get the details element inside the key frame timestamps accordion
const keyFrameAccordionDetails = document.querySelector('#key-frame-timestamps-accordion details') as HTMLElement;

// Function to generate timestamp buttons for each key frame
if (!keyFrameAccordionDetails) throw new Error("Key frame timestamps accordion details not found");

// Sort key frames by position
const sortedActions = [...keyFrames, ...phraseFrames].sort((a, b) => a.position - b.position);

// Get the dropdown element
const keyFrameDropdown = document.getElementById('key-frame-dropdown') as Dropdown;
if (!keyFrameDropdown) throw new Error("Key frame dropdown not found");

// Create options string from key frames
const optionsStr = sortedActions.map(action => `${action.name} (${formatTime(action.position)})`).join(',');

// Set the data-options attribute dynamically
keyFrameDropdown.setDataOptions(optionsStr);

// Load default key frame from localStorage if available
const savedDefaultKeyFrame = localStorage.getItem("defaultKeyFrame");
if (savedDefaultKeyFrame) {
    // Find if the saved action still exists in the current options
    const optionsArray = optionsStr.split(',').map(s => s.trim());
    if (optionsArray.includes(savedDefaultKeyFrame)) {
        keyFrameDropdown.value = savedDefaultKeyFrame;
    }
}

// Subscribe to dropdown changes to save the selected value
keyFrameDropdown.subscribe((value) => {
    if (value) {
        localStorage.setItem("defaultKeyFrame", value);
    }
});

// Create a button for each key frame
sortedActions.forEach(action => {
    const button = document.createElement('button');
    button.textContent = `${action.name} (${formatTime(action.position)})`;

    // Add click event listener to seek to the key frame position and play
    button.addEventListener('click', () => {
        player.requestMediaSeek(action.position);
        restartUpdateCycle(action.position);
    });

    keyFrameAccordionDetails.appendChild(button);
});
