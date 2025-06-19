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

// 自動生成用の要素
const glitchAutoEnable = document.getElementById('glitch-auto-enable') as any;
const glitchAutoInterval = document.getElementById('glitch-auto-interval') as any;
const glitchAutoProbability = document.getElementById('glitch-auto-probability') as any;
const glitchBurstButton = document.getElementById('glitch-burst-button');
const glitchStormButton = document.getElementById('glitch-storm-button');

// 自動生成の状態管理
let autoGenerationInterval: number | null = null;

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

// グリッチエフェクトをグローバル関数として公開（コンソールでテスト用）
window.testGlitch = () => {
    addGlitchEffect(100, 100, 300, 200, 5, 0.8);
};

// 画面クリック時にグリッチエフェクトを生成（オプション機能）
window.enableClickGlitch = () => {
    document.addEventListener('click', (e) => {
        if (e.target && (e.target as HTMLElement).closest('.dev-controls')) {
            return; // コントロールパネル内のクリックは無視
        }
        
        const x = e.clientX - 50;
        const y = e.clientY - 25;
        addGlitchEffect(x, y, 100, 50, 1.5, 0.4);
        updateGlitchCount();
    });
    console.log('クリックでグリッチエフェクトが有効になりました');
};

// 自動生成の切り替え
glitchAutoEnable?.addEventListener('change', (e: any) => {
    if (e.target.checked) {
        startAutoGeneration();
    } else {
        stopAutoGeneration();
    }
});

// 自動生成開始
function startAutoGeneration() {
    if (autoGenerationInterval) return; // 既に実行中の場合は何もしない
    
    const interval = Math.max(2000, parseFloat(glitchAutoInterval?.value || '3') * 1000); // 最小2秒間隔
    
    autoGenerationInterval = window.setInterval(() => {
        const probability = Math.min(0.3, parseFloat(glitchAutoProbability?.value || '0.3')); // 最大30%に制限
        
        // アクティブなグリッチが多すぎる場合は生成を控える
        if (getActiveGlitchCount() > 3) { // 制限をさらに厳しく
            return;
        }
        
        if (Math.random() < probability) {
            // 画面の中央付近の安全な範囲に限定
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const maxDistance = Math.min(200, Math.min(window.innerWidth, window.innerHeight) / 4);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * maxDistance;
            
            const x = centerX + Math.cos(angle) * distance - 25;
            const y = centerY + Math.sin(angle) * distance - 15;
            
            // 非常に小さなエフェクト
            const width = 20 + Math.random() * 30;
            const height = 10 + Math.random() * 20;
            const lifeTime = 0.3 + Math.random() * 0.7; // 非常に短い
            const density = 0.05 + Math.random() * 0.1; // 非常に低密度
            
            addGlitchEffect(x, y, width, height, lifeTime, density);
            updateGlitchCount();
        }
    }, interval);
    
    console.log('グリッチ自動生成を開始しました（超安全モード）');
}

// 自動生成停止
function stopAutoGeneration() {
    if (autoGenerationInterval) {
        clearInterval(autoGenerationInterval);
        autoGenerationInterval = null;
        console.log('グリッチ自動生成を停止しました');
    }
}

// バースト効果（短時間で複数生成）
glitchBurstButton?.addEventListener('click', () => {
    const count = 5 + Math.floor(Math.random() * 5); // 5-9個
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const angle = (i / count) * Math.PI * 2;
            const radius = 100 + Math.random() * 150;
            
            const x = centerX + Math.cos(angle) * radius - 75;
            const y = centerY + Math.sin(angle) * radius - 50;
            
            addGlitchEffect(x, y, 150, 100, 2, 0.6 + Math.random() * 0.3);
            updateGlitchCount();
        }, i * 100); // 100ms間隔
    }
});

// ストーム効果（画面全体に大量生成）
glitchStormButton?.addEventListener('click', () => {
    const count = 15 + Math.floor(Math.random() * 10); // 15-24個
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const x = Math.random() * (window.innerWidth - 80);
            const y = Math.random() * (window.innerHeight - 60);
            const width = 30 + Math.random() * 100;
            const height = 20 + Math.random() * 80;
            const lifeTime = 0.5 + Math.random() * 1.5;
            const density = 0.8 + Math.random() * 0.2;
            
            addGlitchEffect(x, y, width, height, lifeTime, density);
            updateGlitchCount();
        }, i * 50); // 50ms間隔
    }
});

// 緊急時の全クリア機能（ESCキー）
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearGlitchEffects();
        stopAutoGeneration();
        if (glitchAutoEnable) {
            glitchAutoEnable.checked = false;
        }
        updateGlitchCount();
        console.log('ESCキーでグリッチエフェクトを緊急停止しました');
    }
});

declare global {
    interface Window {
        testGlitch: () => void;
        enableClickGlitch: () => void;
    }
}
