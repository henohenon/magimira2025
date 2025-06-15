import { counter, counterInstance } from "~/game/input.ts";

const counterSlider = document.getElementById("counter-slider") as HTMLInputElement;
const counterInput = document.getElementById("counter-input") as HTMLInputElement;

if (!counterSlider || !counterInput) {
    throw new Error("Counter controls not found");
}

counterSlider.addEventListener("input", () => {
    const value = parseInt(counterSlider.value);
    counterInput.value = value.toString();
    counterInstance.set(value);
});

counterInput.addEventListener("change", () => {
    const value = parseInt(counterInput.value);
    counterSlider.value = value.toString();
    counterInstance.set(value);
});

counter.subscribe((event) => {
    const count = event.count;
    counterSlider.value = count.toString();
    counterInput.value = count.toString();
    console.log("Counter updated:", count);
});
