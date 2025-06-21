// Fade effects
import { tween } from "~/update/tween.ts";

// Get overlay elements from the DOM
const whiteOverlay = document.getElementById('white-overlay') as HTMLElement;
const blackOverlay = document.getElementById('black-overlay') as HTMLElement;
const textaliveBanner = document.getElementsByClassName("textalive-banner")[0] as HTMLElement;
const loadingWrapper = document.getElementById("loading-wrapper");
const playingContainer = document.getElementById("playing");
const initContainer = document.getElementById("init");
const blackTrimTop = document.getElementById("black-trim-top") as HTMLElement;
const blackTrimBottom = document.getElementById("black-trim-bottom") as HTMLElement;

if (!whiteOverlay || !blackOverlay) {
  throw new Error("Fade overlay elements not found in the DOM");
}

if (!playingContainer || !initContainer || !loadingWrapper || !textaliveBanner) {
  throw new Error("Playing container not found");
}

if (!blackTrimTop || !blackTrimBottom) {
  throw new Error("Black trim elements not found");
}

// Default heights from the original CSS
const SHUTTER_TOP_DEFAULT_HEIGHT = 60;
const SHUTTER_BOTTOM_DEFAULT_HEIGHT = 100;

blackTrimTop.style.height = `${SHUTTER_TOP_DEFAULT_HEIGHT}px`;
blackTrimBottom.style.height = `${SHUTTER_BOTTOM_DEFAULT_HEIGHT}px`;

// Default fade duration in milliseconds
const FADE_DURATION = 3000;

// White fade in/out functions
export const whiteFadeIn = (duration: number = FADE_DURATION): void => {
  // Remove the 'out' class to make sure it's visible in case CSS is still affecting it
  whiteOverlay.classList.remove('out');
  // Use tween to animate opacity from 0 to 1
  tween(
    { opacity: 0 },
    { opacity: 1 },
    duration,
    (value) => {
      whiteOverlay.style.opacity = value.opacity.toString();
    }
  );
};

export const whiteFadeOut = (duration: number = FADE_DURATION): void => {
  // Use tween to animate opacity from 1 to 0
  tween(
    { opacity: 1 },
    { opacity: 0 },
    duration,
    (value) => {
      whiteOverlay.style.opacity = value.opacity.toString();
      // Add the 'out' class when fully transparent for pointer-events-none
      if (value.opacity === 0) {
        whiteOverlay.classList.add('out');
      }
    }
  );
};

// Black fade in/out functions
export const blackFadeIn = (duration: number = FADE_DURATION): void => {
  // Remove the 'out' class to make sure it's visible in case CSS is still affecting it
  blackOverlay.classList.remove('out');
  // Use tween to animate opacity from 0 to 1
  tween(
    { opacity: 0 },
    { opacity: 1 },
    duration,
    (value) => {
      blackOverlay.style.opacity = value.opacity.toString();
    }
  );
};

export const blackFadeOut = (duration: number = FADE_DURATION): void => {
  // Use tween to animate opacity from 1 to 0
  tween(
    { opacity: 1 },
    { opacity: 0 },
    duration,
    (value) => {
      blackOverlay.style.opacity = value.opacity.toString();
      // Add the 'out' class when fully transparent for pointer-events-none
      if (value.opacity === 0) {
        blackOverlay.classList.add('out');
      }
    }
  );
};

// TextAlive banner fade functions
export const textaliveBannerFadeIn = (duration: number = FADE_DURATION): void => {
  textaliveBanner.classList.remove("out");
  tween(
    { opacity: 0 },
    { opacity: 1 },
    duration,
    (value) => {
      textaliveBanner.style.opacity = value.opacity.toString();
    }
  );
}

export const textaliveBannerFadeOut = (duration: number = FADE_DURATION): void => {
  tween(
    { opacity: 1 },
    { opacity: 0 },
    duration,
    (value) => {
      textaliveBanner.style.opacity = value.opacity.toString();
      if (value.opacity === 0) {
        textaliveBanner.classList.add("out");
      }
    }
  );
}

