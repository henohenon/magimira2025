const textaliveBanner = document.getElementsByClassName("textalive-banner")[0] as HTMLElement;
const loadingWrapper = document.getElementById("loading-wrapper");
const playingContainer = document.getElementById("playing");
const initContainer = document.getElementById("init");
if (!playingContainer || !initContainer || !loadingWrapper || !textaliveBanner) {
    throw new Error("Playing container not found");
}

textaliveBanner.classList.add("fade");
export const textaliveBannerFadeIn = () => {
    textaliveBanner.classList.remove("out");
}
export const textaliveBannerFadeOut = () => {
    textaliveBanner.classList.add("out");
}
export const loadingWrapperFadeIn = () => {
    loadingWrapper.classList.remove("out");
}
export const loadingWrapperFadeOut = () => {
    loadingWrapper.classList.add("out");
}
export const playingContainerFadeIn = () => {
    playingContainer.classList.remove("out");
}
export const playingContainerFadeOut = () => {
    playingContainer.classList.add("out");
}
export const initContainerFadeIn = () => {
    initContainer.classList.remove("out");
}
export const initContainerFadeOut = () => {
    initContainer.classList.add("out");
}