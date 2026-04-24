// ═══════════════════════════════════════════
// 主入口文件
// ═══════════════════════════════════════════

// 页面加载时初始化所有模块
document.addEventListener('DOMContentLoaded', function() {
    // 1. 登录模块 - 检查登录状态
    initLogin();

    // 2. 主题初始化
    initTheme();
    initThemeToggle();

    // 3. 侧边栏初始化
    initSidebar();
    initSidebarGroups();
    initNavDropdowns();

    // 4. 页面交互初始化
    initPageInteractions();

    // 5. AI 抽屉初始化
    initAiDrawer();

    // 6. 层级选择器初始化
    initLevelPicker();

    // 7. 并发设置初始化
    initConcurrencySettings();

    // 8. 初始化图表（仅仪表盘页面）
    initCharts('dashboard');

    // 9. 文件上传
    initFileUpload();

    // 10. 模拟实时日志
    initLogViewer();
});

// 文件上传初始化
function initFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                showToast('success', '文件上传成功', `已读取: ${file.name}`);
            }
        });
    }

    if (uploadZone) {
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) {
                showToast('success', '文件上传成功', `已读取: ${file.name}`);
            }
        });
    }
}

// 日志查看器
function initLogViewer() {
    setInterval(() => {
        const logViewer = document.getElementById('logViewer');
        if (!logViewer) return;

        const resultPage = document.getElementById('page-result');
        if (!resultPage || !resultPage.classList.contains('active')) return;

        const statuses = [
            { level: 'success', text: 'PASS', msg: `用例 TC_0${Math.floor(Math.random()*9)+1}: 执行成功` },
            { level: 'info', text: 'INFO', msg: `正在执行下一步骤...` }
        ];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });

        const logLine = document.createElement('div');
        logLine.className = 'log-line';
        logLine.innerHTML = `
            <span class="log-time">${time}</span>
            <span class="log-level ${status.level}">${status.text}</span>
            <span class="log-msg">${status.msg}</span>
        `;
        logViewer.appendChild(logLine);
        logViewer.scrollTop = logViewer.scrollHeight;

        // 限制日志数量
        while (logViewer.children.length > 50) {
            logViewer.removeChild(logViewer.firstChild);
        }
    }, 3000);
}

// 生成用例
function generateCases() {
    showToast('success', 'AI 生成中', '正在分析需求并生成测试用例...');

    setTimeout(() => {
        showToast('success', '生成完成', '已生成 28 条测试用例，请前往审核');
    }, 2000);
}

// AI 消息发送（页面内 AI）
function sendAiMessage() {
    const input = document.getElementById('aiInput');
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    showToast('success', 'AI 处理中', '正在分析你的需求...');
    input.value = '';
}

// 设置快捷提示
function setPrompt(el) {
    const input = document.getElementById('aiInput');
    if (input) {
        input.value = el.textContent.replace(/^[^\s]+\s/, '');
    }
}

// 输入方式选择
function selectInputMethod(el, type) {
    const inputMethods = document.querySelectorAll('.input-method');
    inputMethods.forEach(m => m.classList.remove('active'));
    el.classList.add('active');

    const uploadZone = document.getElementById('uploadZone');
    const nlpInput = document.getElementById('nlpInput');

    if (type === 'nlp') {
        if (uploadZone) uploadZone.style.display = 'none';
        if (nlpInput) nlpInput.style.display = 'block';
    } else {
        if (uploadZone) uploadZone.style.display = 'block';
        if (nlpInput) nlpInput.style.display = 'none';
    }
}

// 添加成员弹窗
function showAddMemberModal() {
    const content = `
        <div class="form-group">
            <label class="form-label">姓名</label>
            <input type="text" class="form-input" placeholder="输入成员姓名">
        </div>
        <div class="form-group">
            <label class="form-label">邮箱</label>
            <input type="email" class="form-input" placeholder="输入邮箱地址">
        </div>
        <div class="form-group">
            <label class="form-label">角色</label>
            <select class="form-select">
                <option>测试工程师</option>
                <option>观察者</option>
                <option>管理员</option>
            </select>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 12px;">
            <button class="btn btn-secondary" onclick="hideModal()">取消</button>
            <button class="btn btn-primary" onclick="hideModal(); showToast('success', '添加成功', '新成员已添加到团队')">确认添加</button>
        </div>
    `;
    showModal('添加团队成员', content);
}
