import {createCircleRipple, createSquareRipple} from "../../effects/ripple";
import type {DoubleInput} from "../web-components/double-input.ts";
import type {NumberInput} from "../web-components/number-input.ts";
import type {ColorPicker} from "../web-components/color-picker.ts";


const circlePosition = document.getElementById("circle-ripple-position-input") as DoubleInput;
const circleLifetime = document.getElementById("circle-ripple-lifetime-input") as NumberInput;
const circleDefaultSize = document.getElementById("circle-ripple-default-size-input") as NumberInput;
const circleSizeDelta = document.getElementById("circle-ripple-size-delta-input") as NumberInput;
const circleDefaultOpacity = document.getElementById("circle-ripple-default-opacity-input") as NumberInput;
const circleOpacityDelta = document.getElementById("circle-ripple-opacity-delta-input") as NumberInput;
const circleColor = document.getElementById("circle-ripple-color-input") as ColorPicker;
const circleGenerateButton = document.getElementById("circle-ripple-generate-button") as HTMLButtonElement;

const squarePosition = document.getElementById("square-ripple-position-input") as DoubleInput;
const squareLifetime = document.getElementById("square-ripple-lifetime-input") as NumberInput;
const squareDefaultSize = document.getElementById("square-ripple-default-size-input") as NumberInput;
const squareSizeDelta = document.getElementById("square-ripple-size-delta-input") as NumberInput;
const squareDefaultOpacity = document.getElementById("square-ripple-default-opacity-input") as NumberInput;
const squareOpacityDelta = document.getElementById("square-ripple-opacity-delta-input") as NumberInput;
const squareColor = document.getElementById("square-ripple-color-input") as ColorPicker;
const squareAngle = document.getElementById("square-ripple-angle-input") as NumberInput;
const squareGenerateButton = document.getElementById("square-ripple-generate-button") as HTMLButtonElement;

if (!circlePosition || !circleLifetime || !circleDefaultSize || !circleSizeDelta ||
    !circleDefaultOpacity || !circleOpacityDelta || !circleColor || !circleGenerateButton ||
    !squarePosition || !squareLifetime || !squareDefaultSize || !squareSizeDelta ||
    !squareDefaultOpacity || !squareOpacityDelta || !squareColor || !squareAngle || !squareGenerateButton) {
    throw new Error("Ripple controls not found");
}

// Set default positions to center of screen
const centerOfWidth = window.innerWidth / 2;
const centerOfHeight = window.innerHeight / 2;
circlePosition.value1 = centerOfWidth;
circlePosition.value2 = centerOfHeight;
squarePosition.value1 = centerOfWidth;
squarePosition.value2 = centerOfHeight;

// Circle Ripple Event Listener
circleGenerateButton.addEventListener("click", () => {

    createCircleRipple(
        circlePosition.value1,
        circlePosition.value2,
        {
            lifeTime: circleLifetime.value,
            defaultSize: circleDefaultSize.value,
            sizeDelta: circleSizeDelta.value,
            defaultOpacity: circleDefaultOpacity.value,
            opacityDelta: circleOpacityDelta.value,
            color: circleColor.value,
        }
    );
});

// Square Ripple Event Listener
squareGenerateButton.addEventListener("click", () => {
    createSquareRipple(
        squarePosition.value1,
        squarePosition.value2,
        {
            lifeTime: squareLifetime.value,
            defaultSize: squareDefaultSize.value,
            sizeDelta: squareSizeDelta.value,
            defaultOpacity: squareDefaultOpacity.value,
            opacityDelta: squareOpacityDelta.value,
        }
    )
})