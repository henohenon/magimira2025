import { events as babylonEvents } from "../babylon/events";
import { playAnimation } from "../babylon/mdl";
import {
    addCameraPosition,
    setCameraPosition,
    addCameraRotation,
    setCameraRotation,
    getCameraPosition,
    getCameraRotation,
    getActiveCamera
} from "../babylon/camera";
import {
    switchLight,
    setLightIntensity,
    setLightingPreset,
    restoreDefaultSettings
} from "../babylon/light";
import { counter, counterInstance, spectrums } from "../main";
import {
    addFrequency,
    type CircleSpectrum,
    type HorizontalSpectrum,
    type VerticalSpectrum,
} from "../effects/spectrum";
import {createCircleRipple, createSquareRipple} from "../effects/ripple";

const circleSpectrum = spectrums["circle"] as CircleSpectrum;
const horizontalSpectrum = spectrums["horizontal"] as HorizontalSpectrum;
const verticalSpectrum = spectrums["vertical"] as VerticalSpectrum;

const animationList = document.getElementById("animationList");
if (!animationList) {
    throw new Error("Animation list not found");
}

babylonEvents.on("onMdlAnimLoaded", (animationNames) => {
    animationNames.map((name) => {
        const button = document.createElement("button");
        button.innerText = name;
        button.addEventListener("click", () => {
            playAnimation(name);
        });
        animationList.appendChild(button);
        return button;
    });
});

for(const id of ["default","front","side","top","free"]){
    const btn = document.getElementById(`camera-${id}`);
    if (!btn) {
        throw new Error(`Camera button ${id} not found`);
    }
    btn.addEventListener("click", () => switchLight(id));
}

// ライトボタンのイベントリスナーを追加
for(const id of ["default","spot","point","hemispheric"]){
    const btn = document.getElementById(`light-${id}`);
    if (!btn) {
        throw new Error(`Light button ${id} not found`);
    }
    btn.addEventListener("click", () => switchLight(id));
}

// Addposition/Setposition セクションのイベントリスナーを追加
const addPosButton = document.getElementById('add-pos-button');
const setPosButton = document.getElementById('set-pos-button');
const addPosKeyInput = document.getElementById('add-pos-key') as HTMLInputElement;
const addPosXInput = document.getElementById('add-pos-x') as HTMLInputElement;
const addPosYInput = document.getElementById('add-pos-y') as HTMLInputElement;
const addPosZInput = document.getElementById('add-pos-z') as HTMLInputElement;
const setPosKeyInput = document.getElementById('set-pos-key') as HTMLInputElement;
const setPosXInput = document.getElementById('set-pos-x') as HTMLInputElement;
const setPosYInput = document.getElementById('set-pos-y') as HTMLInputElement;
const setPosZInput = document.getElementById('set-pos-z') as HTMLInputElement;

// Addrotation/Setrotation セクションのイベントリスナーを追加
const addRotButton = document.getElementById('add-rot-button');
const setRotButton = document.getElementById('set-rot-button');
const addRotKeyInput = document.getElementById('add-rot-key') as HTMLInputElement;
const addRotXInput = document.getElementById('add-rot-x') as HTMLInputElement;
const addRotYInput = document.getElementById('add-rot-y') as HTMLInputElement;
const addRotZInput = document.getElementById('add-rot-z') as HTMLInputElement;
const setRotKeyInput = document.getElementById('set-rot-key') as HTMLInputElement;
const setRotXInput = document.getElementById('set-rot-x') as HTMLInputElement;
const setRotYInput = document.getElementById('set-rot-y') as HTMLInputElement;
const setRotZInput = document.getElementById('set-rot-z') as HTMLInputElement;

// 要素が存在するか確認
if (!addPosButton || !addPosKeyInput || !addPosXInput || !addPosYInput || !addPosZInput) {
    throw new Error('Addposition セクションの要素が見つかりません');
}

if (!setPosButton || !setPosKeyInput || !setPosXInput || !setPosYInput || !setPosZInput) {
    throw new Error('Setposition セクションの要素が見つかりません');
}

if (!addRotButton || !addRotKeyInput || !addRotXInput || !addRotYInput || !addRotZInput) {
    throw new Error('Addrotation セクションの要素が見つかりません');
}

if (!setRotButton || !setRotKeyInput || !setRotXInput || !setRotYInput || !setRotZInput) {
    throw new Error('Setrotation セクションの要素が見つかりません');
}

// カメラキーの検証
function validateCameraKey(key: string): boolean {
    if (!key) {
        alert('キー名を入力してください');
        return false;
    }
    return true;
}

