import { events as babylonEvents } from "../babylon/events";
import { playAnimation } from "../babylon/mdl";
import { switchCamera } from "../babylon/camera";

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