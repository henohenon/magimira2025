import { player } from "./";


const seekBar = document.querySelector("#seekBar") as HTMLDivElement;
if (!seekBar) {
    throw new Error("SeekBar not found");
}
seekBar.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    if (player) {
        player.requestMediaSeek(
            (player.video.duration * e.offsetX) / seekBar.clientWidth,
        );
    }
});

const paintedSeekBar = seekBar.querySelector("div") as HTMLDivElement;
if (!paintedSeekBar) {
    throw new Error("Painted seekBar not found");
}

export function updatePosition(position: number) {
    // よくわからんけど公式に書いてあったのでこの割合
    const rate =
			Math.floor(((position * 1000) / player.video.duration) * 10) / 100;
    paintedSeekBar.style.width = `${rate}%`;
}