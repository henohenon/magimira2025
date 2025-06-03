import { events as babylonEvents } from "../babylon/events";
import { playAnimation } from "../babylon/mdl";
import { switchCamera } from "../babylon/camera";
import { switchLight } from "../babylon/light"; // ← これを追加

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

// ライトボタンのイベントリスナーを追加
for(const id of ["default","spot","point","hemispheric"]){
    const btn = document.getElementById(`light-${id}`);
    if (!btn) {
        throw new Error(`Light button ${id} not found`);
    }
    btn.addEventListener("click", () => switchLight(id));
}