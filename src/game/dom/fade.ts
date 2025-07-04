import { Tween, Easing } from "@tweenjs/tween.js";

import { tweenGroup } from "~/lib/update/cycle";

// Get overlay elements from the DOM
const whiteOverlay = document.getElementById('white-overlay') as HTMLElement;
const blackOverlay = document.getElementById('black-overlay') as HTMLElement;
const customColorOverlay = document.getElementById('custom-color-overlay') as HTMLElement;
const textaliveBanner = document.getElementsByClassName("textalive-banner")[0] as HTMLElement;
const loadingWrapper = document.getElementById("loading-wrapper") as HTMLElement;
const playingContainer = document.getElementById("playing") as HTMLElement;
const initContainer = document.getElementById("init") as HTMLElement;
const creditContainer = document.getElementById("credit") as HTMLElement;
const blackTrim = document.getElementById("black-trim") as HTMLElement;
const blackTrimTop = document.getElementById("black-trim-top") as HTMLElement;
const blackTrimBottom = document.getElementById("black-trim-bottom") as HTMLElement;
const neverEndText = document.getElementById("never-end-text") as HTMLElement;

if (!whiteOverlay || !blackOverlay || !customColorOverlay) {
  throw new Error("Fade overlay elements not found in the DOM");
}

if (!playingContainer || !initContainer || !loadingWrapper || !textaliveBanner || !creditContainer) {
  throw new Error("Playing container not found");
}

if (!blackTrim || !blackTrimTop || !blackTrimBottom) {
  throw new Error("Black trim elements not found");
}

if (!neverEndText) {
  throw new Error("Never end text element not found");
}

// Default heights from the original CSS
const SHUTTER_TOP_DEFAULT_HEIGHT = 60;
const SHUTTER_BOTTOM_DEFAULT_HEIGHT = 100;

blackTrimTop.style.height = `${SHUTTER_TOP_DEFAULT_HEIGHT}px`;
blackTrimBottom.style.height = `${SHUTTER_BOTTOM_DEFAULT_HEIGHT}px`;

// Default fade duration in milliseconds
const FADE_DURATION = 3000;

// Type for easing functions
type EasingFunction = (k: number) => number;

// White fade in/out functions
export function whiteFadeIn(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  whiteOverlay.style.opacity = "0";
  whiteOverlay.classList.remove('hidden');
  const tween = new Tween({opacity: 0 }).to({opacity: 1}, duration).easing(easing).onUpdate(x => {
    whiteOverlay.style.opacity = x.opacity.toString();
  }).start();
  tweenGroup.add(tween);
  return tween;
}

export function whiteFadeOut(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  const tween = new Tween({opacity: 1 }).to({opacity: 0}, duration).easing(easing).onUpdate(x => {
    whiteOverlay.style.opacity = x.opacity.toString();
  }).onComplete(() => {
    whiteOverlay.classList.add('hidden');
  }).start();
  tweenGroup.add(tween);
  return tween;
}

export function setWhiteBlur(pixel: number) {
    whiteOverlay.style.filter = `blur(${pixel}px)`;
}

// Black fade in/out functions
export function blackFadeIn(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  blackOverlay.style.opacity = "0";
  blackOverlay.classList.remove('hidden');
  const tween = new Tween({opacity: 0 }).to({opacity: 1}, duration).easing(easing).onUpdate(x => {
    blackOverlay.style.opacity = x.opacity.toString();
  }).start();
  tweenGroup.add(tween);
  return tween;
}

export function blackFadeOut(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  const tween = new Tween({opacity: 1 }).to({opacity: 0}, duration).easing(easing).onUpdate(x => {
    blackOverlay.style.opacity = x.opacity.toString();
  }).onComplete(() => {
    blackOverlay.classList.add('hidden');
  }).start();
  tweenGroup.add(tween);
  return tween;
}

// TextAlive banner fade functions
export function textaliveBannerFadeIn(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  textaliveBanner.style.opacity = "0";
  textaliveBanner.classList.remove('hidden');
  const tween = new Tween({opacity: 0 }).to({opacity: 1}, duration).easing(easing).onUpdate(x => {
    textaliveBanner.style.opacity = x.opacity.toString();
  }).start();
  tweenGroup.add(tween);
  return tween;
}

export function textaliveBannerFadeOut(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  const tween = new Tween({opacity: 1 }).to({opacity: 0}, duration).easing(easing).onUpdate(x => {
    textaliveBanner.style.opacity = x.opacity.toString();
  }).onComplete(() => {
    textaliveBanner.classList.add('hidden');
  }).start();
  tweenGroup.add(tween);
  return tween;
}

