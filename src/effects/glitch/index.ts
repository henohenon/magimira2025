import {clamp} from "~/util.ts";

interface GlitchParticle {
    x: number;
    y: number;
    size: number;
    color: string;
    velocity: { x: number; y: number };
    life: number;
}

interface GlitchEffect {
    x: number;
    y: number;
    width: number;
    height: number;
    lifeTime: number;
    maxLifeTime: number;
    density: number;
    glitchLines: GlitchLine[];
    colorShift: ColorShift;
    type: 'classic' | 'pixelated' | 'chromatic' | 'digital' | 'mebiton';
    particles: GlitchParticle[];
}

interface GlitchLine {
    y: number;
    offsetX: number;
    width: number;
    intensity: number;
}

interface ColorShift {
    r: number;
    g: number;
    b: number;
}

let glitchEffects: GlitchEffect[] = [];
const MAX_GLITCH_EFFECTS = 12; // 最大同時グリッチ数を制限

/**
 * グリッチエフェクトを追加する
 * @param x X座標
 * @param y Y座標  
 * @param width 幅
 * @param height 高さ
 * @param lifeTime 持続時間（秒）
 * @param density 密度（0.0-1.0、高いほどグリッチが激しい）
 * @param type グリッチの種類
 */
export function addGlitchEffect(
    x: number,
    y: number,
    width: number,
    height: number,
    lifeTime: number,
    density: number = 0.5,
    type: 'classic' | 'pixelated' | 'chromatic' | 'digital' | 'mebiton' = 'mebiton'
): void {
    // 最大数に達している場合は古いエフェクトを削除
    if (glitchEffects.length >= MAX_GLITCH_EFFECTS) {
        glitchEffects.shift(); // 最古のエフェクトを削除
    }
      const glitchEffect: GlitchEffect = {
        x,
        y,
        width,
        height,
        lifeTime,
        maxLifeTime: lifeTime,
        density: clamp(density, 0, 1),
        glitchLines: [],
        colorShift: {
            r: (Math.random() - 0.5) * 20,
            g: (Math.random() - 0.5) * 20,
            b: (Math.random() - 0.5) * 20
        },
        type: type,
        particles: []
    };    // グリッチラインとパーティクルを生成
    generateGlitchLines(glitchEffect);
    generateGlitchParticles(glitchEffect);
    
    glitchEffects.push(glitchEffect);
    
    // デバッグログ
    console.log(`グリッチエフェクト追加: x=${x}, y=${y}, size=${width}x${height}, life=${lifeTime}, density=${density}, type=${type}, lines=${glitchEffect.glitchLines.length}, particles=${glitchEffect.particles.length}, total=${glitchEffects.length}`);
}

/**
 * グリッチラインを生成する
 */
function generateGlitchLines(effect: GlitchEffect): void {
    effect.glitchLines = [];
    const lineCount = clamp(Math.floor(effect.height * effect.density * 0.1) + 1, 1, 5); // 最低1本は生成
    
    console.log(`グリッチライン生成: ${lineCount}本, height=${effect.height}, density=${effect.density}`);
    
    for (let i = 0; i < lineCount; i++) {
        effect.glitchLines.push({
            y: effect.y + (i / lineCount) * effect.height + Math.random() * (effect.height / lineCount), // 均等分散
            offsetX: (Math.random() - 0.5) * effect.width * 0.2,
            width: effect.width * (0.3 + Math.random() * 0.5),
            intensity: 0.5 + Math.random() * 0.5 // 強度を上げる
        });
    }
    
    console.log(`生成されたライン:`, effect.glitchLines);
}

/**
 * グリッチパーティクルを生成する
 */
