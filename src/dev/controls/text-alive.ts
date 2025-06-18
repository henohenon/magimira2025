import {player} from "~/text-alive";
import {events} from "~/text-alive/events.ts";
import type {InputAndSlider} from "../web-components/input-slider.ts";

const forceStartButton = document.getElementById("force-start-button");
forceStartButton?.addEventListener("click", () => {
    player.requestMediaSeek(0);
    player.requestPlay();
    events.emit("onGameStart");
})

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