// Loading wrapper fade functions
export const loadingWrapperFadeIn = (duration: number = FADE_DURATION): void => {
  loadingWrapper.classList.remove("out");
  tween(
    { opacity: 0 },
    { opacity: 1 },
    duration,
    (value) => {
      loadingWrapper.style.opacity = value.opacity.toString();
    }
  );
}

export const loadingWrapperFadeOut = (duration: number = FADE_DURATION): void => {
  tween(
    { opacity: 1 },
    { opacity: 0 },
    duration,
    (value) => {
      loadingWrapper.style.opacity = value.opacity.toString();
      if (value.opacity === 0) {
        loadingWrapper.classList.add("out");
      }
    }
  );
}

// Playing container fade functions
export const playingContainerFadeIn = (duration: number = FADE_DURATION): void => {
  playingContainer.classList.remove("out");
  tween(
    { opacity: 0 },
    { opacity: 1 },
    duration,
    (value) => {
      playingContainer.style.opacity = value.opacity.toString();
    }
  );
}

export const playingContainerFadeOut = (duration: number = FADE_DURATION): void => {
  tween(
    { opacity: 1 },
    { opacity: 0 },
    duration,
    (value) => {
      playingContainer.style.opacity = value.opacity.toString();
      if (value.opacity === 0) {
        playingContainer.classList.add("out");
      }
    }
  );
}

// Init container fade functions
export const initContainerFadeIn = (duration: number = FADE_DURATION): void => {
  initContainer.classList.remove("out");
  tween(
    { opacity: 0 },
    { opacity: 1 },
    duration,
    (value) => {
      initContainer.style.opacity = value.opacity.toString();
    }
  );
}

export const initContainerFadeOut = (duration: number = FADE_DURATION): void => {
  tween(
    { opacity: 1 },
    { opacity: 0 },
    duration,
    (value) => {
      initContainer.style.opacity = value.opacity.toString();
      if (value.opacity === 0) {
        initContainer.classList.add("out");
      }
    }
  );
}
// Shutter-like fade effect functions
export const shutterIn = (duration: number = FADE_DURATION): void => {
  // Get the viewport height
  const viewportHeight = window.innerHeight;
  // Calculate the target height for each trim (half of the viewport)
  const targetHeight = viewportHeight / 2;

  // Get the current heights
  const currentTopHeight = parseInt(getComputedStyle(blackTrimTop).height) || 15;
  const currentBottomHeight = parseInt(getComputedStyle(blackTrimBottom).height) || 25;

  // Animate the top trim height
  tween(
    { height: currentTopHeight },
    { height: targetHeight },
    duration,
    (value) => {
      blackTrimTop.style.height = `${value.height}px`;
    }
  );

  // Animate the bottom trim height
  tween(
    { height: currentBottomHeight },
    { height: targetHeight },
    duration,
    (value) => {
      blackTrimBottom.style.height = `${value.height}px`;
    }
  );
};

export const shutterOut = (duration: number = FADE_DURATION): void => {
  // Get the viewport height
  const viewportHeight = window.innerHeight;

  // Get the current heights
  const currentTopHeight = parseInt(getComputedStyle(blackTrimTop).height) || viewportHeight / 2;
  const currentBottomHeight = parseInt(getComputedStyle(blackTrimBottom).height) || viewportHeight / 2;


  // Animate the top trim height
  tween(
    { height: currentTopHeight },
    { height: SHUTTER_TOP_DEFAULT_HEIGHT },
    duration,
    (value) => {
      blackTrimTop.style.height = `${value.height}px`;
    }
  );

  // Animate the bottom trim height
  tween(
    { height: currentBottomHeight },
    { height: SHUTTER_BOTTOM_DEFAULT_HEIGHT },
    duration,
    (value) => {
      blackTrimBottom.style.height = `${value.height}px`;
    }
  );
};