// Addposition ボタンのイベントリスナー
addPosButton.addEventListener('click', () => {
    const key = addPosKeyInput.value.trim();
    if (!validateCameraKey(key)) return;

    const x = parseFloat(addPosXInput.value);
    const y = parseFloat(addPosYInput.value);
    const z = parseFloat(addPosZInput.value);

    const result = addCameraPosition(key, x, y, z);

    if (result) {
        // 成功時はフォームをリセット
        addPosXInput.value = '0';
        addPosYInput.value = '0';
        addPosZInput.value = '0';
    } else {
        alert(`カメラの位置調整に失敗しました。キー "${key}" が存在するか確認してください。`);
    }
});

// Setposition ボタンのイベントリスナー
setPosButton.addEventListener('click', () => {
    const key = setPosKeyInput.value.trim();
    if (!validateCameraKey(key)) return;

    const x = parseFloat(setPosXInput.value);
    const y = parseFloat(setPosYInput.value);
    const z = parseFloat(setPosZInput.value);

    const result = setCameraPosition(key, x, y, z);

    if (result) {
        // 成功時はフォームをリセット
        setPosXInput.value = '0';
        setPosYInput.value = '0';
        setPosZInput.value = '0';
    } else {
        alert(`カメラの位置設定に失敗しました。キー "${key}" が存在するか確認してください。`);
    }
});

// Addrotation ボタンのイベントリスナー
addRotButton.addEventListener('click', () => {
    const key = addRotKeyInput.value.trim();
    if (!validateCameraKey(key)) return;

    const alpha = parseFloat(addRotXInput.value); // X = Alpha (水平角)
    const beta = parseFloat(addRotYInput.value);  // Y = Beta (垂直角)
    const radius = parseFloat(addRotZInput.value); // Z = Radius (距離)

    const result = addCameraRotation(key, alpha, beta, radius);

    if (result) {
        // 成功時はフォームをリセット
        addRotXInput.value = '0';
        addRotYInput.value = '0';
        addRotZInput.value = '0';
    } else {
        alert(`カメラの回転追加に失敗しました。キー "${key}" が存在するか確認してください。`);
    }
});

// Setrotation ボタンのイベントリスナー
setRotButton.addEventListener('click', () => {
    const key = setRotKeyInput.value.trim();
    if (!validateCameraKey(key)) return;

    const alpha = parseFloat(setRotXInput.value); // X = Alpha (水平角)
    const beta = parseFloat(setRotYInput.value);  // Y = Beta (垂直角)
    const radius = parseFloat(setRotZInput.value); // Z = Radius (距離)

    const result = setCameraRotation(key, alpha, beta, radius);

    if (result) {
        // 成功時はフォームをリセット
        setRotXInput.value = '0';
        setRotYInput.value = '0';
        setRotZInput.value = '0';
    } else {
        alert(`カメラの回転設定に失敗しました。キー "${key}" が存在するか確認してください。`);
    }
});

// 個別軸回転の追加はAddrotation/Setrotationの2セクションで対応

// カメラ情報取得のセットアップ
const getCameraInfoBtn = document.getElementById('get-camera-info') as HTMLButtonElement;
const cameraInfoKeySelect = document.getElementById('camera-info-key') as HTMLSelectElement;
const cameraPosXInfo = document.getElementById('camera-pos-x-info') as HTMLElement;
const cameraPosYInfo = document.getElementById('camera-pos-y-info') as HTMLElement;
const cameraPosZInfo = document.getElementById('camera-pos-z-info') as HTMLElement;
const cameraRotAlphaInfo = document.getElementById('camera-rot-alpha-info') as HTMLElement;
const cameraRotBetaInfo = document.getElementById('camera-rot-beta-info') as HTMLElement;
const cameraRotRadiusInfo = document.getElementById('camera-rot-radius-info') as HTMLElement;
const activeCameraInfo = document.getElementById('active-camera-info') as HTMLElement;

// 要素の存在確認
if (!getCameraInfoBtn || !cameraInfoKeySelect || !cameraPosXInfo || !cameraPosYInfo || !cameraPosZInfo ||
    !cameraRotAlphaInfo || !cameraRotBetaInfo || !cameraRotRadiusInfo || !activeCameraInfo) {
    throw new Error('カメラ座標確認セクションの要素が見つかりません');
}

