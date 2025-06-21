// 初期化順の都合
import { spectrums } from "./utils.ts";

// Import the spectrum implementations
import { circle } from "./circle.ts";
import { horizontal } from "./horizontal.ts";
import { vertical } from "./vertical.ts";

// Re-export everything from spectrum-utils.ts
export * from "./utils.ts";

// Re-export the spectrum implementations
export * from "./circle.ts";
export * from "./horizontal.ts";
export * from "./vertical.ts";

// Populate the spectrums object
spectrums["circle"] = circle();
spectrums["horizontal"] = horizontal();
spectrums["vertical"] = vertical();

// Export the populated spectrums object
export { spectrums };
