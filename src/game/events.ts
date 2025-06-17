import mitt, { type Emitter } from 'mitt';

type CameraAction = {
  name: string;
  position: number;
  executed?: boolean; // Track if the action has been executed
};

type Events = {
  onCameraAction: {
    action: CameraAction;
    position: number;
  };
}

export const events: Emitter<Events> = mitt<Events>();

// Array of camera actions with their trigger positions
export const cameraActions: CameraAction[] = [
  { name: "initialize", position: 0 },
  { name: "camera-zoom-leg", position: 31000 }
];

export const checkCameraActions = (position: number): void => {
  for (const action of cameraActions) {
    if (action.executed) continue;
    if (action.position <= position) {
      events.emit('onCameraAction', {
        action,
        position
      });
      // Mark the action as executed
      action.executed = true;
    }
  }
};
