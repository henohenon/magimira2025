import mitt from "mitt";
import {createSubjects} from "prismatix-input/mitt";
import {
    keyboardInput,
    type KeyboardInputEvent, type KeyboardInputOptions,
    pointerInput,
    type PointerInputOptions, type WithPositionInputEvent
} from "prismatix-input/web-native";
import type {Subject} from "prismatix-input/subject";
import {
    type CounterInputEvent,
    type CounterMiddleware,
    counterMiddleware,
    type DurationInputEvent,
    repeatInput,
    type RepeatInputEvent,
    startToEndDurationInput
} from "prismatix-input/middleware";

type Events = {
    anyInput: KeyboardInputEvent | WithPositionInputEvent;
    pointer: WithPositionInputEvent;
    duration: DurationInputEvent;
    durationRepeat: DurationInputEvent | RepeatInputEvent;
    counter: CounterInputEvent;
};

const emitter = mitt<Events>();
export const { anyInput, pointer, duration, durationRepeat, counter } = createSubjects(emitter, ["anyInput", "pointer", "durationRepeat", "duration", "counter"]);

const inputArea = document.getElementById("input-area");
pointerInput([anyInput, pointer], { events: ["pointerdown", "pointerup"], target: inputArea } as PointerInputOptions);
keyboardInput(anyInput as Subject<KeyboardInputEvent>, { events: ["keydown-norepeat", "keyup"], target: inputArea as EventTarget } as KeyboardInputOptions);
startToEndDurationInput(anyInput, [durationRepeat as Subject<DurationInputEvent>, duration], { minDuration: 300 });
repeatInput(anyInput, durationRepeat as Subject<RepeatInputEvent>)
export const counterInstance = counterMiddleware(durationRepeat, counter) as CounterMiddleware;