function generateGlitchParticles(effect: GlitchEffect): void {
    effect.particles = [];
    const particleCount = Math.floor(effect.width * effect.height * effect.density * 0.0005); // 密度を少し上げる
    
    // メビトンフューチャーズ風のパステル & ネオンカラー
    const colors = [
        '#ff69b4', '#00ffff', '#ff1493', '#00ff00', '#ffb6c1', '#87ceeb',
        '#ffd700', '#ff6347', '#98fb98', '#dda0dd', '#f0e68c', '#ffa07a',
        '#e6e6fa', '#ffe4e1', '#f5deb3', '#d8bfd8', '#afeeee', '#ffefd5',
        '#ff00ff', '#00bfff', '#adff2f', '#ff4500', '#da70d6', '#40e0d0'
    ];
    
    for (let i = 0; i < particleCount; i++) {
        effect.particles.push({
            x: effect.x + Math.random() * effect.width,
            y: effect.y + Math.random() * effect.height,
            size: 1 + Math.random() * 5, // 少し大きめに
            color: colors[Math.floor(Math.random() * colors.length)],
            velocity: {
                x: (Math.random() - 0.5) * 1.5, // 少し遅めに
                y: (Math.random() - 0.5) * 1.5
            },
            life: 0.8 + Math.random() * 0.4 // 長めの寿命
        });
    }
    
    console.log(`メビトンフューチャーズ・パーティクル生成: ${particleCount}個`);
}

/**
 * グリッチエフェクトを描画する
 */
export function drawGlitchEffects(ctx: CanvasRenderingContext2D, deltaTime: number): void {
    
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    // キャンバス状態を完全に保存
    ctx.save();

    glitchEffects = glitchEffects.filter(effect => {
        // deltaTimeをミリ秒から秒に変換
        effect.lifeTime -= deltaTime / 1000;

        if (effect.lifeTime <= 0) {
            console.log('グリッチエフェクトが期限切れで削除されました');
            return false; // エフェクトを削除
        }

        // エフェクトが画面外にある場合はスキップ
        if (effect.x < -effect.width || effect.x > canvasWidth ||
            effect.y < -effect.height || effect.y > canvasHeight) {
            console.log('グリッチエフェクトが画面外のため削除されました');
            return false;
        }
          // 時間経過とともにランダムにグリッチラインを更新
        if (Math.random() < 0.3) { // 更新頻度を上げる
            generateGlitchLines(effect);
        }

        // パーティクルを更新
        updateGlitchParticles(effect, deltaTime / 1000);

        // エフェクトタイプに基づいて描画
        drawGlitchEffectByType(ctx, effect);
        return true;
    });

    ctx.restore();
}

/**
 * すべてのグリッチエフェクトをクリア
 */
export function clearGlitchEffects(): void {
    glitchEffects = [];
}

/**
 * アクティブなグリッチエフェクトの数を取得
 */
export function getActiveGlitchCount(): number {
    return glitchEffects.length;
}

/**
 * パーティクルを更新する
 */
function updateGlitchParticles(effect: GlitchEffect, deltaTime: number): void {
    effect.particles = effect.particles.filter(particle => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.life -= deltaTime * 2; // 2秒で消える
        
        // 境界内に保つ
        if (particle.x < effect.x || particle.x > effect.x + effect.width ||
            particle.y < effect.y || particle.y > effect.y + effect.height) {
            particle.life = 0;
        }
        
        return particle.life > 0;
    });
    
    // 新しいパーティクルを追加
    if (Math.random() < 0.1) {
        const colors = ['#ff0080', '#00ff80', '#8000ff', '#ff8000', '#0080ff', '#ffffff'];
        effect.particles.push({
            x: effect.x + Math.random() * effect.width,
            y: effect.y + Math.random() * effect.height,
            size: 1 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocity: {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3
            },
            life: 1
        });
    }
}

/**
 * エフェクトタイプに基づいて描画する
 */
