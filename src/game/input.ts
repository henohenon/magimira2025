import mitt from "mitt";
import {createSubject} from "prismatix-input/mitt-ex";
import type {WithPositionInputEvent} from "prismatix-input/input";
import {createKeyboardInput, type KeyboardInputEvent} from "prismatix-input/input/keyboard";
import {createPointerInputWithPosition} from "prismatix-input/input/pointer";
import type {PRXSubject} from "prismatix-input/types";
import {createKeycodePositionMiddleware} from "prismatix-input/middleware/keycode-position";

type Events = {
    "keyboard": KeyboardInputEvent,
    "pointer": WithPositionInputEvent
    "positionSpectrum": WithPositionInputEvent,
    "positionRipple": WithPositionInputEvent,
};

const emitter = mitt<Events>();
const keyboard = createSubject<Events>(emitter, "keyboard") as PRXSubject<KeyboardInputEvent>;
const pointer = createSubject<Events>(emitter, "pointer") as PRXSubject<WithPositionInputEvent>;
export const positionSpectrum = createSubject<Events>(emitter, "positionSpectrum") as PRXSubject<WithPositionInputEvent>;
export const positionRipple = createSubject<Events>(emitter, "positionRipple") as PRXSubject<WithPositionInputEvent>;

export const inputArea = document.getElementById("input-area") || document.body;
if (!document.getElementById("input-area")) {
    throw new Error("Input area not found");
}

console.log("Input area found:", inputArea as EventTarget);
createKeyboardInput(keyboard, { events: ["keydown-norepeat", "keydown-repeat", "keyup"], target: inputArea as EventTarget });
createKeycodePositionMiddleware(keyboard, [positionRipple, positionSpectrum], { scaleTarget: inputArea });
createPointerInputWithPosition(pointer, { events: ["pointerdown", "pointermove", "pointerup"], target: inputArea as EventTarget });
createPointerInputWithPosition(positionRipple, { events: ["pointerdown"], target: inputArea as EventTarget });

const pointerPositions = new Map<string, { x: number, y: number }>();
pointer.subscribe(e => {
   const pos = pointerPositions.get(e.key);
   switch (e.action) {
       case "start":
           positionSpectrum.next(e);
           pointerPositions.set(e.key, e);
           break;
       case "move":
           if(pos){
               positionSpectrum.next({
                   ...e,
                   action: "end",
                   x: pos.x,
                   y: pos.y,
               });
               positionSpectrum.next({
                   ...e,
                   action: "start",
               });
               pointerPositions.set(e.key, e);
           }
           break;
       case "end":
           if(pos){
               positionSpectrum.next({
                   ...e,
                   action: "end",
                   x: pos.x,
                   y: pos.y,
               });
           }
           pointerPositions.delete(e.key);
           positionSpectrum.next(e);
           break;
   }
});
