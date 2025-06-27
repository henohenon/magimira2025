import mitt from "mitt";
import {createSubject} from "prismatix-input/mitt-ex";
import type {WithPositionInputEvent} from "prismatix-input/input";
import {createKeyboardInput, type KeyboardInputEvent} from "prismatix-input/input/keyboard";
import {createPointerInputWithPosition} from "prismatix-input/input/pointer";
import {createKeycodePositionMiddleware} from "prismatix-input/middleware/keycode-position";
import type {PRXSubject} from "prismatix-input/types";
import {createCircleRipple} from "~/lib/effects/ripple";

type Events = {
    "keyboard": KeyboardInputEvent,
    "position": WithPositionInputEvent
};

const emitter = mitt<Events>();
const keyboard = createSubject<Events>(emitter, "keyboard") as PRXSubject<KeyboardInputEvent>;
const position = createSubject<Events>(emitter, "position") as PRXSubject<WithPositionInputEvent>;

const inputArea = document.getElementById("input-area");
if (!inputArea) {
    throw new Error("Input area not found");
}
console.log("Input area found:", inputArea as EventTarget);
createKeyboardInput(keyboard, { events: "keydown", target: inputArea as EventTarget });
createPointerInputWithPosition(position, { events: "pointerdown", target: inputArea as EventTarget });
createKeycodePositionMiddleware(keyboard, position, { scaleTarget: inputArea });

position.subscribe(event => {
    console.log("position", event);
    createCircleRipple(event.x, event.y);
});
