// ═══════════════════════════════════════════
// 层级选择器模块
// ═══════════════════════════════════════════

// 层级选择器数据配置
const levelData = {
    system: {
        title: '选择系统',
        icon: 'fa-globe',
        items: [
            { id: 'sys1', name: '用户管理系统', count: 128 },
            { id: 'sys2', name: '订单管理系统', count: 96 },
            { id: 'sys3', name: '支付系统', count: 64 },
            { id: 'sys4', name: '库存管理系统', count: 52 }
        ]
    },
    module: {
        title: '选择模块',
        icon: 'fa-cube',
        items: [
            { id: 'mod1', name: '用户注册模块', count: 28 },
            { id: 'mod2', name: '用户登录模块', count: 24 },
            { id: 'mod3', name: '订单创建模块', count: 36 },
            { id: 'mod4', name: '订单支付模块', count: 18 },
            { id: 'mod5', name: '商品管理模块', count: 32 }
        ]
    },
    function: {
        title: '选择功能',
        icon: 'fa-file-code',
        items: [
            { id: 'func1', name: '手机号注册', count: 8 },
            { id: 'func2', name: '邮箱验证登录', count: 12 },
            { id: 'func3', name: '密码重置', count: 6 },
            { id: 'func4', name: '订单查询', count: 10 }
        ]
    },
    case: {
        title: '选择用例',
        icon: 'fa-list-ul',
        items: [
            { id: 'case1', name: '正向用例集', count: 45 },
            { id: 'case2', name: '反向用例集', count: 32 },
            { id: 'case3', name: '边界值用例集', count: 18 }
        ]
    },
    api: {
        title: '选择接口',
        icon: 'fa-plug',
        items: [
            { id: 'api1', name: '/user/login', count: 5 },
            { id: 'api2', name: '/user/register', count: 8 },
            { id: 'api3', name: '/order/create', count: 12 },
            { id: 'api4', name: '/order/pay', count: 6 },
            { id: 'api5', name: '/product/list', count: 7 }
        ]
    }
};

let currentLevelType = null;
let selectedLevelItems = [];

// 初始化层级选择器
function initLevelPicker() {
    // 用例层级选项点击
    document.querySelectorAll('.level-option').forEach(function(option) {
        option.addEventListener('click', function() {
            const level = this.dataset.level;
            openLevelPicker(level);
        });
    });

    // 新增按钮点击
    const addBtn = document.getElementById('levelPickerAddBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            const input = document.getElementById('levelPickerInput');
            const value = input.value.trim();
            if (!value) {
                showToast('warning', '请输入', '请输入选项名称');
                return;
            }

            const data = levelData[currentLevelType];

            // 添加到列表
            const list = document.getElementById('levelPickerList');
            const newId = 'custom_' + Date.now();
            const newItem = document.createElement('div');
            newItem.className = 'level-picker-item selected';
            newItem.dataset.id = newId;
            newItem.dataset.name = value;
            newItem.onclick = function() { toggleLevelItem(this); };
            newItem.innerHTML = `
                <div class="item-checkbox"></div>
                <div class="item-icon"><i class="fas ${data.icon}"></i></div>
                <div class="item-name">${value}</div>
                <div class="item-count">新增</div>
            `;
            list.insertBefore(newItem, list.firstChild);

            selectedLevelItems.push({ id: newId, name: value });
            input.value = '';
        });
    }

    // 回车添加
    const input = document.getElementById('levelPickerInput');
    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const addBtn = document.getElementById('levelPickerAddBtn');
                if (addBtn) addBtn.click();
            }
        });
    }

    // 点击遮罩关闭
    const overlay = document.getElementById('levelPickerOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeLevelPicker();
        });
    }
}

// 打开层级选择器
function openLevelPicker(levelType) {
    currentLevelType = levelType;
    const data = levelData[levelType];
    if (!data) return;

    selectedLevelItems = [];

    // 设置标题
    const titleEl = document.getElementById('levelPickerTitle');
    if (titleEl) {
        titleEl.innerHTML = `<i class="fas ${data.icon}"></i> ${data.title}`;
    }

    // 渲染列表
    const list = document.getElementById('levelPickerList');
    if (list) {
        list.innerHTML = data.items.map(item => `
            <div class="level-picker-item" data-id="${item.id}" data-name="${item.name}" onclick="toggleLevelItem(this)">
                <div class="item-checkbox"></div>
                <div class="item-icon"><i class="fas ${data.icon}"></i></div>
                <div class="item-name">${item.name}</div>
                <div class="item-count">${item.count} 条</div>
            </div>
        `).join('');
    }

    // 清空输入框
    const inputEl = document.getElementById('levelPickerInput');
    if (inputEl) inputEl.value = '';

    // 显示模态框
    const overlayEl = document.getElementById('levelPickerOverlay');
    if (overlayEl) overlayEl.classList.add('show');
}

// 切换选择项
function toggleLevelItem(el) {
    el.classList.toggle('selected');

    const id = el.dataset.id;
    const name = el.dataset.name;

    if (el.classList.contains('selected')) {
        selectedLevelItems.push({ id, name });
    } else {
        selectedLevelItems = selectedLevelItems.filter(item => item.id !== id);
    }
}

// 关闭选择器
function closeLevelPicker() {
    const overlayEl = document.getElementById('levelPickerOverlay');
    if (overlayEl) overlayEl.classList.remove('show');
}

// 确认选择
function confirmLevelPicker() {
    const input = document.getElementById('levelPickerInput');
    const inputValue = input ? input.value.trim() : '';

    // 获取选中的项
    const selected = [...selectedLevelItems];

    // 如果有新增的项
    if (inputValue) {
        const newId = 'custom_' + Date.now();
        selected.push({ id: newId, name: inputValue });
    }

    if (selected.length === 0) {
        showToast('warning', '请选择', '请选择至少一个选项或输入新选项');
        return;
    }

    // 更新层级选项显示
    const levelOption = document.querySelector(`.level-option[data-level="${currentLevelType}"]`);
    if (levelOption) {
        const nameSpan = levelOption.querySelector('span');
        const descSpan = levelOption.querySelector('small');

        if (selected.length === 1) {
            if (nameSpan) nameSpan.textContent = selected[0].name;
        } else {
            if (nameSpan) nameSpan.textContent = `已选 ${selected.length} 项`;
        }
        if (descSpan) descSpan.textContent = selected.map(s => s.name).join(', ');
    }

    closeLevelPicker();
    showToast('success', '选择成功', `已选择: ${selected.map(s => s.name).join(', ')}`);
    console.log('选择的层级项:', currentLevelType, selected);
}

// 执行层级选择
function selectLevel(el) {
    document.querySelectorAll('.level-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
}