function drawGlitchEffectByType(ctx: CanvasRenderingContext2D, effect: GlitchEffect): void {
    ctx.save();
    
    try {
        // 描画領域を制限
        ctx.beginPath();
        ctx.rect(
            Math.max(0, Math.floor(effect.x)), 
            Math.max(0, Math.floor(effect.y)), 
            Math.min(Math.floor(effect.width), ctx.canvas.width - Math.floor(effect.x)), 
            Math.min(Math.floor(effect.height), ctx.canvas.height - Math.floor(effect.y))
        );
        ctx.clip();
          switch (effect.type) {
            case 'mebiton':
                drawMebitonFuturesGlitch(ctx, effect);
                break;
            case 'digital':
                drawDigitalGlitch(ctx, effect);
                break;
            case 'pixelated':
                drawPixelatedGlitch(ctx, effect);
                break;
            case 'chromatic':
                drawChromaticGlitch(ctx, effect);
                break;
            default:
                drawClassicGlitch(ctx, effect);
        }
        
    } catch (error) {
        console.warn('グリッチ描画エラー:', error);
    } finally {
        ctx.restore();
    }
}

/**
 * メビトンフューチャーズ専用グリッチエフェクト（最高級）
 */
function drawMebitonFuturesGlitch(ctx: CanvasRenderingContext2D, effect: GlitchEffect): void {
    const alpha = Math.min(0.95, effect.lifeTime / effect.maxLifeTime);
    const time = (effect.maxLifeTime - effect.lifeTime) * 1000;
    
    // 虹色グラデーション背景
    const gradient = ctx.createLinearGradient(effect.x, effect.y, effect.x + effect.width, effect.y + effect.height);
    const hueShift = (time * 0.1) % 360;
    gradient.addColorStop(0, `hsla(${hueShift}, 80%, 70%, ${alpha * 0.3})`);
    gradient.addColorStop(0.5, `hsla(${(hueShift + 120) % 360}, 80%, 70%, ${alpha * 0.2})`);
    gradient.addColorStop(1, `hsla(${(hueShift + 240) % 360}, 80%, 70%, ${alpha * 0.3})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(effect.x, effect.y, effect.width, effect.height);
    
    // ハート型パーティクル（メビちゃん要素）
    const heartCount = Math.floor(effect.width * effect.height * 0.00003);
    for (let i = 0; i < heartCount; i++) {
        const heartX = effect.x + Math.random() * effect.width;
        const heartY = effect.y + Math.random() * effect.height;
        const heartSize = 3 + Math.random() * 4;
        const heartAlpha = Math.sin(time * 0.008 + i * 0.5) * 0.3 + 0.7;
        
        ctx.fillStyle = `hsla(${(320 + Math.random() * 40)}, 80%, 75%, ${heartAlpha * alpha})`;
        drawHeart(ctx, heartX, heartY, heartSize);
    }
    
    // レインボーピクセル
    const pixelSize = 2.5 + Math.sin(time * 0.002) * 0.5;
    for (let x = effect.x; x < effect.x + effect.width; x += pixelSize * 2) {
        for (let y = effect.y; y < effect.y + effect.height; y += pixelSize * 2) {
            if (Math.random() < effect.density * 0.4) {
                const pixelHue = (Math.random() * 360 + time * 0.05) % 360;
                const brightness = 60 + Math.random() * 40;
                
                ctx.fillStyle = `hsla(${pixelHue}, 85%, ${brightness}%, ${alpha * 0.9})`;
                ctx.fillRect(x, y, Math.ceil(pixelSize), Math.ceil(pixelSize));
                
                // キラキラ効果
                if (Math.random() < 0.1) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
                    ctx.fillRect(x - 0.5, y - 0.5, pixelSize + 1, pixelSize + 1);
                }
            }
        }
    }
    
    // 流れるようなライン
    effect.glitchLines.forEach((line, index) => {
        const lineAlpha = alpha * line.intensity;
        const waveOffset = Math.sin(time * 0.01 + index * 0.5) * 8;
        const colorShift = (time * 0.02 + index * 60) % 360;
        
        // メイングラデーションライン
        const lineGradient = ctx.createLinearGradient(
            effect.x + line.offsetX, line.y,
            effect.x + line.offsetX + line.width, line.y
        );
        lineGradient.addColorStop(0, `hsla(${colorShift}, 90%, 80%, ${lineAlpha})`);
        lineGradient.addColorStop(0.5, `hsla(${(colorShift + 60) % 360}, 90%, 80%, ${lineAlpha * 1.2})`);
        lineGradient.addColorStop(1, `hsla(${(colorShift + 120) % 360}, 90%, 80%, ${lineAlpha})`);
        
        ctx.fillStyle = lineGradient;
        ctx.fillRect(
            Math.floor(effect.x + line.offsetX + waveOffset),
            Math.floor(line.y),
            Math.floor(line.width),
            5
        );
    });
    
    // 動くパーティクル（星型とダイヤ型）
    effect.particles.forEach((particle, index) => {
        const floatX = Math.sin(time * 0.001 + index * 0.1) * 3;
        const floatY = Math.cos(time * 0.0015 + index * 0.15) * 2;
        const pulseSize = particle.size + Math.sin(time * 0.004 + index * 0.3);
        
        // ダイヤ型パーティクル
        ctx.fillStyle = particle.color + Math.floor(particle.life * 220).toString(16).padStart(2, '0');
        drawDiamond(ctx, particle.x + floatX, particle.y + floatY, pulseSize);
        
        // 後光効果
        const glowSize = pulseSize * 2;
        const glowAlpha = particle.life * 0.2;
        ctx.fillStyle = `rgba(255, 255, 255, ${glowAlpha})`;
        drawDiamond(ctx, particle.x + floatX, particle.y + floatY, glowSize);
    });
}

/**
 * ハート型を描画する
 */
function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 16, size / 16);
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(-3, -2, -8, -2, -8, 3);
    ctx.bezierCurveTo(-8, 7, 0, 15, 0, 15);
    ctx.bezierCurveTo(0, 15, 8, 7, 8, 3);
    ctx.bezierCurveTo(8, -2, 3, -2, 0, 3);
    ctx.fill();
    ctx.restore();
}

/**
 * ダイヤ型を描画する
 */
function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
function drawDigitalGlitch(ctx: CanvasRenderingContext2D, effect: GlitchEffect): void {
    const alpha = Math.min(0.9, effect.lifeTime / effect.maxLifeTime);
    const time = (effect.maxLifeTime - effect.lifeTime) * 1000; // アニメーション用の時間
    
    // 背景のピクセル化されたノイズ（虹色グラデーション）
    const pixelSize = 2 + Math.sin(time * 0.001); // アニメーションするピクセルサイズ
    for (let x = effect.x; x < effect.x + effect.width; x += pixelSize) {
        for (let y = effect.y; y < effect.y + effect.height; y += pixelSize) {
            if (Math.random() < effect.density * 0.35) {
                // HSL色空間で虹色を生成
                const hue = (Math.random() * 360 + time * 0.1) % 360;
                const saturation = 70 + Math.random() * 30; // 70-100%
                const lightness = 60 + Math.random() * 30;  // 60-90%
                
                ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.8})`;
                ctx.fillRect(x, y, Math.ceil(pixelSize), Math.ceil(pixelSize));
            }
        }
    }
    
    // キラキラエフェクト
    const sparkleCount = Math.floor(effect.width * effect.height * 0.00002);
    for (let i = 0; i < sparkleCount; i++) {
        const sparkleX = effect.x + Math.random() * effect.width;
        const sparkleY = effect.y + Math.random() * effect.height;
        const sparkleSize = 1 + Math.random() * 3;
        const sparkleAlpha = Math.sin(time * 0.01 + i) * 0.5 + 0.5;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha * alpha})`;
        ctx.fillRect(sparkleX, sparkleY, sparkleSize, sparkleSize);
    }
    
    // カラフルなライン（パステル調）
    effect.glitchLines.forEach((line, index) => {
        const lineAlpha = alpha * line.intensity;
        const animOffset = Math.sin(time * 0.005 + index) * 3;
        
        const pastellColors = [
            `rgba(255, 182, 193, ${lineAlpha})`, // Light Pink
            `rgba(173, 216, 230, ${lineAlpha})`, // Light Blue
            `rgba(144, 238, 144, ${lineAlpha})`, // Light Green
            `rgba(255, 218, 185, ${lineAlpha})`, // Peach
            `rgba(221, 160, 221, ${lineAlpha})`, // Plum
            `rgba(255, 255, 224, ${lineAlpha})`  // Light Yellow
        ];
        
        pastellColors.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.fillRect(
                Math.floor(effect.x + line.offsetX + i * 2 + animOffset),
                Math.floor(line.y),
                Math.floor(line.width * 0.9),
                4
            );
        });
    });
    
    // パーティクル（フワフワ動く）
    effect.particles.forEach((particle, index) => {
        const floatOffset = Math.sin(time * 0.002 + index * 0.1) * 2;
        const pulseSize = particle.size + Math.sin(time * 0.003 + index * 0.2) * 0.5;
        
        ctx.fillStyle = particle.color + Math.floor(particle.life * 200).toString(16).padStart(2, '0');
        ctx.fillRect(
            Math.floor(particle.x),
            Math.floor(particle.y + floatOffset),
            Math.floor(pulseSize),
            Math.floor(pulseSize)
        );
        
        // 小さなハロー効果
        if (Math.random() < 0.1) {
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.life * 0.3})`;
            ctx.fillRect(
                Math.floor(particle.x - 1),
                Math.floor(particle.y + floatOffset - 1),
                Math.floor(pulseSize + 2),
                Math.floor(pulseSize + 2)
            );
        }
    });
}