// カメラ情報を更新する関数
function updateCameraInfo() {
    const key = cameraInfoKeySelect.value;

    // 位置情報を取得・表示
    const position = getCameraPosition(key);
    if (position) {
        cameraPosXInfo.textContent = position.x.toFixed(2);
        cameraPosYInfo.textContent = position.y.toFixed(2);
        cameraPosZInfo.textContent = position.z.toFixed(2);
    } else {
        cameraPosXInfo.textContent = '-';
        cameraPosYInfo.textContent = '-';
        cameraPosZInfo.textContent = '-';
    }

    // 回転情報を取得・表示
    const rotation = getCameraRotation(key);
    if (rotation) {
        cameraRotAlphaInfo.textContent = rotation.alpha.toFixed(2);
        cameraRotBetaInfo.textContent = rotation.beta.toFixed(2);
        cameraRotRadiusInfo.textContent = rotation.radius.toFixed(2);
    } else {
        cameraRotAlphaInfo.textContent = '-';
        cameraRotBetaInfo.textContent = '-';
        cameraRotRadiusInfo.textContent = '-';
    }

    // アクティブカメラを表示
    const activeCamera = getActiveCamera();
    activeCameraInfo.textContent = activeCamera || '-';
}

// カメラ情報取得ボタンのイベントリスナー
getCameraInfoBtn.addEventListener('click', updateCameraInfo);

// カメラ切り替えボタンのハンドラを修正して、切り替え後に情報を更新
for(const id of ["default", "front", "side", "top", "free"]) {
    const btn = document.getElementById(`camera-${id}`);
    if (btn) {
        // 既存のイベントリスナーは上で設定済み、その後に情報更新処理を追加
        const originalClick = btn.onclick;
        btn.onclick = function(event) {
            if (originalClick) {
                originalClick.call(btn, event);
            }
            // カメラ情報を更新（少し遅延を入れて確実に切り替え後の情報を取得）
            setTimeout(updateCameraInfo, 100);
        };
    }
}

// カメラ情報は updateCameraInfo 関数で既に処理されているため、追加の表示関数は不要

// カメラ情報の初期表示
updateCameraInfo();

// LightsetIntensity セクションの設定
const lightIntensityKeySelect = document.getElementById('light-intensity-key') as HTMLSelectElement;
const lightIntensitySlider = document.getElementById('light-intensity-slider') as HTMLInputElement;
const lightIntensityValue = document.getElementById('light-intensity-value') as HTMLSpanElement;
const lightIntensityApply = document.getElementById('light-intensity-apply') as HTMLButtonElement;

if (lightIntensityKeySelect && lightIntensitySlider && lightIntensityValue && lightIntensityApply) {
    // スライダーの値表示を更新
    function updateIntensityDisplay() {
        lightIntensityValue.textContent = lightIntensitySlider.value;
    }

    // 明るさを適用する関数
    function applyLightIntensity() {
        const intensity = parseFloat(lightIntensitySlider.value);
        const lightKey = lightIntensityKeySelect.value;
        setLightIntensity(intensity, lightKey);

        // 視覚的フィードバック
        lightIntensityApply.classList.add('bg-green-600');
        lightIntensityApply.textContent = '適用済み';
        setTimeout(() => {
            lightIntensityApply.classList.remove('bg-green-600');
            lightIntensityApply.textContent = '適用';
        }, 1000);
    }

    // スライダーの変更イベント（表示更新 + リアルタイム適用）
    lightIntensitySlider.addEventListener('input', () => {
        updateIntensityDisplay();
        applyLightIntensity(); // リアルタイム適用
    });

    // 適用ボタンのイベントハンドラ
    lightIntensityApply.addEventListener('click', applyLightIntensity);
    // ライトキー選択変更時：現在のライトの明るさをスライダーに反映
    lightIntensityKeySelect.addEventListener('change', () => {
        // 選択したライトの現在の明るさを取得してスライダーに反映
        applyLightIntensity();
    });

    // 初期表示更新
    updateIntensityDisplay();
}

// ライティングプリセットボタンの設定
const presetButtons = {
    default: document.getElementById('preset-default'),
    day: document.getElementById('preset-day'),
    night: document.getElementById('preset-night'),
    sunset: document.getElementById('preset-sunset'),
    dawn: document.getElementById('preset-dawn')
};

// プリセットボタンのイベントハンドラ
Object.entries(presetButtons).forEach(([preset, button]) => {
    if (button) {
        button.addEventListener('click', () => {
            if (preset === 'default') {
                // デフォルトに戻す場合
                restoreDefaultSettings();
            } else {
                // 通常のプリセット適用
                setLightingPreset(preset);
            }

            // 視覚的フィードバック効果を追加
            button.classList.add('preset-applied');
            setTimeout(() => {
                button.classList.remove('preset-applied');
            }, 600);

            console.log(`Applied ${preset} lighting preset`);
        });
    }
});

// 初期位置・回転リセットボタンのイベントハンドラ
const resetPosButton = document.getElementById('reset-pos-button');
const resetRotButton = document.getElementById('reset-rot-button');

