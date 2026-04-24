// ═══════════════════════════════════════════
// 执行层级选择器模块
// ═══════════════════════════════════════════

let currentExecuteLevelType = 'system';
let selectedExecuteLevelItems = [];

// 初始化执行层级选择器
function initExecuteLevelPicker() {
    const addBtn = document.getElementById('executeLevelPickerAddBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            const input = document.getElementById('executeLevelPickerInput');
            const value = input.value.trim();
            if (!value) {
                showToast('warning', '请输入', '请输入选项名称');
                return;
            }

            const levelConfig = {
                system: 'fa-layer-group',
                module: 'fa-cube',
                function: 'fa-file-code',
                case: 'fa-list-ul',
                api: 'fa-plug'
            };
            const icon = levelConfig[currentExecuteLevelType] || 'fa-file';

            // 添加到列表
            const list = document.getElementById('executeLevelPickerList');
            const newId = 'custom_' + Date.now();
            const newItem = document.createElement('div');
            newItem.className = 'level-picker-item selected';
            newItem.dataset.id = newId;
            newItem.dataset.name = value;
            newItem.onclick = function() { toggleExecuteLevelItem(this); };
            newItem.innerHTML = `
                <div class="item-checkbox"></div>
                <div class="item-icon"><i class="fas ${icon}"></i></div>
                <div class="item-name">${value}</div>
                <div class="item-count">新增</div>
            `;
            list.insertBefore(newItem, list.firstChild);

            selectedExecuteLevelItems.push({ id: newId, name: value });
            input.value = '';
        });
    }

    // 回车添加
    const input = document.getElementById('executeLevelPickerInput');
    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const addBtn = document.getElementById('executeLevelPickerAddBtn');
                if (addBtn) addBtn.click();
            }
        });
    }

    // 点击遮罩关闭
    const overlay = document.getElementById('executeLevelPickerOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeExecuteLevelPicker();
        });
    }
}

// 执行层级选择 - 打开选择器
function selectExecuteLevel(el) {
    // 移除其他active，添加当前active
    document.querySelectorAll('.execute-levels .level-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');

    const level = el.dataset.level;
    currentExecuteLevelType = level;

    const levelConfig = {
        system: { title: '选择系统', icon: 'fa-layer-group' },
        module: { title: '选择模块', icon: 'fa-cube' },
        function: { title: '选择功能', icon: 'fa-file-code' },
        case: { title: '选择用例', icon: 'fa-list-ul' },
        api: { title: '选择接口', icon: 'fa-plug' }
    };

    const config = levelConfig[level] || levelConfig.system;

    // 模拟数据
    const mockData = {
        system: [
            { id: 's1', name: '用户管理系统', count: 128 },
            { id: 's2', name: '订单中心', count: 85 },
            { id: 's3', name: '支付系统', count: 56 },
            { id: 's4', name: '商品中心', count: 92 }
        ],
        module: [
            { id: 'm1', name: '用户注册模块', count: 24 },
            { id: 'm2', name: '用户登录模块', count: 18 },
            { id: 'm3', name: '订单管理模块', count: 32 }
        ],
        function: [
            { id: 'f1', name: '用户登录功能', count: 12 },
            { id: 'f2', name: '用户登出功能', count: 6 },
            { id: 'f3', name: '密码重置功能', count: 8 }
        ],
        case: [
            { id: 'c1', name: 'TC_001 正常登录', count: 1 },
            { id: 'c2', name: 'TC_002 错误密码', count: 1 },
            { id: 'c3', name: 'TC_003 账号不存在', count: 1 }
        ],
        api: [
            { id: 'a1', name: '/api/user/login', count: 1 },
            { id: 'a2', name: '/api/user/logout', count: 1 },
            { id: 'a3', name: '/api/order/create', count: 1 }
        ]
    };

    const data = mockData[level] || [];

    // 更新标题
    const titleEl = document.getElementById('executeLevelPickerTitle');
    if (titleEl) {
        titleEl.innerHTML = `<i class="fas ${config.icon}"></i> ${config.title}`;
    }

    // 渲染列表
    const list = document.getElementById('executeLevelPickerList');
    if (list) {
        list.innerHTML = data.map(item => `
            <div class="level-picker-item" data-id="${item.id}" data-name="${item.name}" onclick="toggleExecuteLevelItem(this)">
                <div class="item-checkbox"></div>
                <div class="item-icon"><i class="fas ${config.icon}"></i></div>
                <div class="item-name">${item.name}</div>
                <div class="item-count">${item.count} 条</div>
            </div>
        `).join('');
    }

    // 清空输入框
    const inputEl = document.getElementById('executeLevelPickerInput');
    if (inputEl) inputEl.value = '';
    selectedExecuteLevelItems = [];

    // 显示模态框
    const overlayEl = document.getElementById('executeLevelPickerOverlay');
    if (overlayEl) overlayEl.classList.add('show');
}

// 切换执行层级选择项
function toggleExecuteLevelItem(el) {
    el.classList.toggle('selected');

    const id = el.dataset.id;
    const name = el.dataset.name;

    if (el.classList.contains('selected')) {
        selectedExecuteLevelItems.push({ id, name });
    } else {
        selectedExecuteLevelItems = selectedExecuteLevelItems.filter(item => item.id !== id);
    }
}

// 关闭执行层级选择器
function closeExecuteLevelPicker() {
    const overlayEl = document.getElementById('executeLevelPickerOverlay');
    if (overlayEl) overlayEl.classList.remove('show');
}

// 确认执行层级选择
function confirmExecuteLevelPicker() {
    const input = document.getElementById('executeLevelPickerInput');
    const inputValue = input ? input.value.trim() : '';

    // 获取选中的项
    const selected = [...selectedExecuteLevelItems];

    // 如果有新增的项
    if (inputValue) {
        const newId = 'custom_' + Date.now();
        selected.push({ id: newId, name: inputValue });
    }

    if (selected.length === 0) {
        showToast('warning', '请选择', '请选择至少一个选项或输入新选项');
        return;
    }

    // 更新层级卡片显示
    const levelCard = document.querySelector(`.execute-levels .level-card[data-level="${currentExecuteLevelType}"]`);
    if (levelCard) {
        const nameEl = levelCard.querySelector('.level-selected-name');

        if (selected.length === 1) {
            if (nameEl) nameEl.textContent = selected[0].name;
        } else {
            if (nameEl) nameEl.textContent = `已选 ${selected.length} 项`;
        }
    }

    closeExecuteLevelPicker();
    showToast('success', '选择成功', `已选择: ${selected.map(s => s.name).join(', ')}`);
    console.log('选择的执行层级项:', currentExecuteLevelType, selected);
}
