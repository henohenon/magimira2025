import "../babylon/main";
import "../text-alive/main";


import { events as babylonEvents } from "../babylon/events";
import { events as textaliveEvents } from "../text-alive/events";
import { playAnimation } from "../babylon/mdl";


let babylonLoaded = false;
let textaliveLoaded = false;
babylonEvents.on("onSceneLoaded", () => {
    babylonLoaded = true;
    updateLoading();
});
textaliveEvents.on("onAppReady", () => {
    textaliveLoaded = true;
    updateLoading();
});

function updateLoading() {
    if (!(babylonLoaded && textaliveLoaded)) return;
    
    const loadingWrapper = document.getElementById("loadingWrapper");
    if (!loadingWrapper) {
        throw new Error("Loading wrapper not found");
    }
    loadingWrapper.classList.add("hidden");
    playAnimation("startListen");
}

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