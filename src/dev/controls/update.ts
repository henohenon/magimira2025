import {gameUpdate} from "~/game/update";
import {setUpdateLogic} from "~/lib/update/cycle";

import {updateModelInfo} from "./models";
import {updateCameraInfo} from "./camera";
import {updateLightInfo} from "./light";
import {updateTextAliveInfo} from "./text-alive";
import {updateGlitchCount} from "./glitch";

setUpdateLogic((lastPosition, currentPosition, delta) => {
    // Update camera position and rotation info
    updateTextAliveInfo(currentPosition);
    updateCameraInfo();
    updateModelInfo();
    updateLightInfo();
    updateGlitchCount();

    gameUpdate(lastPosition, currentPosition, delta);
});
