// ═══════════════════════════════════════════
// AI 抽屉模块
// ═══════════════════════════════════════════

// AI 抽屉状态
let drawerOpen = false;

// 初始化 AI 抽屉
function initAiDrawer() {
    // 动态插入 AI 抽屉 HTML
    document.body.insertAdjacentHTML('beforeend', `
        <div class="ai-fab" id="aiFab" title="AI 助手" onclick="toggleAiDrawer()">
            <span class="fab-icon">🤖</span>
            <div class="fab-ping"></div>
        </div>
        <div class="ai-fab-tooltip" id="fabTooltip">AI 助手</div>
        <div class="ai-drawer-overlay" id="aiDrawerOverlay">
            <div class="ai-drawer" id="aiDrawer">
                <div class="ai-drawer-header">
                    <div class="ai-drawer-avatar">🤖</div>
                    <div class="ai-drawer-title">
                        <h3>AI 助手</h3>
                        <p>基于大语言模型，帮你分析需求、生成用例、诊断问题</p>
                    </div>
                    <button class="ai-drawer-close" id="drawerCloseBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="ai-drawer-messages" id="drawerMessages">
                    <div class="msg-bubble ai">
                        👋 你好！我是 AI 助手，可以帮你：
                        <br>• 分析需求文档，生成测试用例
                        <br>• 诊断失败用例，找出根因
                        <br>• 生成测试周报与质量报告
                        <br>• 预测版本发布风险
                        <div class="msg-time">刚刚</div>
                    </div>
                </div>
                <div class="ai-drawer-footer">
                    <div class="ai-drawer-input-row">
                        <input class="ai-drawer-input" id="drawerInput"
                            placeholder="输入自然语言，AI 帮你完成测试相关任务..." />
                        <button class="ai-drawer-send" id="drawerSendBtn">
                            <i class="fas fa-paper-plane"></i> 发送
                        </button>
                    </div>
                    <div class="ai-drawer-chips" id="drawerChips">
                        <span class="chip">📄 分析需求文档</span>
                        <span class="chip">✨ 生成登录模块用例</span>
                        <span class="chip">🔍 诊断最近失败用例</span>
                        <span class="chip">📊 生成周报摘要</span>
                        <span class="chip">⚡ 预测发布风险</span>
                    </div>
                </div>
            </div>
        </div>
    `);

    // 绑定事件
    const aiDrawer = document.getElementById('aiDrawer');
    const aiOverlay = document.getElementById('aiDrawerOverlay');
    const aiFab = document.getElementById('aiFab');
    const fabTooltip = document.getElementById('fabTooltip');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const drawerSendBtn = document.getElementById('drawerSendBtn');
    const drawerInput = document.getElementById('drawerInput');
    const navBadge = document.querySelector('.ai-nav-badge');

    function openAiDrawer() {
        drawerOpen = true;
        aiDrawer && aiDrawer.classList.add('open');
        aiOverlay && aiOverlay.classList.add('visible');
        aiFab && aiFab.classList.add('open');
        fabTooltip && fabTooltip.classList.remove('show');
        setTimeout(() => drawerInput && drawerInput.focus(), 380);
    }

    function closeAiDrawer() {
        drawerOpen = false;
        aiDrawer && aiDrawer.classList.remove('open');
        aiOverlay && aiOverlay.classList.remove('visible');
        aiFab && aiFab.classList.remove('open');
    }

    function toggleAiDrawerFn() {
        drawerOpen ? closeAiDrawer() : openAiDrawer();
    }

    // 暴露到全局
    window.toggleAiDrawer = toggleAiDrawerFn;
    window.closeAiDrawer = closeAiDrawer;

    // 点击事件
    navBadge && navBadge.addEventListener('click', toggleAiDrawerFn);
    aiFab && aiFab.addEventListener('click', toggleAiDrawerFn);
    aiFab && aiFab.addEventListener('mouseenter', () => fabTooltip && fabTooltip.classList.add('show'));
    aiFab && aiFab.addEventListener('mouseleave', () => fabTooltip && fabTooltip.classList.remove('show'));
    drawerCloseBtn && drawerCloseBtn.addEventListener('click', closeAiDrawer);

    // 点击遮罩关闭
    aiOverlay && aiOverlay.addEventListener('click', function(e) {
        if (e.target === aiOverlay) closeAiDrawer();
    });

    // 发送按钮
    drawerSendBtn && drawerSendBtn.addEventListener('click', function() {
        window.sendDrawerMessage && window.sendDrawerMessage();
    });

    // 回车发送
    drawerInput && drawerInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            drawerSendBtn && drawerSendBtn.click();
        }
    });

    // 快捷按钮
    document.querySelectorAll('#drawerChips .chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
            const text = this.textContent.replace(/^[^\s]+\s/, '');
            if (drawerInput) {
                drawerInput.value = text;
                drawerInput.focus();
            }
        });
    });

    // AI 消息辅助函数
    window.appendAiMsg = function(content, role) {
        const wrap = document.getElementById('drawerMessages');
        if (!wrap) return;
        const now = new Date();
        const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
        const div = document.createElement('div');
        div.className = 'msg-bubble ' + role;
        div.innerHTML = content + '<div class="msg-time">' + time + '</div>';
        wrap.appendChild(div);
        wrap.scrollTop = wrap.scrollHeight;
    };

    window.showAiTyping = function() {
        const wrap = document.getElementById('drawerMessages');
        if (!wrap) return;
        const el = document.createElement('div');
        el.className = 'msg-bubble ai msg-typing';
        el.id = 'typingIndicator';
        el.innerHTML = '<span></span><span></span><span></span>';
        wrap.appendChild(el);
        wrap.scrollTop = wrap.scrollHeight;
    };

    window.removeAiTyping = function() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    };
}

// 发送 AI 消息
window.sendDrawerMessage = function() {
    const input = document.getElementById('drawerInput');
    if (!input) return;

    const msg = input.value.trim();
    if (!msg) return;

    // 添加用户消息
    window.appendAiMsg(msg, 'user');
    input.value = '';

    // 显示正在输入
    window.showAiTyping();

    // 模拟 AI 响应
    setTimeout(() => {
        window.removeAiTyping();
        const responses = [
            '好的，我已经理解您的需求。正在分析测试数据...',
            '根据历史数据，我建议增加边界值测试用例以提升覆盖率。',
            '已为您生成 28 条测试用例，请前往审核模块查看。',
            '检测到支付模块有 3 个潜在风险点，建议优先测试。'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        window.appendAiMsg(response, 'ai');
    }, 1500);
};