if (resetPosButton) {
    resetPosButton.addEventListener('click', async () => {
        try {
            const cameraModule = await import('../babylon/camera.js');
            const success = cameraModule.resetAllCamerasToInitial();

            if (success) {
                // 視覚的フィードバック
                resetPosButton.classList.add('bg-green-600');
                setTimeout(() => {
                    resetPosButton.classList.remove('bg-green-600');
                }, 600);

                console.log('All cameras reset to initial position');
            }
        } catch (error) {
            console.error('Error resetting camera positions:', error);
        }
    });
}

if (resetRotButton) {
    resetRotButton.addEventListener('click', async () => {
        try {
            const cameraModule = await import('../babylon/camera.js');
            const success = cameraModule.resetAllCamerasToInitial();

            if (success) {
                // 視覚的フィードバック
                resetRotButton.classList.add('bg-green-600');
                setTimeout(() => {
                    resetRotButton.classList.remove('bg-green-600');
                }, 600);

                console.log('All cameras reset to initial rotation');
            }
        } catch (error) {
            console.error('Error resetting camera rotations:', error);
        }
    });
}

// Counter slider and input field setup
const counterSlider = document.getElementById("counter-slider") as HTMLInputElement;
const counterInput = document.getElementById("counter-input") as HTMLInputElement;

if (!counterSlider || !counterInput) {
    throw new Error("Counter controls not found");
}

counterSlider.addEventListener("input", () => {
    const value = parseInt(counterSlider.value);
    counterInput.value = value.toString();
    counterInstance.set(value);
});

counterInput.addEventListener("change", () => {
    const value = parseInt(counterInput.value);
    counterSlider.value = value.toString();
    counterInstance.set(value);
});

counter.subscribe((event) => {
    const count = event.count;
    counterSlider.value = count.toString();
    counterInput.value = count.toString();
    console.log("Counter updated:", count);
});

// Frequency Control
const spectrumAddFrequencyButton = document.getElementById("spectrum-add-frequency") as HTMLButtonElement;
if (!spectrumAddFrequencyButton) {
    throw new Error("Frequency control not found");
}

// Circle Spectrum Controls
const circleSpectrumEnableCheckbox = document.getElementById("circle-spectrum-enable") as HTMLInputElement;
const circleSpectrumLightnessSlider = document.getElementById("circle-spectrum-lightness") as HTMLInputElement;
const circleSpectrumLightnessInput = document.getElementById("circle-spectrum-lightness-input") as HTMLInputElement;
const circleSpectrumOpacitySlider = document.getElementById("circle-spectrum-opacity") as HTMLInputElement;
const circleSpectrumOpacityInput = document.getElementById("circle-spectrum-opacity-input") as HTMLInputElement;
const circleSpectrumHueOffsetSlider = document.getElementById("circle-spectrum-hue-offset") as HTMLInputElement;
const circleSpectrumHueOffsetInput = document.getElementById("circle-spectrum-hue-offset-input") as HTMLInputElement;
const circleSpectrumHueDeltaInput = document.getElementById("circle-spectrum-hue-delta") as HTMLInputElement;
const circleSpectrumLineCountInput = document.getElementById("circle-spectrum-line-count") as HTMLInputElement;
const circleSpectrumMinRadiusSlider = document.getElementById("circle-spectrum-min-radius") as HTMLInputElement;
const circleSpectrumMaxRadiusSlider = document.getElementById("circle-spectrum-max-radius") as HTMLInputElement;

if (!circleSpectrumEnableCheckbox || !circleSpectrumLightnessSlider || !circleSpectrumLightnessInput ||
    !circleSpectrumOpacitySlider || !circleSpectrumOpacityInput || !circleSpectrumHueOffsetSlider ||
    !circleSpectrumHueOffsetInput || !circleSpectrumHueDeltaInput || !circleSpectrumLineCountInput ||
    !circleSpectrumMinRadiusSlider || !circleSpectrumMaxRadiusSlider) {
    throw new Error("Circle spectrum controls not found");
}

// Horizontal Spectrum Controls
const horizontalSpectrumEnableCheckbox = document.getElementById("horizontal-spectrum-enable") as HTMLInputElement;
const horizontalSpectrumLightnessSlider = document.getElementById("horizontal-spectrum-lightness") as HTMLInputElement;
const horizontalSpectrumLightnessInput = document.getElementById("horizontal-spectrum-lightness-input") as HTMLInputElement;
const horizontalSpectrumOpacitySlider = document.getElementById("horizontal-spectrum-opacity") as HTMLInputElement;
const horizontalSpectrumOpacityInput = document.getElementById("horizontal-spectrum-opacity-input") as HTMLInputElement;
const horizontalSpectrumHueOffsetSlider = document.getElementById("horizontal-spectrum-hue-offset") as HTMLInputElement;
const horizontalSpectrumHueOffsetInput = document.getElementById("horizontal-spectrum-hue-offset-input") as HTMLInputElement;
const horizontalSpectrumHueDeltaInput = document.getElementById("horizontal-spectrum-hue-delta") as HTMLInputElement;
const horizontalSpectrumLineCountInput = document.getElementById("horizontal-spectrum-line-count") as HTMLInputElement;
const horizontalSpectrumHeightInput = document.getElementById("horizontal-spectrum-height") as HTMLInputElement;

