import "./dom/bottom-lyrics.ts";

import {drawFrequencySpectrum} from "./spectrum";
import {drawRipples} from "./ripple";
import {drawGlitchEffects, addGlitchEffect} from "./glitch";

// グリッチエフェクト関数を再エクスポート
export {addGlitchEffect, clearGlitchEffects, getActiveGlitchCount} from "./glitch";

const canvas = document.getElementById('effects-canvas') as HTMLCanvasElement;
if (!canvas) {
    console.error("Canvas not found!");
    throw new Error("Canvas not found");
}
console.log("Canvas found:", canvas);
const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
console.log("Canvas context:", canvasContext);
console.log("Canvas size:", canvas.width, canvas.height);

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    console.log("Canvas resized to:", canvas.width, canvas.height);
    
    // キャンバスの状態をリセット
    canvasContext.globalCompositeOperation = 'source-over';
    canvasContext.globalAlpha = 1.0;
    canvasContext.setTransform(1, 0, 0, 1, 0, 0);    // テスト用のグリッチエフェクトを自動生成
    setTimeout(() => {
        console.log("メビトンフューチャーズ・グリッチエフェクトを生成中...");
        addGlitchEffect(50, 50, 300, 200, 30, 0.8, 'mebiton'); // メビトンフューチャーズタイプで30秒間持続
        console.log("メビトンフューチャーズ・エフェクト生成完了！");
    }, 1000);
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

export const updateEffects = (deltaTime: number) => {
    // 最初の数回だけログ出力
    if (Math.random() < 0.01) { // 1%の確率でログ
        console.log("updateEffects called, deltaTime:", deltaTime);
    }
    
    // キャンバス状態を保存
    canvasContext.save();
    
    try {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        
        // デバッグ用: キャンバスが動作していることを確認する背景
        canvasContext.fillStyle = 'rgba(0, 255, 0, 0.02)';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        
        drawFrequencySpectrum(canvasContext, deltaTime);
        drawRipples(canvasContext, deltaTime);
        drawGlitchEffects(canvasContext, deltaTime);
    } catch (error) {
        console.warn('エフェクト描画エラー:', error);
    } finally {
        // キャンバス状態を復元
        canvasContext.restore();
    }
}
