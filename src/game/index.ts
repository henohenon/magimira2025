import "./update";
// import "./preset";
import "./input";
import {setCameraPosition, switchCamera} from "~/babylon/camera";
import {setPosition} from "~/babylon/mdl";
import { events } from "~/babylon/events";

switchCamera("normal");
setCameraPosition("normal", -2.5, 1.5, -8);

events.on("onModelsLoaded", () => {
    // Play the animation for the dotmiku model
    setPosition("dotmiku", -2.5, 0 , 0);
});