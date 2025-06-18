import "./text-alive.ts";
import "./camera.ts";
import "./light.ts";
import "./spectrum.ts";
import "./ripple.ts";
import "./models.ts";
import "./glitch.ts";

import type {Accordion} from "../web-components/accordion.ts";

const accordions = document.querySelectorAll("dev-accordion") as NodeListOf<Accordion>;
const closeAllButton = document.getElementById("close-all-button");
closeAllButton?.addEventListener("click", () => {
    for(const accordion of accordions) {
        accordion.close();
    }
});
