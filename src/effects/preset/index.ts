import { spectrums } from "../spectrum";
import { clearRipples } from "../ripple";
import { setLightingPreset, switchLight } from "./light";
import { addCameraRotation, setCameraPosition, switchCamera } from "~/babylon/camera";
import type { HorizontalSpectrum, VerticalSpectrum } from "../spectrum";

export const clearAllEffects = () => {
  // Disable all spectrum effects
  Object.values(spectrums).forEach(spectrum => {
    spectrum.setEnable(false);
  });

  // Clear all ripple effects
  clearRipples();
};

export const circleRippleAndCircleSpectrum = () => {
  // Clear existing effects
  clearAllEffects();

  // Enable and configure circle spectrum
  const circleSpec = spectrums["circle"];
  circleSpec.setEnable(true);
  circleSpec.setColor("#00FFFF"); // Cyan color
  circleSpec.setHueOffset(180);
  circleSpec.setOpacity(0.8);
  circleSpec.setLineCounts(30);
}

export const squareRippleAndVerticalSpectrum = () => {
  // Clear existing effects
  clearAllEffects();

  // Enable and configure vertical spectrum
  const verticalSpec = spectrums["vertical"] as VerticalSpectrum;
  verticalSpec.setEnable(true);
  verticalSpec.setColor("#FF00FF"); // Magenta color
  verticalSpec.setHueOffset(120);
  verticalSpec.setOpacity(0.8);
  verticalSpec.setLineCounts(25);
  verticalSpec.setWidth(400);
}

export const cameraMoveAndHorizontalSpectrum = () => {
  // Clear existing effects
  clearAllEffects();

  // Enable and configure horizontal spectrum
  const horizontalSpec = spectrums["horizontal"] as HorizontalSpectrum;
  horizontalSpec.setEnable(true);
  horizontalSpec.setColor("#00FF00"); // Green color
  horizontalSpec.setHueOffset(90);
  horizontalSpec.setOpacity(0.7);
  horizontalSpec.setLineCounts(35);
  horizontalSpec.setHeight(250);

  // Move the camera
  // Set initial position
  setCameraPosition("default", 0, 5, -10);

  // Add rotation to create a smooth camera movement
  addCameraRotation("default", 0.05, 0.03, 0);

  // Set lighting to sunset for dramatic effect
  setLightingPreset("sunset");
}

export const colorFullAll = () => {
  // Clear existing effects
  clearAllEffects();

  // Enable and configure all spectrum types with vibrant colors

  // Circle spectrum
  const circleSpec = spectrums["circle"];
  circleSpec.setEnable(true);
  circleSpec.setColor("#FF0000"); // Red color
  circleSpec.setHueOffset(360); // Full color cycle
  circleSpec.setOpacity(0.8);
  circleSpec.setLineCounts(20);

  // Horizontal spectrum
  const horizontalSpec = spectrums["horizontal"] as HorizontalSpectrum;
  horizontalSpec.setEnable(true);
  horizontalSpec.setColor("#00FF00"); // Green color
  horizontalSpec.setHueOffset(180);
  horizontalSpec.setOpacity(0.7);
  horizontalSpec.setLineCounts(15);
  horizontalSpec.setHeight(150);

  // Vertical spectrum
  const verticalSpec = spectrums["vertical"] as VerticalSpectrum;
  verticalSpec.setEnable(true);
  verticalSpec.setColor("#0000FF"); // Blue color
  verticalSpec.setHueOffset(240);
  verticalSpec.setOpacity(0.7);
  verticalSpec.setLineCounts(15);
  verticalSpec.setWidth(150);


  // Set colorful lighting
  setLightingPreset("dawn");

  // Add slight camera movement
  addCameraRotation("default", 0.02, 0.01, 0);
}

// New presets with camera switching and lighting presets

export const frontCameraWithDayLight = () => {
  // Clear existing effects
  clearAllEffects();

  // Switch to front camera
  switchCamera("front");

  // Set day lighting
  setLightingPreset("day");

  // Enable circle spectrum with bright colors
  const circleSpec = spectrums["circle"];
  circleSpec.setEnable(true);
  circleSpec.setColor("#FFFF00"); // Yellow color
  circleSpec.setHueOffset(60);
  circleSpec.setOpacity(0.7);
  circleSpec.setLineCounts(25);
}

