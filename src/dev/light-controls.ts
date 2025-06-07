import {
    switchLight,
    setLightIntensity,
    setLightingPreset,
    restoreDefaultSettings
} from "../babylon/light";

// Light type buttons
for(const id of ["default","spot","point","hemispheric"]){
    const btn = document.getElementById(`light-${id}`);
    if (!btn) {
        throw new Error(`Light button ${id} not found`);
    }
    btn.addEventListener("click", () => switchLight(id));
}

// Light intensity controls
const lightIntensityKeySelect = document.getElementById('light-intensity-key') as HTMLSelectElement;
const lightIntensitySlider = document.getElementById('light-intensity-slider') as HTMLInputElement;
const lightIntensityValue = document.getElementById('light-intensity-value') as HTMLSpanElement;
const lightIntensityApply = document.getElementById('light-intensity-apply') as HTMLButtonElement;

if (lightIntensityKeySelect && lightIntensitySlider && lightIntensityValue && lightIntensityApply) {
    // Update intensity display
    function updateIntensityDisplay() {
        lightIntensityValue.textContent = lightIntensitySlider.value;
    }

    // Apply light intensity function
    function applyLightIntensity() {
        const intensity = parseFloat(lightIntensitySlider.value);
        const lightKey = lightIntensityKeySelect.value;
        setLightIntensity(intensity, lightKey);

        // Visual feedback
        lightIntensityApply.classList.add('bg-green-600');
        lightIntensityApply.textContent = '適用済み';
        setTimeout(() => {
            lightIntensityApply.classList.remove('bg-green-600');
            lightIntensityApply.textContent = '適用';
        }, 1000);
    }

    // Slider input event (display update + real-time apply)
    lightIntensitySlider.addEventListener('input', () => {
        updateIntensityDisplay();
        applyLightIntensity(); // Real-time apply
    });

    // Apply button event handler
    lightIntensityApply.addEventListener('click', applyLightIntensity);

    // Light key selection change event
    lightIntensityKeySelect.addEventListener('change', () => {
        // Apply current intensity to selected light
        applyLightIntensity();
    });

    // Initial display update
    updateIntensityDisplay();
}

// Lighting preset buttons
const presetButtons = {
    default: document.getElementById('preset-default'),
    day: document.getElementById('preset-day'),
    night: document.getElementById('preset-night'),
    sunset: document.getElementById('preset-sunset'),
    dawn: document.getElementById('preset-dawn')
};

// Preset button event handlers
Object.entries(presetButtons).forEach(([preset, button]) => {
    if (button) {
        button.addEventListener('click', () => {
            if (preset === 'default') {
                // Restore default settings
                restoreDefaultSettings();
            } else {
                // Apply normal preset
                setLightingPreset(preset);
            }

            // Visual feedback effect
            button.classList.add('preset-applied');
            setTimeout(() => {
                button.classList.remove('preset-applied');
            }, 600);

            console.log(`Applied ${preset} lighting preset`);
        });
    }
});