if (!horizontalSpectrumEnableCheckbox || !horizontalSpectrumLightnessSlider || !horizontalSpectrumLightnessInput ||
    !horizontalSpectrumOpacitySlider || !horizontalSpectrumOpacityInput || !horizontalSpectrumHueOffsetSlider ||
    !horizontalSpectrumHueOffsetInput || !horizontalSpectrumHueDeltaInput || !horizontalSpectrumLineCountInput ||
    !horizontalSpectrumHeightInput) {
    throw new Error("Horizontal spectrum controls not found");
}

// Vertical Spectrum Controls
const verticalSpectrumEnableCheckbox = document.getElementById("vertical-spectrum-enable") as HTMLInputElement;
const verticalSpectrumLightnessSlider = document.getElementById("vertical-spectrum-lightness") as HTMLInputElement;
const verticalSpectrumLightnessInput = document.getElementById("vertical-spectrum-lightness-input") as HTMLInputElement;
const verticalSpectrumOpacitySlider = document.getElementById("vertical-spectrum-opacity") as HTMLInputElement;
const verticalSpectrumOpacityInput = document.getElementById("vertical-spectrum-opacity-input") as HTMLInputElement;
const verticalSpectrumHueOffsetSlider = document.getElementById("vertical-spectrum-hue-offset") as HTMLInputElement;
const verticalSpectrumHueOffsetInput = document.getElementById("vertical-spectrum-hue-offset-input") as HTMLInputElement;
const verticalSpectrumHueDeltaInput = document.getElementById("vertical-spectrum-hue-delta") as HTMLInputElement;
const verticalSpectrumLineCountInput = document.getElementById("vertical-spectrum-line-count") as HTMLInputElement;
const verticalSpectrumWidthInput = document.getElementById("vertical-spectrum-width") as HTMLInputElement;

if (!verticalSpectrumEnableCheckbox || !verticalSpectrumLightnessSlider || !verticalSpectrumLightnessInput ||
    !verticalSpectrumOpacitySlider || !verticalSpectrumOpacityInput || !verticalSpectrumHueOffsetSlider ||
    !verticalSpectrumHueOffsetInput || !verticalSpectrumHueDeltaInput || !verticalSpectrumLineCountInput ||
    !verticalSpectrumWidthInput) {
    throw new Error("Vertical spectrum controls not found");
}

// Initialize circle spectrum with default values
circleSpectrum.setEnable(circleSpectrumEnableCheckbox.checked);
circleSpectrum.setLightness(parseInt(circleSpectrumLightnessSlider.value));
circleSpectrumLightnessInput.value = circleSpectrumLightnessSlider.value;
circleSpectrum.setOpacity(parseInt(circleSpectrumOpacitySlider.value) / 100);
circleSpectrumOpacityInput.value = circleSpectrumOpacitySlider.value;
circleSpectrum.setHueOffset(parseInt(circleSpectrumHueOffsetSlider.value));
circleSpectrumHueOffsetInput.value = circleSpectrumHueOffsetSlider.value;
circleSpectrum.setHueDelta(parseInt(circleSpectrumHueDeltaInput.value));
circleSpectrum.setLineCounts(parseInt(circleSpectrumLineCountInput.value));
circleSpectrum.setMinRadius(parseFloat(circleSpectrumMinRadiusSlider.value));
circleSpectrum.setMaxRadius(parseFloat(circleSpectrumMaxRadiusSlider.value));

// Initialize horizontal spectrum with default values
horizontalSpectrum.setEnable(horizontalSpectrumEnableCheckbox.checked);
horizontalSpectrum.setLightness(parseInt(horizontalSpectrumLightnessSlider.value));
horizontalSpectrumLightnessInput.value = horizontalSpectrumLightnessSlider.value;
horizontalSpectrum.setOpacity(parseInt(horizontalSpectrumOpacitySlider.value) / 100);
horizontalSpectrumOpacityInput.value = horizontalSpectrumOpacitySlider.value;
horizontalSpectrum.setHueOffset(parseInt(horizontalSpectrumHueOffsetSlider.value));
horizontalSpectrumHueOffsetInput.value = horizontalSpectrumHueOffsetSlider.value;
horizontalSpectrum.setHueDelta(parseInt(horizontalSpectrumHueDeltaInput.value));
horizontalSpectrum.setLineCounts(parseInt(horizontalSpectrumLineCountInput.value));
horizontalSpectrum.setHeight(parseInt(horizontalSpectrumHeightInput.value));

