// filepath: c:\Users\gomaa\magimira2025\src\dev\main.ts
import { events as babylonEvents } from "../babylon/events";
import { playAnimation } from "../babylon/mdl";
import { 
    switchCamera, 
    addCameraPosition, 
    setCameraPosition,
    addCameraRotation,
    setCameraRotation,
    getCameraPosition,
    getCameraRotation,
    getActiveCamera
} from "../babylon/camera";
import { switchLight, setLightEnabled, setLightColor, setLightIntensity, setLightingPreset, restoreDefaultSettings } from "../babylon/light";

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
    btn.addEventListener("click", () => switchCamera(id));
}

// ライトボタンのイベントリスナーを追加
for(const id of ["default","spot","point","hemispheric"]){
    const btn = document.getElementById(`light-${id}`);
    if (!btn) {
        throw new Error(`Light button ${id} not found`);
    }
    btn.addEventListener("click", () => switchLight(id));
}

// LightsetEnableセクションの設定
const lightEnableKeySelect = document.getElementById('light-enable-key') as HTMLSelectElement;
const lightToggle = document.getElementById('light-toggle') as HTMLInputElement;

// 要素の存在確認
if (!lightEnableKeySelect || !lightToggle) {
    throw new Error('LightsetEnable セクションの要素が見つかりません');
}

// トグルスイッチの初期状態を設定（デフォルトでオン）
lightToggle.checked = true;

// ライトキー選択とトグルスイッチのイベントハンドラ
lightToggle.addEventListener('change', () => {
    const isEnabled = lightToggle.checked;
    const lightKey = lightEnableKeySelect.value;
    setLightEnabled(isEnabled, lightKey);
});

// ライトキー選択変更時のイベントハンドラ
lightEnableKeySelect.addEventListener('change', () => {
    const isEnabled = lightToggle.checked;
    const lightKey = lightEnableKeySelect.value;
    setLightEnabled(isEnabled, lightKey);
});

// LightsetColorセクションの設定
const lightColorKeySelect = document.getElementById('light-color-key') as HTMLSelectElement;
const lightColorPicker = document.getElementById('light-color-picker') as HTMLInputElement;
const lightColorApply = document.getElementById('light-color-apply') as HTMLButtonElement;
const colorPresets = document.querySelectorAll('.color-preset');

// 要素の存在確認
if (!lightColorKeySelect || !lightColorPicker || !lightColorApply) {
    throw new Error('LightsetColor セクションの要素が見つかりません');
}

// ライトの色を適用する関数
function applyLightColor() {
    const selectedColor = lightColorPicker.value;
    const lightKey = lightColorKeySelect.value;
    setLightColor(selectedColor, lightKey);
}

// 適用ボタンのイベントハンドラ
lightColorApply.addEventListener('click', applyLightColor);

// カラーピッカーの変更イベント（即時反映）
lightColorPicker.addEventListener('input', applyLightColor);

// ライトキー選択変更時のイベントハンドラ
lightColorKeySelect.addEventListener('change', applyLightColor);

// プリセットカラーボタンのイベントハンドラ
colorPresets.forEach(preset => {
    preset.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const presetColor = target.getAttribute('data-color');
        if (presetColor) {
            lightColorPicker.value = presetColor;
            applyLightColor();
        }
    });
});

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
