import {
    addCameraPosition,
    setCameraPosition,
    addCameraRotation,
    setCameraRotation,
    getCameraPosition,
    getCameraRotation,
    getActiveCamera, switchCamera
} from "../babylon/camera";

// Camera type buttons
for(const id of ["default","front","side","top","free"]){
    const btn = document.getElementById(`camera-${id}`);
    if (!btn) {
        throw new Error(`Camera button ${id} not found`);
    }
    btn.addEventListener("click", () => switchCamera(id));
}

// Addposition/Setposition controls
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

// Addrotation/Setrotation controls
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

// Check if elements exist
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

// Camera key validation
function validateCameraKey(key: string): boolean {
    if (!key) {
        alert('キー名を入力してください');
        return false;
    }
    return true;
}

// Addposition button event listener
addPosButton.addEventListener('click', () => {
    const key = addPosKeyInput.value.trim();
    if (!validateCameraKey(key)) return;

    const x = parseFloat(addPosXInput.value);
    const y = parseFloat(addPosYInput.value);
    const z = parseFloat(addPosZInput.value);

    const result = addCameraPosition(key, x, y, z);

    if (result) {
        // Reset form on success
        addPosXInput.value = '0';
        addPosYInput.value = '0';
        addPosZInput.value = '0';
    } else {
        alert(`カメラの位置調整に失敗しました。キー "${key}" が存在するか確認してください。`);
    }
});

// Setposition button event listener
setPosButton.addEventListener('click', () => {
    const key = setPosKeyInput.value.trim();
    if (!validateCameraKey(key)) return;

    const x = parseFloat(setPosXInput.value);
    const y = parseFloat(setPosYInput.value);
    const z = parseFloat(setPosZInput.value);

    const result = setCameraPosition(key, x, y, z);

    if (result) {
        // Reset form on success
        setPosXInput.value = '0';
        setPosYInput.value = '0';
        setPosZInput.value = '0';
    } else {
        alert(`カメラの位置設定に失敗しました。キー "${key}" が存在するか確認してください。`);
    }
});

// Addrotation button event listener
addRotButton.addEventListener('click', () => {
    const key = addRotKeyInput.value.trim();
    if (!validateCameraKey(key)) return;

    const alpha = parseFloat(addRotXInput.value); // X = Alpha (水平角)
    const beta = parseFloat(addRotYInput.value);  // Y = Beta (垂直角)
    const radius = parseFloat(addRotZInput.value); // Z = Radius (距離)

    const result = addCameraRotation(key, alpha, beta, radius);

    if (result) {
        // Reset form on success
        addRotXInput.value = '0';
        addRotYInput.value = '0';
        addRotZInput.value = '0';
    } else {
        alert(`カメラの回転追加に失敗しました。キー "${key}" が存在するか確認してください。`);
    }
});

// Setrotation button event listener
setRotButton.addEventListener('click', () => {
    const key = setRotKeyInput.value.trim();
    if (!validateCameraKey(key)) return;

    const alpha = parseFloat(setRotXInput.value); // X = Alpha (水平角)
    const beta = parseFloat(setRotYInput.value);  // Y = Beta (垂直角)
    const radius = parseFloat(setRotZInput.value); // Z = Radius (距離)

    const result = setCameraRotation(key, alpha, beta, radius);

    if (result) {
        // Reset form on success
        setRotXInput.value = '0';
        setRotYInput.value = '0';
        setRotZInput.value = '0';
    } else {
        alert(`カメラの回転設定に失敗しました。キー "${key}" が存在するか確認してください。`);
    }
});

// Camera info display setup
const getCameraInfoBtn = document.getElementById('get-camera-info') as HTMLButtonElement;
const cameraInfoKeySelect = document.getElementById('camera-info-key') as HTMLSelectElement;
const cameraPosXInfo = document.getElementById('camera-pos-x-info') as HTMLElement;
const cameraPosYInfo = document.getElementById('camera-pos-y-info') as HTMLElement;
const cameraPosZInfo = document.getElementById('camera-pos-z-info') as HTMLElement;
const cameraRotAlphaInfo = document.getElementById('camera-rot-alpha-info') as HTMLElement;
const cameraRotBetaInfo = document.getElementById('camera-rot-beta-info') as HTMLElement;
const cameraRotRadiusInfo = document.getElementById('camera-rot-radius-info') as HTMLElement;
const activeCameraInfo = document.getElementById('active-camera-info') as HTMLElement;

// Check if elements exist
if (!getCameraInfoBtn || !cameraInfoKeySelect || !cameraPosXInfo || !cameraPosYInfo || !cameraPosZInfo ||
    !cameraRotAlphaInfo || !cameraRotBetaInfo || !cameraRotRadiusInfo || !activeCameraInfo) {
    throw new Error('カメラ座標確認セクションの要素が見つかりません');
}

// Function to update camera info
function updateCameraInfo() {
    const key = cameraInfoKeySelect.value;

    // Get and display position info
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

    // Get and display rotation info
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

    // Display active camera
    const activeCamera = getActiveCamera();
    activeCameraInfo.textContent = activeCamera || '-';
}

// Camera info button event listener
getCameraInfoBtn.addEventListener('click', updateCameraInfo);

// Modify camera switch buttons to update info after switching
for(const id of ["default", "front", "side", "top", "free"]) {
    const btn = document.getElementById(`camera-${id}`);
    if (btn) {
        const originalClick = btn.onclick;
        btn.onclick = function(event) {
            if (originalClick) {
                originalClick.call(btn, event);
            }
            // Update camera info after switching (with delay to ensure switch completes)
            setTimeout(updateCameraInfo, 100);
        };
    }
}

// Initial camera info display
updateCameraInfo();

// Camera reset buttons
const resetPosButton = document.getElementById('reset-pos-button');
const resetRotButton = document.getElementById('reset-rot-button');

if (resetPosButton) {
    resetPosButton.addEventListener('click', async () => {
        try {
            const cameraModule = await import('../babylon/camera.js');
            const success = cameraModule.resetAllCamerasToInitial();

            if (success) {
                // Visual feedback
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
                // Visual feedback
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