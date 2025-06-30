// Fade effects
import { tween } from "~/lib/update/tween.ts";

// Get overlay elements from the DOM
const whiteOverlay = document.getElementById('white-overlay') as HTMLElement;
const blackOverlay = document.getElementById('black-overlay') as HTMLElement;
const customColorOverlay = document.getElementById('custom-color-overlay') as HTMLElement;
const textaliveBanner = document.getElementsByClassName("textalive-banner")[0] as HTMLElement;
const loadingWrapper = document.getElementById("loading-wrapper");
const playingContainer = document.getElementById("playing");
const initContainer = document.getElementById("init");
const creditContainer = document.getElementById("credit");
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

// White fade in/out functions
export const whiteFadeIn = (duration: number = FADE_DURATION) => {
  whiteOverlay.classList.remove('hidden');
  return tween(0, 1, duration, (x) => {
    whiteOverlay.style.opacity = x.toString();
  });
};

export const whiteFadeOut = (duration: number = FADE_DURATION) => {
  return tween(1, 0, duration, (x) => {
    whiteOverlay.style.opacity = x.toString();
  }, {onComplete: () => {
    whiteOverlay.classList.add('hidden');
  }});
};

export const setWhiteBlur = (pixel: number): void => {
    whiteOverlay.style.filter = `blur(${pixel}px)`;
}

// Black fade in/out functions
export const blackFadeIn = (duration: number = FADE_DURATION) => {
  blackOverlay.classList.remove('hidden');
  return tween(0, 1, duration, (x) => {
    blackOverlay.style.opacity = x.toString();
  });
};

export const blackFadeOut = (duration: number = FADE_DURATION) => {
  return tween(1, 0, duration, (x) => {
    blackOverlay.style.opacity = x.toString();
  }, {onComplete: () => {
    blackOverlay.classList.add('hidden');
  }});
};

// TextAlive banner fade functions
export const textaliveBannerFadeIn = (duration: number = FADE_DURATION) => {
  textaliveBanner.classList.remove('hidden');
  return tween(0, 1, duration, (x) => {
    textaliveBanner.style.opacity = x.toString();
  });
}

export const textaliveBannerFadeOut = (duration: number = FADE_DURATION) => {
  return tween(1, 0, duration, (x) => {
    textaliveBanner.style.opacity = x.toString();
  }, {onComplete: () => {
    textaliveBanner.classList.add('hidden');
  }});
}

// Loading wrapper fade functions
export const loadingWrapperFadeIn = (duration: number = FADE_DURATION) => {
  loadingWrapper.classList.remove('hidden');
  return tween(0, 1, duration, (x) => {
    loadingWrapper.style.opacity = x.toString();
  });
}

export const loadingWrapperFadeOut = (duration: number = FADE_DURATION) => {
  return tween(1, 0, duration, (x) => {
    loadingWrapper.style.opacity = x.toString();
  }, {onComplete: () => {
    loadingWrapper.classList.add('hidden');
  }});
}

// Playing container fade functions
export const playingContainerFadeIn = (duration: number = FADE_DURATION) => {
  playingContainer.classList.remove('hidden');
  return tween(0, 1, duration, (x) => {
    playingContainer.style.opacity = x.toString();
  });
}

export const playingContainerFadeOut = (duration: number = FADE_DURATION) => {
  return tween(1, 0, duration, (x) => {
    playingContainer.style.opacity = x.toString();
  }, {onComplete: () => {
    playingContainer.classList.add('hidden');
  }});
}

// Init container fade functions
export const initContainerFadeIn = (duration: number = FADE_DURATION) => {
  initContainer.classList.remove('hidden');
  return tween(0, 1, duration, (x) => {
    initContainer.style.opacity = x.toString();
  });
}

export const initContainerFadeOut = (duration: number = FADE_DURATION) => {
  return tween(1, 0, duration, (x) => {
    initContainer.style.opacity = x.toString();
  }, {onComplete: () => {
    initContainer.classList.add('hidden');
  }});
}

// Credit container fade functions
export const creditContainerFadeOut = (duration: number = FADE_DURATION) => {
  return tween(1, 0, duration, (x) => {
    creditContainer.style.opacity = x.toString();
  }, {onComplete: () => {
    creditContainer.classList.add('hidden');
  }});
}

export const creditContainerFadeIn = (duration: number = FADE_DURATION) => {
  creditContainer.classList.remove('hidden');
  return tween(0, 1, duration, (x) => {
    creditContainer.style.opacity = x.toString();
  });
}


// Shutter-like fade effect functions
export const shutterIn = (duration: number = FADE_DURATION) => {
  // Get the viewport height
  const viewportHeight = window.innerHeight;
  // Calculate the target height for each trim (half of the viewport)
  const targetHeight = viewportHeight / 2;

  // Get the current heights
  const currentTopHeight = parseInt(getComputedStyle(blackTrimTop).height) || 15;
  const currentBottomHeight = parseInt(getComputedStyle(blackTrimBottom).height) || 25;

  // Animate the top trim height
  const topTween = tween(
    { height: currentTopHeight },
    { height: targetHeight },
    duration,
    (value) => {
      blackTrimTop.style.height = `${value.height}px`;
    }
  );

  // Animate the bottom trim height
  const bottomTween = tween(
    { height: currentBottomHeight },
    { height: targetHeight },
    duration,
    (value) => {
      blackTrimBottom.style.height = `${value.height}px`;
    }
  );

  // Return a promise that resolves when both tweens complete
  return {
    promise: Promise.all([topTween.promise, bottomTween.promise]).then(() => {}),
    cancel: () => {
      topTween.cancel();
      bottomTween.cancel();
    },
    complete: () => {
      topTween.complete();
      bottomTween.complete();
    }
  };
};

