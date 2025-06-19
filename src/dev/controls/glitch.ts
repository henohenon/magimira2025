import {addGlitchEffect, clearGlitchEffects, getActiveGlitchCount} from "~/effects/glitch";

// UI要素の取得
const glitchDemoButton = document.getElementById('glitch-demo-button');
const glitchClearButton = document.getElementById('glitch-clear-button');
const glitchCountElement = document.getElementById('glitch-count');

// 手動生成用の要素
const glitchManualGenerateButton = document.getElementById('glitch-manual-generate-button');
const glitchPositionInput = document.getElementById('glitch-position-input') as any;
const glitchSizeInput = document.getElementById('glitch-size-input') as any;
const glitchLifetimeInput = document.getElementById('glitch-lifetime-input') as any;
const glitchDensityInput = document.getElementById('glitch-density-input') as any;
const glitchTypeSelect = document.getElementById('glitch-type-select') as HTMLSelectElement;

// プリセットボタン
const glitchPresetWeak = document.getElementById('glitch-preset-weak');
const glitchPresetStrong = document.getElementById('glitch-preset-strong');
const glitchPresetCenter = document.getElementById('glitch-preset-center');
const glitchPresetRandom = document.getElementById('glitch-preset-random');


// デモグリッチエフェクトを追加
glitchDemoButton?.addEventListener('click', () => {
    console.log('デモボタンがクリックされました');
    const x = 100; // 固定位置でテスト
    const y = 100;
    const width = 200;
    const height = 100;
    const lifeTime = 5; // 長めに設定
    const density = 0.8; // 高密度

    console.log(`デモエフェクト生成: x=${x}, y=${y}, size=${width}x${height}`);
    addGlitchEffect(x, y, width, height, lifeTime, density);
    updateGlitchCount();
    console.log(`現在のアクティブ数: ${getActiveGlitchCount()}`);
});

// 手動生成
glitchManualGenerateButton?.addEventListener('click', () => {    console.log('手動生成ボタンがクリックされました');
    const x = parseFloat(glitchPositionInput?.valueX || '100');
    const y = parseFloat(glitchPositionInput?.valueY || '100');
    const width = parseFloat(glitchSizeInput?.valueX || '200');
    const height = parseFloat(glitchSizeInput?.valueY || '100');
    const lifeTime = parseFloat(glitchLifetimeInput?.value || '8');
    const density = parseFloat(glitchDensityInput?.value || '0.5');
    const type = glitchTypeSelect?.value || 'digital';

    console.log(`手動エフェクト生成: x=${x}, y=${y}, size=${width}x${height}, life=${lifeTime}, density=${density}, type=${type}`);
    addGlitchEffect(x, y, width, height, lifeTime, density, type as 'classic' | 'pixelated' | 'chromatic' | 'digital' | 'mebiton');
    updateGlitchCount();
    console.log(`現在のアクティブ数: ${getActiveGlitchCount()}`);
});

// プリセット: 弱いグリッチ
glitchPresetWeak?.addEventListener('click', () => {
    const x = Math.random() * (window.innerWidth - 150);
    const y = Math.random() * (window.innerHeight - 80);
    addGlitchEffect(x, y, 150, 80, 4, 0.2, 'classic');
    updateGlitchCount();
});

// プリセット: 強いグリッチ
glitchPresetStrong?.addEventListener('click', () => {
    const x = Math.random() * (window.innerWidth - 300);
    const y = Math.random() * (window.innerHeight - 200);
    addGlitchEffect(x, y, 300, 200, 8, 0.9, 'mebiton'); // メビトンフューチャーズ使用
    updateGlitchCount();
});

// プリセット: 中央グリッチ
glitchPresetCenter?.addEventListener('click', () => {
    const centerX = window.innerWidth / 2 - 100;
    const centerY = window.innerHeight / 2 - 75;
    addGlitchEffect(centerX, centerY, 200, 150, 5, 0.6, 'chromatic');
    updateGlitchCount();
});

// プリセット: ランダム大量生成
glitchPresetRandom?.addEventListener('click', () => {
    const count = 3 + Math.floor(Math.random() * 3); // 3-5個
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const x = Math.random() * (window.innerWidth - 100);
            const y = Math.random() * (window.innerHeight - 80);
            const width = 50 + Math.random() * 150;
            const height = 30 + Math.random() * 100;
            const lifeTime = 1 + Math.random() * 3;
            const density = Math.random();

            addGlitchEffect(x, y, width, height, lifeTime, density);
            updateGlitchCount();
        }, i * 200); // 200ms間隔で生成
    }
});

// すべてのグリッチエフェクトをクリア
glitchClearButton?.addEventListener('click', () => {
    clearGlitchEffects();
    updateGlitchCount();
});

// グリッチエフェクト数を更新
function updateGlitchCount() {
    if (glitchCountElement) {
        glitchCountElement.textContent = getActiveGlitchCount().toString();
    }
}

// 定期的にカウントを更新
setInterval(updateGlitchCount, 1000);




// 緊急時の全クリア機能（ESCキー）
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearGlitchEffects();
        updateGlitchCount();
        console.log('ESCキーでグリッチエフェクトを緊急停止しました');
    }
});