// Initialize vertical spectrum with default values
verticalSpectrum.setEnable(verticalSpectrumEnableCheckbox.checked);
verticalSpectrum.setLightness(parseInt(verticalSpectrumLightnessSlider.value));
verticalSpectrumLightnessInput.value = verticalSpectrumLightnessSlider.value;
verticalSpectrum.setOpacity(parseInt(verticalSpectrumOpacitySlider.value) / 100);
verticalSpectrumOpacityInput.value = verticalSpectrumOpacitySlider.value;
verticalSpectrum.setHueOffset(parseInt(verticalSpectrumHueOffsetSlider.value));
verticalSpectrumHueOffsetInput.value = verticalSpectrumHueOffsetSlider.value;
verticalSpectrum.setHueDelta(parseInt(verticalSpectrumHueDeltaInput.value));
verticalSpectrum.setLineCounts(parseInt(verticalSpectrumLineCountInput.value));
verticalSpectrum.setWidth(parseInt(verticalSpectrumWidthInput.value));

// Add event listeners for circle spectrum controls
circleSpectrumEnableCheckbox.addEventListener("change", () => {
    circleSpectrum.setEnable(circleSpectrumEnableCheckbox.checked);
});

circleSpectrumLightnessSlider.addEventListener("input", () => {
    const value = parseFloat(circleSpectrumLightnessSlider.value);
    circleSpectrumLightnessInput.value = value.toString();
    circleSpectrum.setLightness(value);
});

circleSpectrumLightnessInput.addEventListener("change", () => {
    const value = parseInt(circleSpectrumLightnessInput.value);
    circleSpectrumLightnessSlider.value = value.toString();
    circleSpectrum.setLightness(value);
});

circleSpectrumOpacitySlider.addEventListener("input", () => {
    const value = parseFloat(circleSpectrumOpacitySlider.value);
    circleSpectrumOpacityInput.value = value.toString();
    circleSpectrum.setOpacity(value / 100);
});

circleSpectrumOpacityInput.addEventListener("change", () => {
    const value = parseInt(circleSpectrumOpacityInput.value);
    circleSpectrumOpacitySlider.value = value.toString();
    circleSpectrum.setOpacity(value / 100);
});

circleSpectrumHueOffsetSlider.addEventListener("input", () => {
    const value = parseFloat(circleSpectrumHueOffsetSlider.value);
    circleSpectrumHueOffsetInput.value = value.toString();
    circleSpectrum.setHueOffset(value);
});

circleSpectrumHueOffsetInput.addEventListener("change", () => {
    const value = parseInt(circleSpectrumHueOffsetInput.value);
    circleSpectrumHueOffsetSlider.value = value.toString();
    circleSpectrum.setHueOffset(value);
});

circleSpectrumHueDeltaInput.addEventListener("change", () => {
    circleSpectrum.setHueDelta(parseFloat(circleSpectrumHueDeltaInput.value));
});

circleSpectrumLineCountInput.addEventListener("change", () => {
    circleSpectrum.setLineCounts(parseInt(circleSpectrumLineCountInput.value));
});

circleSpectrumMinRadiusSlider.addEventListener("change", () => {
    circleSpectrum.setMinRadius(parseFloat(circleSpectrumMinRadiusSlider.value));
});

circleSpectrumMaxRadiusSlider.addEventListener("change", () => {
    circleSpectrum.setMaxRadius(parseFloat(circleSpectrumMaxRadiusSlider.value));
});

// Add event listeners for horizontal spectrum controls
horizontalSpectrumEnableCheckbox.addEventListener("change", () => {
    horizontalSpectrum.setEnable(horizontalSpectrumEnableCheckbox.checked);
});

horizontalSpectrumLightnessSlider.addEventListener("input", () => {
    const value = parseFloat(horizontalSpectrumLightnessSlider.value);
    horizontalSpectrumLightnessInput.value = value.toString();
    horizontalSpectrum.setLightness(value);
});

horizontalSpectrumLightnessInput.addEventListener("change", () => {
    const value = parseInt(horizontalSpectrumLightnessInput.value);
    horizontalSpectrumLightnessSlider.value = value.toString();
    horizontalSpectrum.setLightness(value);
});

