import mitt, { type Emitter } from 'mitt';

type KeyFrame = {
  name: string;
  position: number;
  executed?: boolean; // Track if the key frame has been executed
};

type Events = {
  onLoaded: undefined;
  onGameStart: undefined;
  onKeyFrame: {
    action: KeyFrame;
    position: number;
  };
}

export const events: Emitter<Events> = mitt<Events>();

// Array of key frames with their trigger positions
export const keyFrames: KeyFrame[] = [
  { name: "2C", position: 11000 },
  { name: "first", position: 21000 }
];

export const checkKeyFrames = (position: number): void => {
  for (const action of keyFrames) {
    if (action.executed) continue;
    if (action.position <= position) {
      events.emit('onKeyFrame', {
        action,
        position
      });
      // Mark the key frame as executed
      action.executed = true;
    }
  }
};
