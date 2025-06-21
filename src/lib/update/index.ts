import {events} from "~/lib/text-alive/events.ts";
import {player} from "~/lib/text-alive";
import {restartUpdateCycle, stopUpdateCycle} from "./cycle.ts";

// Setup event listeners similar to src/dev/controls/update.ts
events.on("onPause", () => {
  stopUpdateCycle();
});

events.on("onPlay", ({ position }) => {
  restartUpdateCycle(position);
});

events.on("onSeek", ({ position }) => {
  if (!player.isPlaying) return;
  restartUpdateCycle(position);
});


/**
 * Creates a Promise that resolves after the specified number of milliseconds
 * @param milliseconds The time to delay in milliseconds
 * @returns A Promise that resolves after the specified delay
 */
export const delayForMilSeconds = (milliseconds: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}