/**
 * ピクセル化グリッチエフェクト
 */
function drawPixelatedGlitch(ctx: CanvasRenderingContext2D, effect: GlitchEffect): void {
    const alpha = Math.min(0.8, effect.lifeTime / effect.maxLifeTime);
    const pixelSize = 6;
    
    for (let x = effect.x; x < effect.x + effect.width; x += pixelSize) {
        for (let y = effect.y; y < effect.y + effect.height; y += pixelSize) {
            if (Math.random() < effect.density * 0.4) {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.7})`;
                ctx.fillRect(x, y, pixelSize, pixelSize);
            }
        }
    }
}

/**
 * クロマティックグリッチエフェクト
 */
function drawChromaticGlitch(ctx: CanvasRenderingContext2D, effect: GlitchEffect): void {
    const alpha = Math.min(0.7, effect.lifeTime / effect.maxLifeTime);
    
    // RGB分離エフェクト
    effect.glitchLines.forEach(line => {
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.6})`;
        ctx.fillRect(
            Math.floor(effect.x + line.offsetX - 3),
            Math.floor(line.y),
            Math.floor(line.width),
            2
        );
        
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha * 0.6})`;
        ctx.fillRect(
            Math.floor(effect.x + line.offsetX),
            Math.floor(line.y),
            Math.floor(line.width),
            2
        );
        
        ctx.fillStyle = `rgba(0, 0, 255, ${alpha * 0.6})`;
        ctx.fillRect(
            Math.floor(effect.x + line.offsetX + 3),
            Math.floor(line.y),
            Math.floor(line.width),
            2
        );
    });
}

/**
 * クラシックグリッチエフェクト
 */
function drawClassicGlitch(ctx: CanvasRenderingContext2D, effect: GlitchEffect): void {
    const alpha = Math.min(0.8, effect.lifeTime / effect.maxLifeTime);
    
    // 白いノイズライン
    effect.glitchLines.forEach(line => {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * line.intensity})`;
        ctx.fillRect(
            Math.floor(effect.x + line.offsetX),
            Math.floor(line.y),
            Math.floor(line.width),
            2
        );
    });
}