// Loading wrapper fade functions
export function loadingWrapperFadeIn(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  loadingWrapper.style.opacity = "0";
  loadingWrapper.classList.remove('hidden');
  const tween = new Tween({opacity: 0 }).to({opacity: 1}, duration).easing(easing).onUpdate(x => {
    loadingWrapper.style.opacity = x.opacity.toString();
  }).start();
  tweenGroup.add(tween);
  return tween;
}

export function loadingWrapperFadeOut(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  const tween = new Tween({opacity: 1 }).to({opacity: 0}, duration).easing(easing).onUpdate(x => {
    loadingWrapper.style.opacity = x.opacity.toString();
  }).onComplete(() => {
    loadingWrapper.classList.add('hidden');
  }).start();
  tweenGroup.add(tween);
  return tween;
}

// Playing container fade functions
export function playingContainerFadeIn(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  playingContainer.style.opacity = "0";
  playingContainer.classList.remove('hidden');
  const tween = new Tween({opacity: 0 }).to({opacity: 1}, duration).easing(easing).onUpdate(x => {
    playingContainer.style.opacity = x.opacity.toString();
  }).start();
  tweenGroup.add(tween);
  return tween;
}

export function playingContainerFadeOut(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  const tween = new Tween({opacity: 1 }).to({opacity: 0}, duration).easing(easing).onUpdate(x => {
    playingContainer.style.opacity = x.opacity.toString();
  }).onComplete(() => {
    playingContainer.classList.add('hidden');
  }).start();
  tweenGroup.add(tween);
  return tween;
}

// Init container fade functions
export function initContainerFadeIn(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  initContainer.style.opacity = "0";
  initContainer.classList.remove('hidden');
  const tween = new Tween({opacity: 0 }).to({opacity: 1}, duration).easing(easing).onUpdate(x => {
    initContainer.style.opacity = x.opacity.toString();
  }).start();
  tweenGroup.add(tween);
  return tween;
}

export function initContainerFadeOut(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  const tween = new Tween({opacity: 1 }).to({opacity: 0}, duration).easing(easing).onUpdate(x => {
    initContainer.style.opacity = x.opacity.toString();
  }).onComplete(() => {
    initContainer.classList.add('hidden');
  }).start();
  tweenGroup.add(tween);
  return tween;
}

// Credit container fade functions
export function creditContainerFadeOut(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  const tween = new Tween({opacity: 1 }).to({opacity: 0}, duration).easing(easing).onUpdate(x => {
    creditContainer.style.opacity = x.opacity.toString();
  }).onComplete(() => {
    creditContainer.classList.add('hidden');
  }).start();
  tweenGroup.add(tween);
  return tween;
}

export function creditContainerFadeIn(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  creditContainer.style.opacity = "0";
  creditContainer.classList.remove('hidden');
  const tween = new Tween({opacity: 0 }).to({opacity: 1}, duration).easing(easing).onUpdate(x => {
    creditContainer.style.opacity = x.opacity.toString();
  }).start();
  tweenGroup.add(tween);
  return tween;
}

// Shutter-like fade effect functions
export function shutterIn(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  // Get the viewport height
  const viewportHeight = window.innerHeight;
  // Calculate the target height for each trim (half of the viewport)
  const targetHeight = viewportHeight / 2;

  // Get the current heights
  const currentTopHeight = parseInt(getComputedStyle(blackTrimTop).height) || 15;
  const currentBottomHeight = parseInt(getComputedStyle(blackTrimBottom).height) || 25;

  // Animate the top trim height
  const topTween = new Tween({ height: currentTopHeight }).to({ height: targetHeight }, duration).easing(easing).onUpdate(x => {
    blackTrimTop.style.height = `${x.height}px`;
  }).start();
  tweenGroup.add(topTween);

  // Animate the bottom trim height
  const bottomTween = new Tween({ height: currentBottomHeight }).to({ height: targetHeight }, duration).easing(easing).onUpdate(x => {
    blackTrimBottom.style.height = `${x.height}px`;
  }).start();
  tweenGroup.add(bottomTween);

  return topTween;
}

