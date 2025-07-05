import { ToggleSwitch } from "../web-components/toggle-switch";
import { enableStarParticles, disableStarParticles } from "~/lib/babylon/star-particle";

const particleToggle = document.getElementById("particle-visibility-star") as ToggleSwitch;

console.log("Particle toggle element:", particleToggle);

particleToggle?.subscribe((checked) => {
    console.log("Toggle changed:", checked);
    checked ? enableStarParticles() : disableStarParticles();
});