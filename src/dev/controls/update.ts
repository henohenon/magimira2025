import {setUpdateLogic} from "~/update";
import {gameUpdate} from "~/game/update";

import {updateModelInfo} from "./models";
import {updateCameraInfo} from "./camera";
import {updateTextAliveInfo} from "./text-alive";

setUpdateLogic((currentPosition, delta) => {
    // Update camera position and rotation info
    updateTextAliveInfo(currentPosition);
    updateCameraInfo();
    updateModelInfo();

    gameUpdate(currentPosition, delta);
});
