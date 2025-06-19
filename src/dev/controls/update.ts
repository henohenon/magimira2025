import {gameUpdate} from "~/game/update";
import {setUpdateLogic} from "~/update";

import {updateModelInfo} from "./models";
import {updateCameraInfo} from "./camera";
import {updateTextAliveInfo} from "./text-alive";
import {updateLightInfo} from "~/dev/controls/light.ts";

setUpdateLogic((currentPosition, delta) => {
    // Update camera position and rotation info
    updateTextAliveInfo(currentPosition);
    updateCameraInfo();
    updateModelInfo();
    updateLightInfo();

    gameUpdate(currentPosition, delta);
});