export function shutterOut(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  // Get the viewport height
  const viewportHeight = window.innerHeight;

  // Get the current heights
  const currentTopHeight = parseInt(getComputedStyle(blackTrimTop).height) || viewportHeight / 2;
  const currentBottomHeight = parseInt(getComputedStyle(blackTrimBottom).height) || viewportHeight / 2;

  // Animate the top trim height
  const topTween = new Tween({ height: currentTopHeight }).to({ height: SHUTTER_TOP_DEFAULT_HEIGHT }, duration).easing(easing).onUpdate(x => {
    blackTrimTop.style.height = `${x.height}px`;
  }).start();
  tweenGroup.add(topTween);

  // Animate the bottom trim height
  const bottomTween = new Tween({ height: currentBottomHeight }).to({ height: SHUTTER_BOTTOM_DEFAULT_HEIGHT }, duration).easing(easing).onUpdate(x => {
    blackTrimBottom.style.height = `${x.height}px`;
  }).start();
  tweenGroup.add(bottomTween);

  return topTween;
}

// Shutter fade effect functions (combining shutter and fade)
export function shutterFadeIn(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  // Start with the shutter at default position and black overlay transparent
  blackTrimTop.style.height = `${SHUTTER_TOP_DEFAULT_HEIGHT}px`;
  blackTrimBottom.style.height = `${SHUTTER_BOTTOM_DEFAULT_HEIGHT}px`;
  blackOverlay.style.opacity = '0';
  // Remove the 'hidden' class to make sure it's visible
  blackOverlay.classList.remove('hidden');


  // Get the viewport height
  const viewportHeight = window.innerHeight;
  // Calculate the target height for each trim (half of the viewport)
  const targetHeight = viewportHeight / 2;

  // Get the current heights
  const currentTopHeight = parseInt(getComputedStyle(blackTrimTop).height) || SHUTTER_TOP_DEFAULT_HEIGHT;
  const currentBottomHeight = parseInt(getComputedStyle(blackTrimBottom).height) || SHUTTER_BOTTOM_DEFAULT_HEIGHT;

  // Animate the top trim height
  const topTween = new Tween({ height: currentTopHeight }).to({ height: targetHeight }, duration).easing(easing).onUpdate(x => {
    blackTrimTop.style.height = `${x.height}px`;
  }).start();
  tweenGroup.add(topTween);

  // Animate the bottom trim height
  const bottomTween = new Tween({ height: currentBottomHeight }).to({ height: targetHeight }, duration).easing(easing).onUpdate(x => {
    blackTrimBottom.style.height = `${x.height}px`;
  }).start();
  tweenGroup.add(bottomTween);

  // Animate the black overlay opacity
  const fadeTween = new Tween({ opacity: 0 }).to({ opacity: 1 }, duration).easing(easing).onUpdate(x => {
    blackOverlay.style.opacity = x.opacity.toString();
  }).start();
  tweenGroup.add(fadeTween);

  return fadeTween;
}

export function shutterFadeOut(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  const tween = new Tween({ opacity: 1 }).to({ opacity: 0 }, duration).easing(easing).onUpdate(x => {
    blackTrim.style.opacity = x.opacity.toString();
  }).onComplete(() => {
    blackTrim.classList.add('hidden');
  }).start();
  tweenGroup.add(tween);
  return tween;
}

// Custom color fade functions
export function setCustomColor(color: string): void {
  customColorOverlay.style.backgroundColor = color;
}

export function customColorFadeIn(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  customColorOverlay.style.opacity = "0";
  customColorOverlay.classList.remove('hidden');
  const tween = new Tween({ opacity: 0 }).to({ opacity: 1 }, duration).easing(easing).onUpdate(x => {
    customColorOverlay.style.opacity = x.opacity.toString();
  }).start();
  tweenGroup.add(tween);
  return tween;
}

export function customColorFadeOut(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  const tween = new Tween({ opacity: 1 }).to({ opacity: 0 }, duration).easing(easing).onUpdate(x => {
    customColorOverlay.style.opacity = x.opacity.toString();
  }).onComplete(() => {
    customColorOverlay.classList.add('hidden');
  }).start();
  tweenGroup.add(tween);
  return tween;
}

// Never end text fade functions
export function neverEndTextFadeIn(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  neverEndText.style.opacity = "0";
  neverEndText.classList.remove('hidden');
  const tween = new Tween({ opacity: 0 }).to({ opacity: 1 }, duration).easing(easing).onUpdate(x => {
    neverEndText.style.opacity = x.opacity.toString();
  }).start();
  tweenGroup.add(tween);
  return tween;
}

export function neverEndTextFadeOut(duration: number = FADE_DURATION, easing: EasingFunction = Easing.Linear.None) {
  const tween = new Tween({ opacity: 1 }).to({ opacity: 0 }, duration).easing(easing).onUpdate(x => {
    neverEndText.style.opacity = x.opacity.toString();
  }).onComplete(() => {
    neverEndText.classList.add('hidden');
  }).start();
  tweenGroup.add(tween);
  return tween;
}

// Export Easing for convenience
export { Easing }