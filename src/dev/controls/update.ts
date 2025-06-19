import type { InputAndSlider } from "../web-components/input-slider";
import {updateCameraInfo} from "./camera.ts";
import {updateModelInfo} from "~/dev/controls/models.ts";
import {setUpdateLogic} from "~/update";
import {gameUpdate} from "~/game/update.ts";

// Reference to the time slider element
const timeInputSlider = document.getElementById("time-input-slider") as InputAndSlider;
if (!timeInputSlider) throw new Error("Time controls not found");

setUpdateLogic((currentPosition, delta) => {
    // Update the time slider with the current position
    timeInputSlider.value = Math.round(currentPosition);

    // Update camera position and rotation info
    updateCameraInfo();
    updateModelInfo();

    gameUpdate(currentPosition, delta);
});