horizontalSpectrumOpacitySlider.addEventListener("input", () => {
    const value = parseFloat(horizontalSpectrumOpacitySlider.value);
    horizontalSpectrumOpacityInput.value = value.toString();
    horizontalSpectrum.setOpacity(value / 100);
});

horizontalSpectrumOpacityInput.addEventListener("change", () => {
    const value = parseInt(horizontalSpectrumOpacityInput.value);
    horizontalSpectrumOpacitySlider.value = value.toString();
    horizontalSpectrum.setOpacity(value / 100);
});

horizontalSpectrumHueOffsetSlider.addEventListener("input", () => {
    const value = parseFloat(horizontalSpectrumHueOffsetSlider.value);
    horizontalSpectrumHueOffsetInput.value = value.toString();
    horizontalSpectrum.setHueOffset(value);
});

horizontalSpectrumHueOffsetInput.addEventListener("change", () => {
    const value = parseInt(horizontalSpectrumHueOffsetInput.value);
    horizontalSpectrumHueOffsetSlider.value = value.toString();
    horizontalSpectrum.setHueOffset(value);
});

horizontalSpectrumHueDeltaInput.addEventListener("change", () => {
    horizontalSpectrum.setHueDelta(parseFloat(horizontalSpectrumHueDeltaInput.value));
});

horizontalSpectrumLineCountInput.addEventListener("change", () => {
    horizontalSpectrum.setLineCounts(parseInt(horizontalSpectrumLineCountInput.value));
});

horizontalSpectrumHeightInput.addEventListener("change", () => {
    horizontalSpectrum.setHeight(parseFloat(horizontalSpectrumHeightInput.value));
});

// Add event listeners for vertical spectrum controls
verticalSpectrumEnableCheckbox.addEventListener("change", () => {
    verticalSpectrum.setEnable(verticalSpectrumEnableCheckbox.checked);
});

verticalSpectrumLightnessSlider.addEventListener("input", () => {
    const value = parseFloat(verticalSpectrumLightnessSlider.value);
    verticalSpectrumLightnessInput.value = value.toString();
    verticalSpectrum.setLightness(value);
});

verticalSpectrumLightnessInput.addEventListener("change", () => {
    const value = parseInt(verticalSpectrumLightnessInput.value);
    verticalSpectrumLightnessSlider.value = value.toString();
    verticalSpectrum.setLightness(value);
});

verticalSpectrumOpacitySlider.addEventListener("input", () => {
    const value = parseFloat(verticalSpectrumOpacitySlider.value);
    verticalSpectrumOpacityInput.value = value.toString();
    verticalSpectrum.setOpacity(value / 100);
});

verticalSpectrumOpacityInput.addEventListener("change", () => {
    const value = parseInt(verticalSpectrumOpacityInput.value);
    verticalSpectrumOpacitySlider.value = value.toString();
    verticalSpectrum.setOpacity(value / 100);
});

verticalSpectrumHueOffsetSlider.addEventListener("input", () => {
    const value = parseFloat(verticalSpectrumHueOffsetSlider.value);
    verticalSpectrumHueOffsetInput.value = value.toString();
    verticalSpectrum.setHueOffset(value);
});

verticalSpectrumHueOffsetInput.addEventListener("change", () => {
    const value = parseInt(verticalSpectrumHueOffsetInput.value);
    verticalSpectrumHueOffsetSlider.value = value.toString();
    verticalSpectrum.setHueOffset(value);
});

verticalSpectrumHueDeltaInput.addEventListener("change", () => {
    verticalSpectrum.setHueDelta(parseFloat(verticalSpectrumHueDeltaInput.value));
});

verticalSpectrumLineCountInput.addEventListener("change", () => {
    verticalSpectrum.setLineCounts(parseInt(verticalSpectrumLineCountInput.value));
});

verticalSpectrumWidthInput.addEventListener("change", () => {
    verticalSpectrum.setWidth(parseFloat(verticalSpectrumWidthInput.value));
});

spectrumAddFrequencyButton.addEventListener("click", () => {
    // Add a random frequency with strength 50-200
    const strength = 50 + Math.floor(Math.random() * 150);
    addFrequency(strength);
});

// Circle Ripple Controls
const addCircleRippleButton = document.getElementById("add-circle-ripple") as HTMLButtonElement;
const circleRipplePositionXInput = document.getElementById("circle-ripple-position-x") as HTMLInputElement;
const circleRipplePositionYInput = document.getElementById("circle-ripple-position-y") as HTMLInputElement;
const circleRippleLifetimeInput = document.getElementById("circle-ripple-lifetime") as HTMLInputElement;
const circleRippleRadiusDeltaInput = document.getElementById("circle-ripple-radius-delta") as HTMLInputElement;
const circleRippleDefaultRadiusInput = document.getElementById("circle-ripple-default-radius") as HTMLInputElement;
const circleRippleOpacityDeltaInput = document.getElementById("circle-ripple-opacity-delta") as HTMLInputElement;
const circleRippleDefaultOpacityInput = document.getElementById("circle-ripple-default-opacity") as HTMLInputElement;
const circleRippleHueInput = document.getElementById("circle-ripple-hue") as HTMLInputElement;

