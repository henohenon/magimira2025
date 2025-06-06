import { events as babylonEvents } from "../babylon/events";
import { playAnimation } from "../babylon/mdl";
import { switchCamera } from "../babylon/camera";
import { counter, counterInstance } from "../main";

const animationList = document.getElementById("animationList");
if (!animationList) {
    throw new Error("Animation list not found");
}

babylonEvents.on("onMdlAnimLoaded", (animationNames) => {
    animationNames.map((name) => {
        const button = document.createElement("button");
        button.innerText = name;
        button.addEventListener("click", () => {
            playAnimation(name);
        });
        animationList.appendChild(button);
        return button;
    });
});

for(const id of ["default","front","side","top","free"]){
    const btn = document.getElementById(`camera-${id}`);
    if (!btn) {
        throw new Error(`Camera button ${id} not found`);
    }
    btn.addEventListener("click", () => switchCamera(id));
}

// Counter slider and input field setup
const counterSlider = document.getElementById("counter-slider") as HTMLInputElement;
const counterInput = document.getElementById("counter-input") as HTMLInputElement;

if (!counterSlider || !counterInput) {
    throw new Error("Counter controls not found");
}

counterSlider.addEventListener("input", () => {
    const value = parseInt(counterSlider.value);
    counterInput.value = value.toString();
    counterInstance.set(value);
});

counterInput.addEventListener("change", () => {
    const value = parseInt(counterInput.value);
    counterSlider.value = value.toString();
    counterInstance.set(value);
});

counter.subscribe((event) => {
    const count = event.count;
    counterSlider.value = count.toString();
    counterInput.value = count.toString();
    console.log("Counter updated:", count);
});