export const shutterOut = (duration: number = FADE_DURATION) => {
  // Get the viewport height
  const viewportHeight = window.innerHeight;

  // Get the current heights
  const currentTopHeight = parseInt(getComputedStyle(blackTrimTop).height) || viewportHeight / 2;
  const currentBottomHeight = parseInt(getComputedStyle(blackTrimBottom).height) || viewportHeight / 2;

  // Animate the top trim height
  const topTween = tween(
    { height: currentTopHeight },
    { height: SHUTTER_TOP_DEFAULT_HEIGHT },
    duration,
    (value) => {
      blackTrimTop.style.height = `${value.height}px`;
    }
  );

  // Animate the bottom trim height
  const bottomTween = tween(
    { height: currentBottomHeight },
    { height: SHUTTER_BOTTOM_DEFAULT_HEIGHT },
    duration,
    (value) => {
      blackTrimBottom.style.height = `${value.height}px`;
    }
  );

  // Return a promise that resolves when both tweens complete
  return {
    promise: Promise.all([topTween.promise, bottomTween.promise]).then(() => {}),
    cancel: () => {
      topTween.cancel();
      bottomTween.cancel();
    },
    complete: () => {
      topTween.complete();
      bottomTween.complete();
    }
  };
};

// Shutter fade effect functions (combining shutter and fade)
export const shutterFadeIn = (duration: number = FADE_DURATION) => {
  // Remove the 'hidden' class to make sure it's visible
  blackOverlay.classList.remove('hidden');

  // Start with the shutter at default position and black overlay transparent
  blackTrimTop.style.height = `${SHUTTER_TOP_DEFAULT_HEIGHT}px`;
  blackTrimBottom.style.height = `${SHUTTER_BOTTOM_DEFAULT_HEIGHT}px`;
  blackOverlay.style.opacity = '0';

  // Get the viewport height
  const viewportHeight = window.innerHeight;
  // Calculate the target height for each trim (half of the viewport)
  const targetHeight = viewportHeight / 2;

  // Get the current heights
  const currentTopHeight = parseInt(getComputedStyle(blackTrimTop).height) || SHUTTER_TOP_DEFAULT_HEIGHT;
  const currentBottomHeight = parseInt(getComputedStyle(blackTrimBottom).height) || SHUTTER_BOTTOM_DEFAULT_HEIGHT;

  // Animate the top trim height
  const topTween = tween(
    { height: currentTopHeight },
    { height: targetHeight },
    duration,
    (value) => {
      blackTrimTop.style.height = `${value.height}px`;
    }
  );

  // Animate the bottom trim height
  const bottomTween = tween(currentBottomHeight,
    targetHeight,
    duration,
    (value) => {
      blackTrimBottom.style.height = `${value}px`;
    }
  );

  // Animate the black overlay opacity
  const fadeTween = tween(
    { opacity: 0 },
    { opacity: 1 },
    duration,
    (value) => {
      blackOverlay.style.opacity = value.opacity.toString();
    }
  );

  // Return a promise that resolves when all tweens complete
  return {
    promise: Promise.all([topTween.promise, bottomTween.promise, fadeTween.promise]).then(() => {}),
    cancel: () => {
      topTween.cancel();
      bottomTween.cancel();
      fadeTween.cancel();
    },
    complete: () => {
      topTween.complete();
      bottomTween.complete();
      fadeTween.complete();
    }
  };
};

export const shutterFadeOut = (duration: number = FADE_DURATION) => {
  return tween(1, 0, duration, (x) => {
      blackTrim.style.opacity = x.toString();
  }, {onComplete: () => {
      blackTrim.classList.add('hidden');
  }});
};

// Custom color fade functions
export const setCustomColor = (color: string): void => {
  customColorOverlay.style.backgroundColor = color;
};

export const customColorFadeIn = (duration: number = FADE_DURATION) => {
  customColorOverlay.classList.remove('hidden');
  return tween(0, 1, duration, (x) => {
    customColorOverlay.style.opacity = x.toString();
  });
};

export const customColorFadeOut = (duration: number = FADE_DURATION) => {
  return tween(1, 0, duration, (x) => {
    customColorOverlay.style.opacity = x.toString();
  }, {onComplete: () => {
    customColorOverlay.classList.add('hidden');
  }});
};

// Never end text fade functions
export const neverEndTextFadeIn = (duration: number = FADE_DURATION) => {
  neverEndText.classList.remove('hidden');
  return tween(0, 1, duration, (x) => {
    neverEndText.style.opacity = x.toString();
  });
};

export const neverEndTextFadeOut = (duration: number = FADE_DURATION) => {
  return tween(1, 0, duration, (x) => {
    neverEndText.style.opacity = x.toString();
  }, {onComplete: () => {
    neverEndText.classList.add('hidden');
  }});
};