// Square Ripple Controls
const addSquareRippleButton = document.getElementById("add-square-ripple") as HTMLButtonElement;
const squareRipplePositionXInput = document.getElementById("square-ripple-position-x") as HTMLInputElement;
const squareRipplePositionYInput = document.getElementById("square-ripple-position-y") as HTMLInputElement;
const squareRippleLifetimeInput = document.getElementById("square-ripple-lifetime") as HTMLInputElement;
const squareRippleSizeDeltaInput = document.getElementById("square-ripple-size-delta") as HTMLInputElement;
const squareRippleDefaultSizeInput = document.getElementById("square-ripple-default-size") as HTMLInputElement;
const squareRippleOpacityDeltaInput = document.getElementById("square-ripple-opacity-delta") as HTMLInputElement;
const squareRippleDefaultOpacityInput = document.getElementById("square-ripple-default-opacity") as HTMLInputElement;
const squareRippleHueInput = document.getElementById("square-ripple-hue") as HTMLInputElement;
const squareRippleAngleInput = document.getElementById("square-ripple-angle") as HTMLInputElement;

if (!addCircleRippleButton || !circleRipplePositionXInput || !circleRipplePositionYInput ||
    !circleRippleLifetimeInput || !circleRippleRadiusDeltaInput || !circleRippleDefaultRadiusInput ||
    !circleRippleOpacityDeltaInput || !circleRippleDefaultOpacityInput || !circleRippleHueInput ||
    !addSquareRippleButton || !squareRipplePositionXInput || !squareRipplePositionYInput ||
    !squareRippleLifetimeInput || !squareRippleSizeDeltaInput || !squareRippleDefaultSizeInput ||
    !squareRippleOpacityDeltaInput || !squareRippleDefaultOpacityInput || !squareRippleHueInput ||
    !squareRippleAngleInput) {
    throw new Error("Ripple controls not found");
}

// Set default positions to center of screen
circleRipplePositionXInput.value = (window.innerWidth / 2).toString();
circleRipplePositionYInput.value = (window.innerHeight / 2).toString();
squareRipplePositionXInput.value = (window.innerWidth / 2).toString();
squareRipplePositionYInput.value = (window.innerHeight / 2).toString();

// Circle Ripple Event Listener
addCircleRippleButton.addEventListener("click", () => {
    const x = parseInt(circleRipplePositionXInput.value);
    const y = parseInt(circleRipplePositionYInput.value);
    const lifeTime = parseInt(circleRippleLifetimeInput.value);
    const radiusDelta = parseFloat(circleRippleRadiusDeltaInput.value);
    const defaultRadius = parseFloat(circleRippleDefaultRadiusInput.value);
    const opacityDelta = parseFloat(circleRippleOpacityDeltaInput.value);
    const defaultOpacity = parseFloat(circleRippleDefaultOpacityInput.value);
    const hue = parseFloat(circleRippleHueInput.value);

    createCircleRipple(x, y, {
        lifeTime: lifeTime,
        radiusDelta: radiusDelta,
        defaultRadius: defaultRadius,
        opacityDelta: opacityDelta,
        defaultOpacity: defaultOpacity,
        hue: hue
    });
});

// Square Ripple Event Listener
addSquareRippleButton.addEventListener("click", () => {
    const x = parseInt(squareRipplePositionXInput.value);
    const y = parseInt(squareRipplePositionYInput.value);
    const lifeTime = parseInt(squareRippleLifetimeInput.value);
    const sizeDelta = parseFloat(squareRippleSizeDeltaInput.value);
    const defaultSize = parseFloat(squareRippleDefaultSizeInput.value);
    const opacityDelta = parseFloat(squareRippleOpacityDeltaInput.value);
    const defaultOpacity = parseFloat(squareRippleDefaultOpacityInput.value);
    const hue = parseFloat(squareRippleHueInput.value);
    const angleDegrees = parseFloat(squareRippleAngleInput.value);

    createSquareRipple(x, y, {
        lifeTime: lifeTime,
        sizeDelta: sizeDelta,
        defaultSize: defaultSize,
        opacityDelta: opacityDelta,
        defaultOpacity: defaultOpacity,
        hue: hue,
        angle: angleDegrees * Math.PI / 180 // Convert degrees to radians
    });
});
