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
import { switchLight } from "../babylon/light";

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

// カメラ切り替えボタンのイベントハンドラを修正して、切り替え後に情報を更新
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
