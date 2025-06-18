import type { InputAndSlider } from "../web-components/input-slider";
import {setUpdateLogic} from "~/update";
import {gameUpdate} from "~/game/update.ts";

// Reference to the time slider element
const timeInputSlider = document.getElementById("time-input-slider") as InputAndSlider;
if (!timeInputSlider) throw new Error("Time controls not found");

setUpdateLogic((currentPosition, delta) => {
    timeInputSlider.value = Math.round(currentPosition);
    gameUpdate(currentPosition, delta);
});