export const sideCameraWithNightLight = () => {
  // Clear existing effects
  clearAllEffects();

  // Switch to side camera
  switchCamera("side");

  // Set night lighting
  setLightingPreset("night");

  // Enable vertical spectrum with cool colors
  const verticalSpec = spectrums["vertical"] as VerticalSpectrum;
  verticalSpec.setEnable(true);
  verticalSpec.setColor("#00FFFF"); // Cyan color
  verticalSpec.setHueOffset(180);
  verticalSpec.setOpacity(0.9);
  verticalSpec.setLineCounts(30);
  verticalSpec.setWidth(300);

  // Add subtle camera rotation for night sky effect
  addCameraRotation("side", 0.01, 0.005, 0);
}

export const topCameraWithSunsetLight = () => {
  // Clear existing effects
  clearAllEffects();

  // Switch to top camera
  switchCamera("top");

  // Set sunset lighting
  setLightingPreset("sunset");

  // Enable horizontal spectrum with warm colors
  const horizontalSpec = spectrums["horizontal"] as HorizontalSpectrum;
  horizontalSpec.setEnable(true);
  horizontalSpec.setColor("#FF8000"); // Orange color
  horizontalSpec.setHueOffset(30);
  horizontalSpec.setOpacity(0.8);
  horizontalSpec.setLineCounts(20);
  horizontalSpec.setHeight(200);
}

export const defaultCameraWithDawnLight = () => {
  // Clear existing effects
  clearAllEffects();

  // Switch to default camera
  switchCamera("default");

  // Set dawn lighting
  setLightingPreset("dawn");

  // Enable all spectrum types with dawn colors

  // Circle spectrum
  const circleSpec = spectrums["circle"];
  circleSpec.setEnable(true);
  circleSpec.setColor("#FF80FF"); // Pink color
  circleSpec.setHueOffset(300);
  circleSpec.setOpacity(0.7);
  circleSpec.setLineCounts(15);
}

// Additional presets with different light types

export const spotLightWithSideCamera = () => {
  // Clear existing effects
  clearAllEffects();

  // Switch to side camera
  switchCamera("side");

  // Switch to spot light
  switchLight("spot");

  // Enable horizontal spectrum with spot light colors
  const horizontalSpec = spectrums["horizontal"] as HorizontalSpectrum;
  horizontalSpec.setEnable(true);
  horizontalSpec.setColor("#FFCCCC"); // Light red color
  horizontalSpec.setHueOffset(15);
  horizontalSpec.setOpacity(0.8);
  horizontalSpec.setLineCounts(25);
  horizontalSpec.setHeight(180);
}

export const pointLightWithTopCamera = () => {
  // Clear existing effects
  clearAllEffects();

  // Switch to top camera
  switchCamera("top");

  // Switch to point light
  switchLight("point");

  // Enable circle spectrum with point light colors
  const circleSpec = spectrums["circle"];
  circleSpec.setEnable(true);
  circleSpec.setColor("#9999FF"); // Light blue color
  circleSpec.setHueOffset(240);
  circleSpec.setOpacity(0.7);
  circleSpec.setLineCounts(30);

  // Add subtle camera rotation for dynamic effect
  addCameraRotation("top", 0.01, 0.01, 0);
}

export const hemisphericLightWithFrontCamera = () => {
  // Clear existing effects
  clearAllEffects();

  // Switch to front camera
  switchCamera("front");

  // Switch to hemispheric light
  switchLight("hemispheric");

  // Enable vertical spectrum with hemispheric light colors
  const verticalSpec = spectrums["vertical"] as VerticalSpectrum;
  verticalSpec.setEnable(true);
  verticalSpec.setColor("#B3B3FF"); // Light purple color
  verticalSpec.setHueOffset(270);
  verticalSpec.setOpacity(0.8);
  verticalSpec.setLineCounts(20);
  verticalSpec.setWidth(250);
}
