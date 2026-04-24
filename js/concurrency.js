// ═══════════════════════════════════════════
// 并发设置模块
// ═══════════════════════════════════════════

// 并发设置状态
let concurrencySettings = {
    execMode: 'parallel',
    concurrency: 50,
    caseTimeout: 300,
    taskTimeout: 7200,
    retryCount: 2,
    retryInterval: 5,
    fastFail: true,
    batchSize: 10,
    batchInterval: 1
};

// 初始化并发设置
function initConcurrencySettings() {
    const slider = document.getElementById('concurrencySlider');
    const valueDisplay = document.getElementById('concurrencyValue');

    if (slider && valueDisplay) {
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
        });
    }

    // 点击遮罩关闭
    const overlay = document.getElementById('concurrencyOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeConcurrencySettings();
            }
        });
    }

    // 输入验证
    const inputs = ['caseTimeout', 'taskTimeout', 'retryCount', 'retryInterval', 'batchSize', 'batchInterval'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', function() {
                const min = parseInt(this.min);
                const max = parseInt(this.max);
                let value = parseInt(this.value);

                if (value < min) value = min;
                if (value > max) value = max;

                this.value = value;
            });
        }
    });
}

// 打开并发设置面板
function openConcurrencySettings() {
    // 从 localStorage 恢复保存的设置
    const saved = localStorage.getItem('concurrencySettings');
    if (saved) {
        try {
            concurrencySettings = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse saved settings', e);
        }
    }

    // 应用设置到表单
    applySettingsToForm();

    // 显示模态框
    const overlayEl = document.getElementById('concurrencyOverlay');
    if (overlayEl) overlayEl.classList.add('show');
}

// 应用设置到表单
function applySettingsToForm() {
    // 执行模式
    const modeRadios = document.querySelectorAll('input[name="execMode"]');
    modeRadios.forEach(radio => {
        radio.checked = radio.value === concurrencySettings.execMode;
    });

    // 并发数量滑块
    const slider = document.getElementById('concurrencySlider');
    const valueDisplay = document.getElementById('concurrencyValue');
    if (slider) slider.value = concurrencySettings.concurrency;
    if (valueDisplay) valueDisplay.textContent = concurrencySettings.concurrency;

    // 超时设置
    const caseTimeout = document.getElementById('caseTimeout');
    const taskTimeout = document.getElementById('taskTimeout');
    if (caseTimeout) caseTimeout.value = concurrencySettings.caseTimeout;
    if (taskTimeout) taskTimeout.value = concurrencySettings.taskTimeout;

    // 重试策略
    const retryCount = document.getElementById('retryCount');
    const retryInterval = document.getElementById('retryInterval');
    if (retryCount) retryCount.value = concurrencySettings.retryCount;
    if (retryInterval) retryInterval.value = concurrencySettings.retryInterval;

    // 快速失败开关
    const fastFailSwitch = document.getElementById('fastFailSwitch');
    if (fastFailSwitch) fastFailSwitch.checked = concurrencySettings.fastFail;

    // 高级选项
    const batchSize = document.getElementById('batchSize');
    const batchInterval = document.getElementById('batchInterval');
    if (batchSize) batchSize.value = concurrencySettings.batchSize;
    if (batchInterval) batchInterval.value = concurrencySettings.batchInterval;
}

// 从表单获取设置
function getSettingsFromForm() {
    // 执行模式
    const checkedMode = document.querySelector('input[name="execMode"]:checked');
    concurrencySettings.execMode = checkedMode ? checkedMode.value : 'parallel';

    // 并发数量
    const slider = document.getElementById('concurrencySlider');
    if (slider) concurrencySettings.concurrency = parseInt(slider.value);

    // 超时设置
    const caseTimeout = document.getElementById('caseTimeout');
    const taskTimeout = document.getElementById('taskTimeout');
    if (caseTimeout) concurrencySettings.caseTimeout = parseInt(caseTimeout.value);
    if (taskTimeout) concurrencySettings.taskTimeout = parseInt(taskTimeout.value);

    // 重试策略
    const retryCount = document.getElementById('retryCount');
    const retryInterval = document.getElementById('retryInterval');
    if (retryCount) concurrencySettings.retryCount = parseInt(retryCount.value);
    if (retryInterval) concurrencySettings.retryInterval = parseInt(retryInterval.value);

    // 快速失败开关
    const fastFailSwitch = document.getElementById('fastFailSwitch');
    if (fastFailSwitch) concurrencySettings.fastFail = fastFailSwitch.checked;

    // 高级选项
    const batchSize = document.getElementById('batchSize');
    const batchInterval = document.getElementById('batchInterval');
    if (batchSize) concurrencySettings.batchSize = parseInt(batchSize.value);
    if (batchInterval) concurrencySettings.batchInterval = parseInt(batchInterval.value);

    return concurrencySettings;
}

// 关闭并发设置面板
function closeConcurrencySettings() {
    const overlayEl = document.getElementById('concurrencyOverlay');
    if (overlayEl) overlayEl.classList.remove('show');
}

// 保存并发设置
function saveConcurrencySettings() {
    // 获取表单数据
    const settings = getSettingsFromForm();

    // 保存到 localStorage
    localStorage.setItem('concurrencySettings', JSON.stringify(settings));

    // 关闭面板
    closeConcurrencySettings();

    // 显示保存成功提示
    const modeText = {
        'parallel': '并行执行',
        'serial': '串行执行',
        'mixed': '混合格执行'
    };

    showToast('success', '设置已保存',
        `执行模式: ${modeText[settings.execMode]}, 并发数: ${settings.concurrency}`);

    console.log('并发设置已保存:', settings);
}
