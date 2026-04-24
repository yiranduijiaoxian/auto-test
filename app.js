// 图表实例（已在 js/charts.js 中声明）

        // ═══════════════════════════════════════════
        // 账号管理全局函数
        // ═══════════════════════════════════════════
        function showAddAccountModal() {
            currentEditId = null;
            var modal = document.getElementById('accountModal');
            if (modal) {
                modal.classList.add('show');
                document.getElementById('accountModalTitle').innerHTML = '<i class="fas fa-user-plus"></i> 新增账号';
                document.getElementById('editAccountId').value = '';
                document.getElementById('accountUsername').value = '';
                document.getElementById('accountEmail').value = '';
                document.getElementById('accountPassword').value = '';
                document.getElementById('accountPassword').required = true;
                document.getElementById('accountRole').value = 'tester';
                document.getElementById('accountStatus').checked = true;
                // 确保开关样式正确
                var statusLabelEl = document.getElementById('accountStatus');
                if (statusLabelEl) {
                    statusLabelEl.parentElement.classList.add('active');
                }
                document.getElementById('statusLabel').textContent = '启用';
            }
        }

        function closeAccountModal() {
            var modal = document.getElementById('accountModal');
            if (modal) modal.classList.remove('show');
            currentEditId = null;
        }

        // ═══════════════════════════════════════════
        // 登录页面功能
        // ═══════════════════════════════════════════
        function initLogin() {
            // 检查是否已登录
            const isLoggedIn = localStorage.getItem('aitestpro-logged-in') === 'true';
            if (isLoggedIn) {
                showMainApp();
            }

            // 绑定密码切换按钮事件
            const passwordToggle = document.getElementById('loginPasswordToggle');
            if (passwordToggle) {
                passwordToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    toggleLoginPassword();
                });
            }

            // 如果有记住的用户名，填充进去
            const savedUsername = localStorage.getItem('aitestpro-saved-username');
            if (savedUsername) {
                document.getElementById('loginUsername').value = savedUsername;
                document.getElementById('rememberMe').checked = true;
            }
        }

        function showMainApp() {
            const loginPage = document.getElementById('loginPage');
            const appContainer = document.getElementById('appContainer');

            if (loginPage) {
                loginPage.style.opacity = '0';
                loginPage.style.transform = 'scale(0.95)';
            }

            setTimeout(() => {
                if (loginPage) loginPage.style.display = 'none';
                if (appContainer) {
                    appContainer.style.display = 'block';
                    appContainer.style.opacity = '0';
                    appContainer.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        appContainer.style.opacity = '1';
                    }, 50);
                }

                // 初始化图表（带错误捕获）
                try {
                    if (typeof initCharts === 'function') initCharts();
                } catch(e) {
                    console.warn('[showMainApp] initCharts error:', e);
                }
            }, 300);
        }

        function handleLogin(event) {
            event.preventDefault();

            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            const loginBtn = document.getElementById('loginBtn');

            // 显示加载状态
            loginBtn.classList.add('loading');

            // 模拟登录验证
            setTimeout(() => {
                // 演示账号验证
                if (username === 'admin' && password === 'admin123') {
                    // 登录成功
                    localStorage.setItem('aitestpro-logged-in', 'true');
                    localStorage.setItem('aitestpro-username', username);
                    localStorage.setItem('aitestpro-user-role', 'admin'); // 保存用户角色

                    if (rememberMe) {
                        localStorage.setItem('aitestpro-remember', 'true');
                        localStorage.setItem('aitestpro-saved-username', username);
                    } else {
                        localStorage.removeItem('aitestpro-remember');
                        localStorage.removeItem('aitestpro-saved-username');
                    }

                    showToast('success', '登录成功', `欢迎回来，${username}！`);
                    showMainApp();
                } else {
                    // 登录失败
                    loginBtn.classList.remove('loading');
                    showToast('error', '登录失败', '用户名或密码错误');
                    document.getElementById('loginPassword').value = '';
                }
            }, 1000);
        }

        function toggleLoginPassword() {
            const input = document.getElementById('loginPassword');
            const toggleBtn = document.getElementById('loginPasswordToggle');
            const icon = toggleBtn.querySelector('i');

            // 切换 type 属性
            if (input.getAttribute('type') === 'password') {
                input.setAttribute('type', 'text');
                icon.className = 'fas fa-eye-slash';
            } else {
                input.setAttribute('type', 'password');
                icon.className = 'fas fa-eye';
            }
        }

        function logout() {
            localStorage.removeItem('aitestpro-logged-in');
            location.reload();
        }

        // 页面加载时检查登录状态
        document.addEventListener('DOMContentLoaded', function() {
            initLogin();
        });

        // ═══════════════════════════════════════════
        // 主题切换功能
        // ═══════════════════════════════════════════
        function initTheme() {
            const savedTheme = localStorage.getItem('aitestpro-theme') || 'dark';
            setTheme(savedTheme);
        }

        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('aitestpro-theme', theme);

            const toggle = document.getElementById('themeToggle');
            const label = document.getElementById('themeLabel');

            if (toggle && label) {
                if (theme === 'light') {
                    label.textContent = '浅色';
                } else {
                    label.textContent = '深色';
                }
            }
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);

            // 显示切换提示
            const themeName = newTheme === 'light' ? '浅色模式' : '深色模式';
            showToast('success', '主题切换', `已切换到${themeName}`);
        }

        // 初始化主题
        initTheme();

        // ═══════════════════════════════════════════
        // 导航栏下拉菜单功能
        // ═══════════════════════════════════════════
        function initNavDropdowns() {
            const notificationBtn = document.getElementById('notificationBtn');
            const userAvatar = document.getElementById('userAvatar');
            const notificationMenu = document.getElementById('notificationMenu');
            const userMenu = document.getElementById('userMenu');

            if (notificationBtn && notificationMenu) {
                notificationBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    closeAllDropdowns();
                    notificationMenu.classList.toggle('show');
                });
            }

            if (userAvatar && userMenu) {
                userAvatar.addEventListener('click', function(e) {
                    e.stopPropagation();
                    closeAllDropdowns();
                    userMenu.classList.toggle('show');
                });
            }

            // 点击其他地方关闭菜单
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.nav-dropdown')) {
                    closeAllDropdowns();
                }
            });
        }

        function closeAllDropdowns() {
            const menus = document.querySelectorAll('.dropdown-menu');
            menus.forEach(menu => menu.classList.remove('show'));
        }

        function clearAllNotifications() {
            showToast('success', '通知', '所有通知已标记为已读');
            const badge = document.querySelector('.nav-item .badge');
            if (badge) {
                badge.style.display = 'none';
            }
            closeAllDropdowns();
        }

        // 页面加载时初始化下拉菜单
        document.addEventListener('DOMContentLoaded', initNavDropdowns);

        // ═══════════════════════════════════════════
        // 账号设置页面功能
        // ═══════════════════════════════════════════
        function switchAccountTab(tabName) {
            const tabs = document.querySelectorAll('.account-tab');
            const contents = document.querySelectorAll('.account-content');

            tabs.forEach(tab => tab.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));

            document.querySelector(`.account-tab[data-tab="${tabName}"]`).classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');
        }

        function saveAccountSettings() {
            const name = document.getElementById('userName').value;
            const nickname = document.getElementById('userNickname').value;
            const email = document.getElementById('userEmail').value;
            const phone = document.getElementById('userPhone').value;
            const dept = document.getElementById('userDept').value;
            const title = document.getElementById('userTitle').value;

            // 保存到本地存储
            localStorage.setItem('aitestpro-user-name', name);
            localStorage.setItem('aitestpro-user-nickname', nickname);
            localStorage.setItem('aitestpro-user-email', email);
            localStorage.setItem('aitestpro-user-phone', phone);
            localStorage.setItem('aitestpro-user-dept', dept);
            localStorage.setItem('aitestpro-user-title', title);

            showToast('success', '保存成功', '账号信息已更新');
        }

        function resetAccountForm() {
            document.getElementById('userName').value = '李明';
            document.getElementById('userNickname').value = '小明';
            document.getElementById('userEmail').value = 'liming@company.com';
            document.getElementById('userPhone').value = '138****8888';
            document.getElementById('userDept').value = 'qa';
            document.getElementById('userTitle').value = '测试工程师';
            showToast('info', '已重置', '表单已恢复为原始值');
        }

        function togglePasswordVisibility(inputId) {
            const input = document.getElementById(inputId);
            const icon = input.nextElementSibling.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        function changePassword() {
            const currentPwd = document.getElementById('currentPwd').value;
            const newPwd = document.getElementById('newPwd').value;
            const confirmPwd = document.getElementById('confirmPwd').value;

            if (!currentPwd) {
                showToast('error', '错误', '请输入当前密码');
                return;
            }

            if (newPwd.length < 8) {
                showToast('error', '错误', '新密码至少需要8位');
                return;
            }

            if (newPwd !== confirmPwd) {
                showToast('error', '错误', '两次输入的密码不一致');
                return;
            }

            showToast('success', '密码已更新', '请使用新密码重新登录');
            document.getElementById('currentPwd').value = '';
            document.getElementById('newPwd').value = '';
            document.getElementById('confirmPwd').value = '';
        }

        function enableTwoFactor(type) {
            if (type === 'sms') {
                showToast('info', '验证手机', '验证码已发送，请查收短信');
            } else {
                showToast('info', '身份验证器', '请使用身份验证器APP扫描二维码');
            }
        }

        function toggleNotification(element) {
            element.classList.toggle('active');
        }

        function selectTheme(element) {
            const themeOptions = document.querySelectorAll('.theme-option');
            themeOptions.forEach(opt => opt.classList.remove('active'));
            element.classList.add('active');

            const theme = element.dataset.theme;
            setTheme(theme);
        }

        function previewAvatar(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('avatarPreview');
                    preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">`;
                };
                reader.readAsDataURL(input.files[0]);
                showToast('success', '头像已更新', '点击保存按钮以保存更改');
            }
        }

        function exportAllData() {
            showToast('info', '导出数据', '正在准备您的数据...');
            setTimeout(() => {
                showToast('success', '导出完成', '数据已保存为 JSON 文件');
            }, 1500);
        }

        function confirmDeleteAccount() {
            showModal('注销账号', `
                <div style="text-align: center; padding: 20px 0;">
                    <div style="font-size: 48px; color: var(--danger); margin-bottom: 16px;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p style="font-size: 16px; margin-bottom: 8px;">确定要注销您的账号吗？</p>
                    <p style="color: var(--text-secondary); font-size: 14px;">此操作将永久删除您的所有数据，且不可恢复。</p>
                </div>
            `, [
                { text: '取消', class: 'btn-secondary', action: 'hideModal()' },
                { text: '确认注销', class: 'btn-danger', action: 'executeDeleteAccount()' }
            ]);
        }

        function executeDeleteAccount() {
            hideModal();
            showToast('warning', '账号注销中', '正在退出登录...');
        }

        // ═══════════════════════════════════════════
        // 侧边栏功能（已在 js/sidebar.js 中实现）
        // initSidebar(), initSidebarGroups(), initNavDropdowns()
        // 由 js/main.js 统一调用
        // ═══════════════════════════════════════════

        // 绑定主题切换按钮
        document.addEventListener('DOMContentLoaded', function() {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', toggleTheme);
            }
            // 侧边栏初始化已移至 js/main.js 统一管理
        });
// ═══════════════════════════════════════════
// AI 悬浮球 & 抽屉面板
// ═══════════════════════════════════════════
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

// 全局函数（供 FAB 和 nav badge 调用）
function _toggleAiDrawer() {
    if (window._drawerOpen) {
        window._closeAiDrawer();
    } else {
        window._openAiDrawer();
    }
}
function _openAiDrawer() {
    window._drawerOpen = true;
    const d = document.getElementById('aiDrawer');
    const o = document.getElementById('aiDrawerOverlay');
    const f = document.getElementById('aiFab');
    const t = document.getElementById('fabTooltip');
    if (d) d.classList.add('open');
    if (o) o.classList.add('visible');
    if (f) f.classList.add('open');
    if (t) t.classList.remove('show');
    setTimeout(() => {
        const inp = document.getElementById('drawerInput');
        if (inp) inp.focus();
    }, 380);
}
function _closeAiDrawer() {
    window._drawerOpen = false;
    const d = document.getElementById('aiDrawer');
    const o = document.getElementById('aiDrawerOverlay');
    const f = document.getElementById('aiFab');
    if (d) d.classList.remove('open');
    if (o) o.classList.remove('visible');
    if (f) f.classList.remove('open');
}
window._drawerOpen = false;
window.toggleAiDrawer = _toggleAiDrawer;
window.openAiDrawer   = _openAiDrawer;
window.closeAiDrawer  = _closeAiDrawer;

// 立即绑定 FAB click（同步执行，不等 DOMContentLoaded）




// AI Drawer state (使用全局变量避免与 ai-drawer.js 冲突)
window._drawerOpen = false;

// ── Bind AI drawer events (after DOM insertion) ──
document.addEventListener('DOMContentLoaded', function() {
    const aiDrawer    = document.getElementById('aiDrawer');
    const aiOverlay  = document.getElementById('aiDrawerOverlay');
    const aiFab      = document.getElementById('aiFab');
    const fabTooltip = document.getElementById('fabTooltip');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const drawerSendBtn  = document.getElementById('drawerSendBtn');
    const drawerInput    = document.getElementById('drawerInput');

    // Nav badge in header
    const navBadge = document.querySelector('.ai-nav-badge');

    function openAiDrawer() {
        window._drawerOpen = true;
        aiDrawer && aiDrawer.classList.add('open');
        aiOverlay && aiOverlay.classList.add('visible');
        aiFab && aiFab.classList.add('open');
        fabTooltip && fabTooltip.classList.remove('show');
        setTimeout(() => drawerInput && drawerInput.focus(), 380);
    }

    function closeAiDrawer() {
        window._drawerOpen = false;
        aiDrawer && aiDrawer.classList.remove('open');
        aiOverlay && aiOverlay.classList.remove('visible');
        aiFab && aiFab.classList.remove('open');
    }

    function toggleAiDrawer() {
        window._drawerOpen ? closeAiDrawer() : openAiDrawer();
    }

    // Expose globally for any legacy onclick attributes
    window.toggleAiDrawer = toggleAiDrawer;
    window.closeAiDrawer   = closeAiDrawer;

    // ── Click listeners ──
    navBadge       && navBadge.addEventListener('click', toggleAiDrawer);
    // 只在点击遮罩层（而非抽屉本身）时关闭
    aiOverlay      && aiOverlay.addEventListener('click', function(e) {
        if (e.target === aiOverlay) closeAiDrawer();
    });
    drawerCloseBtn && drawerCloseBtn.addEventListener('click', closeAiDrawer);

    // FAB tooltip hover
    aiFab          && aiFab.addEventListener('click', toggleAiDrawer);
    aiFab && aiFab.addEventListener('mouseenter', () => fabTooltip && fabTooltip.classList.add('show'));
    aiFab && aiFab.addEventListener('mouseleave', () => fabTooltip && fabTooltip.classList.remove('show'));

    // Send button → reuse existing window.sendDrawerMessage
    drawerSendBtn && drawerSendBtn.addEventListener('click', function() {
        window.sendDrawerMessage && window.sendDrawerMessage();
    });

    // Enter key in input
    drawerInput && drawerInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            drawerSendBtn && drawerSendBtn.click();
        }
    });

    // Chips
    document.querySelectorAll('#drawerChips .chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
            const text = this.textContent.replace(/^[^\s]+\s/, '');
            if (drawerInput) {
                drawerInput.value = text;
                drawerInput.focus();
            }
            // 不再自动发送，保持抽屉打开
        });
    });

    // AI drawer message helpers
    window.appendAiMsg = function(content, role) {
        const wrap = document.getElementById('drawerMessages');
        if (!wrap) return;
        const now  = new Date();
        const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
        const div  = document.createElement('div');
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
});


        // 页面切换
        function switchPage(pageName) {
            if (!pageName) return;
            
            // 隐藏所有页面
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            // 显示目标页面（带 null 检查）
            const targetPage = document.getElementById('page-' + pageName);
            if (targetPage) {
                targetPage.classList.add('active');
            } else {
                console.warn('[switchPage] Page not found: page-' + pageName);
                return;
            }

            // 更新侧边栏
            document.querySelectorAll('.sidebar-item').forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === pageName) {
                    item.classList.add('active');
                }
            });

            // 初始化图表
            try {
                if (pageName === 'dashboard' && !trendChart) {
                    initTrendChart();
                }
                if (pageName === 'report') {
                    if (!window._reportListInited) { 
                        try { initReportPage(); } catch(e) { console.warn('[switchPage] initReportPage error:', e); }
                        window._reportListInited = 1; 
                    }
                    if (!performanceChart) {
                        try { initPerformanceChart(); } catch(e) { console.warn('[switchPage] initPerformanceChart error:', e); }
                    }
                }
            } catch(e) {
                console.warn('[switchPage] Chart init error:', e);
            }
        }

        // 侧边栏点击
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) switchPage(page);
            });
        });

        // 初始化趋势图表（注意：charts.js 中已有同名函数，此处为增强版，增加了销毁检查）
        function initTrendChart() {
            const ctx = document.getElementById('trendChart');
            if (!ctx) return;

            // 销毁已存在的 Chart 实例，防止 "Canvas is already in use" 错误
            if (typeof trendChart !== 'undefined' && trendChart) {
                trendChart.destroy();
                trendChart = null;
            }

            // 获取当前主题颜色
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
            const textColor = isDark ? '#94a3b8' : '#64748b';
            const gridColor = isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.8)';

            trendChart = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['4/15', '4/16', '4/17', '4/18', '4/19', '4/20', '4/21'],
                    datasets: [{
                        label: '通过率',
                        data: [94, 96, 93, 97, 95, 98, 96.2],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4
                    }, {
                        label: '执行数',
                        data: [32, 45, 38, 52, 48, 55, 48],
                        borderColor: '#10b981',
                        backgroundColor: 'transparent',
                        borderDash: [5, 5],
                        tension: 0.4,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { color: textColor, usePointStyle: true }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: gridColor },
                            ticks: { color: textColor }
                        },
                        y: {
                            grid: { color: gridColor },
                            ticks: { color: textColor, callback: v => v + '%' },
                            min: 80,
                            max: 100
                        },
                        y1: {
                            position: 'right',
                            grid: { display: false },
                            ticks: { color: textColor },
                            min: 0,
                            max: 80
                        }
                    }
                }
            });
        }

        // 初始化性能图表
        function initPerformanceChart() {
            const ctx = document.getElementById('performanceChart');
            if (!ctx) return;

            // 获取当前主题颜色
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
            const textColor = isDark ? '#94a3b8' : '#64748b';
            const gridColor = isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.8)';

            performanceChart = new Chart(ctx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['v2.3.0', 'v2.3.1', 'v2.3.2', 'v2.3.3', 'v2.3.4'],
                    datasets: [{
                        label: '通过率',
                        data: [95, 96.2, 94.5, 97, 98],
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                        borderRadius: 4
                    }, {
                        label: '用例数',
                        data: [320, 328, 315, 340, 350],
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderRadius: 4,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { color: textColor, usePointStyle: true }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: gridColor },
                            ticks: { color: textColor }
                        },
                        y: {
                            grid: { color: gridColor },
                            ticks: { color: textColor, callback: v => v + '%' },
                            min: 90,
                            max: 100
                        },
                        y1: {
                            position: 'right',
                            grid: { display: false },
                            ticks: { color: textColor }
                        }
                    }
                }
            });
        }

        // AI 消息发送
        function sendAiMessage() {
            const input = document.getElementById('aiInput');
            const message = input.value.trim();
            if (!message) return;

            showToast('success', 'AI 处理中', '正在分析你的需求...');
            input.value = '';
        }

        // 快捷提示
        function setPrompt(el) {
            document.getElementById('aiInput').value = el.textContent.replace(/^[^\s]+\s/, '');
        }

        // 输入方式选择
        function selectInputMethod(el, type) {
            document.querySelectorAll('.input-method').forEach(m => m.classList.remove('active'));
            el.classList.add('active');

            const uploadZone = document.getElementById('uploadZone');
            const nlpInput = document.getElementById('nlpInput');

            if (type === 'nlp') {
                uploadZone.style.display = 'none';
                nlpInput.style.display = 'block';
            } else {
                uploadZone.style.display = 'block';
                nlpInput.style.display = 'none';
            }
        }

        // 用例层级选择 - 点击弹出选择器
        document.querySelectorAll('.level-option').forEach(function(option) {
            option.addEventListener('click', function() {
                const level = this.dataset.level;
                openLevelPicker(level);
            });
        });

        // 层级选择器数据配置 (重命名避免与 level-picker.js 冲突)
        const appLevelData = {
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

        // currentLevelType 和 selectedLevelItems 已在 js/level-picker.js 中声明

        // 打开层级选择器
        function openLevelPicker(levelType) {
            currentLevelType = levelType;
            const data = appLevelData[levelType];
            if (!data) return;

            selectedLevelItems = [];

            // 设置标题
            document.getElementById('levelPickerTitle').innerHTML = 
                `<i class="fas ${data.icon}"></i> ${data.title}`;

            // 渲染列表
            const list = document.getElementById('levelPickerList');
            list.innerHTML = data.items.map(item => `
                <div class="level-picker-item" data-id="${item.id}" data-name="${item.name}" onclick="toggleLevelItem(this)">
                    <div class="item-checkbox"></div>
                    <div class="item-icon"><i class="fas ${data.icon}"></i></div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-count">${item.count} 条</div>
                </div>
            `).join('');

            // 清空输入框
            document.getElementById('levelPickerInput').value = '';

            // 显示模态框
            document.getElementById('levelPickerOverlay').classList.add('show');
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
            document.getElementById('levelPickerOverlay').classList.remove('show');
        }

        // 确认选择
        function confirmLevelPicker() {
            const input = document.getElementById('levelPickerInput').value.trim();
            
            // 获取选中的项
            const selected = [...selectedLevelItems];
            
            // 如果有新增的项
            if (input) {
                const newId = 'custom_' + Date.now();
                selected.push({ id: newId, name: input });
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
                    nameSpan.textContent = selected[0].name;
                } else {
                    nameSpan.textContent = `已选 ${selected.length} 项`;
                }
                descSpan.textContent = selected.map(s => s.name).join(', ');
            }

            closeLevelPicker();
            showToast('success', '选择成功', `已选择: ${selected.map(s => s.name).join(', ')}`);
            console.log('选择的层级项:', currentLevelType, selected);
        }

        // 新增按钮点击
        document.getElementById('levelPickerAddBtn').addEventListener('click', function() {
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

        // 回车添加
        document.getElementById('levelPickerInput').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('levelPickerAddBtn').click();
            }
        });

        // 点击遮罩关闭
        document.getElementById('levelPickerOverlay').addEventListener('click', function(e) {
            if (e.target === this) closeLevelPicker();
        });

        // 执行层级选择
        function selectLevel(el) {
            document.querySelectorAll('.level-card').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
        }
        
        // 执行层级选择器相关变量 - 已在 js/execute-level.js 中声明
        
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
            document.getElementById('executeLevelPickerTitle').innerHTML = `<i class="fas ${config.icon}"></i> ${config.title}`;
            
            // 渲染列表
            const list = document.getElementById('executeLevelPickerList');
            list.innerHTML = data.map(item => `
                <div class="level-picker-item" data-id="${item.id}" data-name="${item.name}" onclick="toggleExecuteLevelItem(this)">
                    <div class="item-checkbox"></div>
                    <div class="item-icon"><i class="fas ${config.icon}"></i></div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-count">${item.count} 条</div>
                </div>
            `).join('');
            
            // 清空输入框
            document.getElementById('executeLevelPickerInput').value = '';
            selectedExecuteLevelItems = [];
            
            // 显示模态框
            document.getElementById('executeLevelPickerOverlay').classList.add('show');
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
            document.getElementById('executeLevelPickerOverlay').classList.remove('show');
        }
        
        // 确认执行层级选择
        function confirmExecuteLevelPicker() {
            const input = document.getElementById('executeLevelPickerInput').value.trim();
            
            // 获取选中的项
            const selected = [...selectedExecuteLevelItems];
            
            // 如果有新增的项
            if (input) {
                const newId = 'custom_' + Date.now();
                selected.push({ id: newId, name: input });
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
                    nameEl.textContent = selected[0].name;
                } else {
                    nameEl.textContent = `已选 ${selected.length} 项`;
                }
            }

            closeExecuteLevelPicker();
            showToast('success', '选择成功', `已选择: ${selected.map(s => s.name).join(', ')}`);
            console.log('选择的执行层级项:', currentExecuteLevelType, selected);
        }
        
        // 执行层级选择器新增按钮
        document.getElementById('executeLevelPickerAddBtn').addEventListener('click', function() {
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
        
        // 执行层级选择器回车添加
        document.getElementById('executeLevelPickerInput').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('executeLevelPickerAddBtn').click();
            }
        });
        
        // 执行层级选择器点击遮罩关闭
        document.getElementById('executeLevelPickerOverlay').addEventListener('click', function(e) {
            if (e.target === this) closeExecuteLevelPicker();
        });

        // 生成用例
        function generateCases() {
            showToast('success', 'AI 生成中', '正在分析需求并生成测试用例...');

            setTimeout(() => {
                showToast('success', '生成完成', '已生成 28 条测试用例，请前往审核');
            }, 2000);
        }

        // Toast 通知
        function showToast(type, title, message) {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;

            const icons = {
                success: 'fa-check-circle',
                error: 'fa-times-circle',
                warning: 'fa-exclamation-triangle'
            };

            toast.innerHTML = `
                <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
                <div class="toast-content">
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
            `;

            container.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // 模态框
        // showModal(title, content, [buttons])
        // buttons 可选: [{text, cls, action, danger}]
        window.showModal = function(title, content, buttons) {
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalBody').innerHTML = content;
            var footer = document.getElementById('modalBody').nextElementSibling;
            if (!footer || !footer.classList.contains('modal-footer')) {
                // 通用 modal 没有独立 footer，在 body 末尾追加按钮
                if (buttons && buttons.length) {
                    var btnHtml = '<div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;padding-top:16px;border-top:1px solid var(--border);">';
                    for (var i = 0; i < buttons.length; i++) {
                        var b = buttons[i];
                        btnHtml += '<button class="btn ' + (b.cls || 'btn-secondary') + '" style="' + (b.danger ? 'color:var(--danger);border-color:var(--danger);' : '') + '" onclick="hideModal();' + (b.action || '') + '">' + b.text + '</button>';
                    }
                    btnHtml += '</div>';
                    document.getElementById('modalBody').innerHTML += btnHtml;
                }
            }
            document.getElementById('modalOverlay').classList.add('show');
        };

        function hideModal() {
            document.getElementById('modalOverlay').classList.remove('show');
        }

        document.getElementById('modalOverlay').addEventListener('click', function(e) {
            if (e.target === this) hideModal();
        });

        // ═══════════════════════════════════════════
        // 新建定时任务弹窗逻辑
        // ═══════════════════════════════════════════

        // 定时任务状态
        let scheduleCurrentLevel = 'system';
        let scheduleSelectedTargets = [];

        // 层级对应的图标和目标数据
        const scheduleLevelMeta = {
            system:  { icon: 'fa-globe', label: '选择系统' },
            module:  { icon: 'fa-cube',   label: '选择模块' },
            function:{ icon: 'fa-file-code', label: '选择功能' },
            case:    { icon: 'fa-list-ul', label: '选择用例' },
            api:     { icon: 'fa-plug',    label: '选择接口' }
        };

        // 打开新建定时任务弹窗
        window.showAddScheduleModal = function() {
            // 重置状态
            scheduleCurrentLevel = 'system';
            scheduleSelectedTargets = [];
            document.getElementById('scheduleNameInput').value = '';
            document.getElementById('scheduleRemarkInput').value = '';
            document.getElementById('scheduleTimeInput').value = '02:00';
            document.getElementById('scheduleFreqSelect').value = 'daily';
            document.getElementById('notifyOnSuccess').checked = true;
            document.getElementById('notifyOnFail').checked = true;

            // 重置层级卡片选中状态
            document.querySelectorAll('.schedule-level-card').forEach(card => {
                card.classList.toggle('active', card.dataset.level === 'system');
            });

            // 渲染目标列表
            renderScheduleTargets('system');

            // 隐藏频率额外选项
            handleFreqChange('daily');

            // 显示弹窗
            document.getElementById('scheduleModalOverlay').classList.add('show');
        };

        // 关闭弹窗
        window.hideScheduleModal = function() {
            document.getElementById('scheduleModalOverlay').classList.remove('show');
        };

        // 点击遮罩关闭
        document.getElementById('scheduleModalOverlay')?.addEventListener('click', function(e) {
            if (e.target === this) hideScheduleModal();
        });

        // 选择测试层级
        window.selectScheduleLevel = function(el) {
            document.querySelectorAll('.schedule-level-card').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            scheduleCurrentLevel = el.dataset.level;
            scheduleSelectedTargets = [];
            renderScheduleTargets(scheduleCurrentLevel);
        };

        // 渲染目标列表
        function renderScheduleTargets(levelType) {
            const data = levelData[levelType];
            if (!data) return;

            const meta = scheduleLevelMeta[levelType];
            const labelEl = document.getElementById('scheduleTargetLabel');
            if (labelEl) {
                labelEl.innerHTML = `<i class="fas ${meta.icon}"></i> ${meta.label}`;
            }

            const listEl = document.getElementById('scheduleTargetList');
            if (!listEl) return;

            listEl.innerHTML = data.items.map(item => `
                <div class="schedule-target-item" 
                     data-id="${item.id}" 
                     data-name="${item.name}" 
                     onclick="toggleScheduleTarget(this)">
                    <div class="target-check"></div>
                    <div class="target-info">
                        <div class="target-name">${item.name}</div>
                        <div class="target-count">${item.count} 条</div>
                    </div>
                </div>
            `).join('');

            // 默认全选
            setTimeout(() => {
                listEl.querySelectorAll('.schedule-target-item').forEach(item => item.classList.add('selected'));
                scheduleSelectedTargets = data.items.map(i => ({ id: i.id, name: i.name }));
            }, 0);
        };

        // 切换目标选中
        window.toggleScheduleTarget = function(el) {
            el.classList.toggle('selected');
            const id = el.dataset.id;
            const name = el.dataset.name;

            if (el.classList.contains('selected')) {
                scheduleSelectedTargets.push({ id, name });
            } else {
                scheduleSelectedTargets = scheduleSelectedTargets.filter(t => t.id !== id);
            }
        };

        // 频率变化处理
        window.handleFreqChange = function(value) {
            const extraEl = document.getElementById('scheduleFreqExtra');
            if (!extraEl) return;

            let html = '';
            switch(value) {
                case 'weekly':
                    html = `
                        <select class="form-select" id="scheduleWeekDay" style="width: auto;">
                            <option value="1">周一</option><option value="2">周二</option>
                            <option value="3">周三</option><option value="4" selected>周四</option>
                            <option value="5">周五</option><option value="6">周六</option><option value="0">周日</option>
                        </select>
                        <span style="color: var(--text-secondary); font-size: 13px; margin-left: 8px;">执行</span>
                    `;
                    break;
                case 'monthly':
                    html = `
                        每月第
                        <input type="number" class="form-input" id="scheduleMonthDay" style="width: 70px; display: inline-block;" min="1" max="28" value="1">
                        日执行
                    `;
                    break;
                case 'interval':
                    html = `
                        每
                        <input type="number" class="form-input" id="scheduleIntervalHours" style="width: 70px; display: inline-block;" min="1" max="168" value="6">
                        小时执行一次
                    `;
                    break;
            }
            extraEl.innerHTML = html;
            extraEl.style.display = html ? 'block' : 'none';
        };

        // 提交定时任务
        window.submitScheduleTask = function() {
            const name = document.getElementById('scheduleNameInput').value.trim();
            if (!name) {
                showToast('warning', '请填写名称', '请输入定时任务名称');
                return;
            }

            if (scheduleSelectedTargets.length === 0) {
                showToast('warning', '请选择目标', '请至少选择一个执行目标');
                return;
            }

            const time = document.getElementById('scheduleTimeInput').value;
            const freq = document.getElementById('scheduleFreqSelect').value;
            const remark = document.getElementById('scheduleRemarkInput').value.trim();

            // 构建频率描述文本
            let freqText = '';
            switch(freq) {
                case 'daily': freqText = `每天 ${time}`; break;
                case 'weekly':
                    const weekDays = ['日','一','二','三','四','五','六'];
                    const dayEl = document.getElementById('scheduleWeekDay');
                    freqText = `每周${weekDays[dayEl?.value || 4]} ${time}`;
                    break;
                case 'monthly':
                    const mDay = document.getElementById('scheduleMonthDay')?.value || '1';
                    freqText = `每月${mDay}日 ${time}`;
                    break;
                case 'interval':
                    const hours = document.getElementById('scheduleIntervalHours')?.value || '6';
                    freqText = `每${hours}小时`;
                    break;
            }

            // 构建层级显示文本
            const levelNames = { system:'系统级', module:'模块级', function:'功能级', case:'用例级', api:'接口级' };
            const levelName = levelNames[scheduleCurrentLevel] || scheduleCurrentLevel;

            // 目标名称（超过3个显示数量）
            const targetText = scheduleSelectedTargets.length <= 3
                ? scheduleSelectedTargets.map(t => t.name).join(', ')
                : `${scheduleSelectedTargets.slice(0,2).map(t=>t.name).join(', ')} 等${scheduleSelectedTargets.length}项`;

            // 随机图标
            const emojis = ['📅','🚀','🔍','📊','🤖','⚡','🔄'];
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];

            // 创建新任务卡片
            const newCard = document.createElement('div');
            newCard.className = 'schedule-card';
            newCard.innerHTML = `
                <div class="schedule-info">
                    <div class="schedule-name">${emoji} ${name}</div>
                    <div class="schedule-meta">
                        <span><i class="fas fa-${freq==='daily'||freq==='interval'?'clock':'calendar'}"></i> ${freqText}</span>
                        <span><i class="fas fa-layer-group"></i> ${levelName}</span>
                        <span><i class="fas fa-cube"></i> ${targetText}</span>
                    </div>
                </div>
                <div class="schedule-actions">
                    <span style="font-size: 12px; color: var(--text-secondary); margin-right: 12px;">下次执行: 即将执行</span>
                    <div class="toggle-switch active"></div>
                </div>
            `;

            // 绑定开关事件
            const toggleSwitch = newCard.querySelector('.toggle-switch');
            if (toggleSwitch) {
                toggleSwitch.addEventListener('click', () => toggleSwitch.classList.toggle('active'));
            }

            // 插入到列表顶部
            const cardContainer = document.querySelector('#page-schedule .card');
            if (cardContainer) {
                cardContainer.insertBefore(newCard, cardContainer.firstChild);
            }

            hideScheduleModal();
            showToast('success', '创建成功', `定时任务「${name}」已创建，将在 ${freqText} 执行`);
        };

        // ═══════════════════════════════════════════
        //  添加节点模态框
        // ═══════════════════════════════════════════

        // 节点数据存储
        var envNodeData = [
            { id: 1, name: 'test-node-01', ip: '192.168.1.101', env: '测试环境', status: '在线', cpu: '45%', mem: '62%', tasks: 3 },
            { id: 2, name: 'test-node-02', ip: '192.168.1.102', env: '测试环境', status: '在线', cpu: '78%', mem: '85%', tasks: 8 },
            { id: 3, name: 'test-node-03', ip: '192.168.1.103', env: '预发布',     status: '在线', cpu: '32%', mem: '48%', tasks: 2 },
            { id: 4, name: 'test-node-04', ip: '192.168.1.104', env: '测试环境', status: '维护中', cpu: '-',    mem: '-',    tasks: '-' }
        ];
        var nodeIdCounter = 5;

        window.showAddNodeModal = function() {
            document.getElementById('nodeModalTitle').textContent = '添加执行节点';
            document.getElementById('nodeModalBtnText').textContent = '确认添加';
            document.getElementById('editNodeId').value = '';
            // 清空表单
            document.getElementById('nodeNameInput').value = '';
            document.getElementById('nodeIpInput').value = '';
            document.getElementById('nodeEnvSelect').selectedIndex = 0;
            document.getElementById('nodePortInput').value = '8080';
            document.getElementById('nodeOsSelect').selectedIndex = 0;
            document.getElementById('nodeTagInput').value = '';
            document.getElementById('nodeRemarkInput').value = '';

            var overlay = document.getElementById('nodeModalOverlay');
            overlay.classList.add('show');
            // 聚焦第一个输入框
            setTimeout(function() {
                document.getElementById('nodeNameInput').focus();
            }, 100);
        };

        window.hideNodeModal = function() {
            document.getElementById('nodeModalOverlay').classList.remove('show');
        };

        // 点击遮罩关闭
        (function() {
            var overlay = document.getElementById('nodeModalOverlay');
            if (overlay) {
                overlay.addEventListener('click', function(e) {
                    if (e.target === this) hideNodeModal();
                });
            }
        })();

        window.saveNode = function() {
            var name   = document.getElementById('nodeNameInput').value.trim();
            var ip     = document.getElementById('nodeIpInput').value.trim();
            var env    = document.getElementById('nodeEnvSelect').value;
            var port   = document.getElementById('nodePortInput').value.trim();
            var os     = document.getElementById('nodeOsSelect').value;
            var tag    = document.getElementById('nodeTagInput').value.trim();
            var remark = document.getElementById('nodeRemarkInput').value.trim();
            var editId = document.getElementById('editNodeId').value;

            // 校验必填字段
            if (!name) {
                showToast('warning', '请填写节点名称', '节点名称不能为空');
                document.getElementById('nodeNameInput').focus();
                return;
            }
            if (!ip) {
                showToast('warning', '请填写 IP 地址', 'IP 地址不能为空');
                document.getElementById('nodeIpInput').focus();
                return;
            }

            // 简单 IP 格式校验
            var ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
            if (!ipPattern.test(ip)) {
                showToast('warning', 'IP 格式不正确', '请输入合法的 IPv4 地址，如 192.168.1.105');
                document.getElementById('nodeIpInput').focus();
                return;
            }

            var tbody = document.querySelector('#page-environment .task-table tbody');

            if (editId) {
                // 编辑模式：更新已有行
                for (var i = 0; i < envNodeData.length; i++) {
                    if (envNodeData[i].id == editId) {
                        envNodeData[i].name = name;
                        envNodeData[i].ip = ip;
                        envNodeData[i].env = env;
                        break;
                    }
                }
                renderEnvTable(tbody);
                hideNodeModal();
                showToast('success', '更新成功', '节点「' + name + '」信息已更新');
            } else {
                // 新增模式：插入数据 + 表格行
                var newNode = {
                    id: nodeIdCounter++,
                    name: name,
                    ip: ip,
                    env: env,
                    status: '离线',
                    cpu: '-',
                    mem: '-',
                    tasks: 0
                };
                envNodeData.push(newNode);

                // 环境状态映射
                var envClassMap = {
                    '测试环境': 'info',
                    '预发布': 'warning',
                    '生产环境': 'danger',
                    '开发环境': ''
                };
                var envClass = envClassMap[env] || '';

                // 创建新表格行
                var tr = document.createElement('tr');
                tr.style.animation = 'fadeInUp 0.3s ease';
                tr.innerHTML =
                    '<td style="font-weight: 500;">' + escapeHtml(name) + '</td>' +
                    '<td>' + escapeHtml(ip) + '</td>' +
                    '<td><span class="status-badge ' + envClass + '">' + escapeHtml(env) + '</span></td>' +
                    '<td><span class="status-badge">离线</span></td>' +
                    '<td>—</td><td>—</td><td>0</td>' +
                    '<td><button class="btn btn-secondary" onclick="manageNode(this)" style="padding: 4px 8px; font-size: 11px;">管理</button></td>';

                tr.dataset.nodeId = newNode.id;
                tbody.appendChild(tr);

                // 更新统计卡片
                updateEnvStats();

                hideNodeModal();
                showToast('success', '添加成功', '节点「' + name + '」(' + ip + ') 已添加，当前状态为离线，等待连接');
            }
        };

        // 渲染环境表格（编辑后刷新用）
        function renderEnvTable(tbody) {
            if (!tbody) tbody = document.querySelector('#page-environment .task-table tbody');
            if (!tbody) return;
            tbody.innerHTML = '';
            var envClassMap = { '测试环境': 'info', '预发布': 'warning', '生产环境': 'danger', '开发环境': '' };
            for (var i = 0; i < envNodeData.length; i++) {
                var n = envNodeData[i];
                var ec = envClassMap[n.env] || '';
                var sc = n.status === '在线' ? 'success' : (n.status === '维护中' ? 'warning' : '');
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td style="font-weight: 500;">' + escapeHtml(n.name) + '</td>' +
                    '<td>' + escapeHtml(n.ip) + '</td>' +
                    '<td><span class="status-badge ' + ec + '">' + escapeHtml(n.env) + '</span></td>' +
                    '<td><span class="status-badge ' + sc + '">' + escapeHtml(n.status) + '</span></td>' +
                    '<td>' + (n.cpu || '—') + '</td><td>' + (n.mem || '—') + '</td><td>' + (n.tasks || '—') + '</td>' +
                    '<td><button class="btn btn-secondary" onclick="manageNode(this)" style="padding: 4px 8px; font-size: 11px;">管理</button></td>';
                tbody.appendChild(tr);
            }
        }

        // 更新环境页面统计数字
        function updateEnvStats() {
            var onlineCount = 0;
            var taskTotal = 0;
            for (var i = 0; i < envNodeData.length; i++) {
                if (envNodeData[i].status === '在线') onlineCount++;
                var t = parseInt(envNodeData[i].tasks);
                if (!isNaN(t)) taskTotal += t;
            }

            var statCards = document.querySelectorAll('#page-environment .stat-card');
            if (statCards.length >= 2) {
                var valEl = statCards[0].querySelector('.stat-value');
                if (valEl) valEl.textContent = envNodeData.length;
                valEl = statCards[1].querySelector('.stat-value');
                if (valEl) valEl.textContent = taskTotal;
            }
        }

        // 管理按钮操作（弹出操作菜单）
        window.manageNode = function(btn) {
            var tr = btn.closest('tr');
            if (!tr) return;
            var nodeName = tr.cells[0].textContent;
            showModal(
                '节点管理 — ' + nodeName,
                '<div style="display:flex;flex-direction:column;gap:10px;">' +
                '<button class="btn btn-secondary" style="width:100%;justify-content:center;" onclick="nodeAction(\'connect\',\'' + nodeName + '\')"><i class="fas fa-plug"></i> 连接节点</button>' +
                '<button class="btn btn-secondary" style="width:100%;justify-content:center;" onclick="nodeAction(\'refresh\',\'' + nodeName + '\')"><i class="fas fa-sync"></i> 刷新状态</button>' +
                '<button class="btn btn-secondary" style="width:100%;justify-content:center;" onclick="nodeAction(\'edit\',\'' + nodeName + '\')"><i class="fas fa-edit"></i> 编辑信息</button>' +
                '<button class="btn btn-secondary" style="width:100%;justify-content:center;color:var(--danger);border-color:var(--danger);" onclick="nodeAction(\'delete\',\'' + nodeName + '\')"><i class="fas fa-trash"></i> 删除节点</button>' +
                '</div>'
            );
        };

        window.nodeAction = function(action, nodeName) {
            hideModal();
            switch(action) {
                case 'connect':
                    showToast('info', '连接中', '正在尝试连接节点「' + nodeName + '」...');
                    setTimeout(function() {
                        showToast('success', '连接成功', '已成功连接到「' + nodeName + '」');
                    }, 1200);
                    break;
                case 'refresh':
                    showToast('success', '刷新完成', '节点「' + nodeName + '」状态已更新');
                    break;
                case 'edit':
                    // 找到对应数据并回填表单
                    var target = null;
                    for (var i = 0; i < envNodeData.length; i++) {
                        if (envNodeData[i].name === nodeName) { target = envNodeData[i]; break; }
                    }
                    if (target) {
                        document.getElementById('editNodeId').value = target.id;
                        document.getElementById('nodeNameInput').value = target.name;
                        document.getElementById('nodeIpInput').value = target.ip;
                        document.getElementById('nodeEnvSelect').value = target.env;
                        document.getElementById('nodeModalTitle').textContent = '编辑节点';
                        document.getElementById('nodeModalBtnText').textContent = '保存修改';
                        document.getElementById('nodeModalOverlay').classList.add('show');
                    }
                    break;
                case 'delete':
                    showModal('确认删除',
                        '<p>确定要删除节点 <strong>' + nodeName + '</strong> 吗？此操作不可恢复。</p>',
                        [{ text: '取消', cls: 'btn-secondary', action: 'hideModal()' },
                         { text: '删除', cls: 'btn-primary', action: "confirmDeleteNode('" + nodeName + "')", danger: true }]
                    );
                    break;
            }
        };

        window.confirmDeleteNode = function(nodeName) {
            hideModal();
            envNodeData = envNodeData.filter(function(n) { return n.name !== nodeName; });
            renderEnvTable();
            updateEnvStats();
            showToast('success', '删除成功', '节点「' + nodeName + '」已被移除');
        };

        // HTML 转义工具函数
        function escapeHtml(str) {
            if (!str) return '';
            var div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        // 刷新环境节点状态
        window.refreshEnvNodes = function() {
            var btn = document.querySelector('#page-environment .btn-primary');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 刷新中...';
            }
            setTimeout(function() {
                // 模拟：随机更新在线节点的 CPU/内存
                for (var i = 0; i < envNodeData.length; i++) {
                    if (envNodeData[i].status === '在线') {
                        envNodeData[i].cpu = Math.floor(Math.random() * 70 + 10) + '%';
                        envNodeData[i].mem = Math.floor(Math.random() * 60 + 30) + '%';
                    }
                }
                renderEnvTable();
                updateEnvStats();
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-sync"></i> 刷新状态';
                }
                showToast('success', '刷新完成', '所有节点状态已更新');
            }, 800);
        };

        // ═══════════════════════════════════════════
        //  项目列表：新建项目 + 筛选
        // ═══════════════════════════════════════════

        // 项目数据
        var projectData = [
            { id: 1, name: '用户管理系统',  desc: '包含用户注册、登录、个人中心等核心功能测试', type: 'web',   status: 'active',   icon: '👤', color: 'blue',   cases: 328, passRate: '96%', defects: 12 },
            { id: 2, name: '订单中心',       desc: '订单创建、支付、退款全链路测试',               type: 'web',   status: 'active',   icon: '🛒', color: 'green',  cases: 256, passRate: '98%', defects: 5 },
            { id: 3, name: '支付中心',       desc: '支付宝、微信、银联等多渠道支付测试',             type: 'web',   status: 'active',   icon: '💳', color: 'orange', cases: 189, passRate: '100%', defects: 0 },
            { id: 4, name: '移动端 App',     desc: 'iOS/Android 双端核心流程测试',                 type: 'app',   status: 'planning', icon: '📱', color: 'purple', cases: 0,   passRate: '--',   defects: 0 },
            { id: 5, name: 'API 网关',       desc: '接口自动化测试与性能压测',                     type: 'api',   status: 'active',   icon: '🔌', color: 'blue',   cases: 420, passRate: '99%', defects: 3 },
            { id: 6, name: '数据分析平台',   desc: '报表生成、数据导出功能测试',                   type: 'web',   status: 'planning', icon: '📊', color: 'green',  cases: 156, passRate: '--',   defects: 8 }
        ];
        var projectIdCounter = 7;

        // 图标选择状态
        var selectedProjectIcon = '📦';
        var selectedIconColor = 'blue';

        // ─── 筛选栏展开/收起 ───
        window.toggleProjectFilter = function() {
            var bar = document.getElementById('projectFilterBar');
            var btn = document.getElementById('projectFilterToggle');
            var isHidden = bar.style.display === 'none' || bar.style.display === '';
            bar.style.display = isHidden ? 'block' : 'none';
            btn.classList.toggle('active', isHidden);
        };

        // ─── 新建项目弹窗 ───
        window.showAddProjectModal = function() {
            // 重置表单
            document.getElementById('projNameInput').value = '';
            document.getElementById('projDescInput').value = '';
            document.getElementById('projTypeSelect').selectedIndex = 0;
            document.getElementById('projStatusSelect').selectedIndex = 1; // 默认"进行中"
            document.getElementById('projRemarkInput').value = '';

            // 重置图标选择为默认第一个
            resetProjectIconPicker();

            document.getElementById('projectModalTitle').textContent = '新建项目';
            var overlay = document.getElementById('projectModalOverlay');
            overlay.classList.add('show');
            setTimeout(function() {
                document.getElementById('projNameInput').focus();
            }, 100);
        };

        window.hideProjectModal = function() {
            document.getElementById('projectModalOverlay').classList.remove('show');
        };

        (function() {
            var overlay = document.getElementById('projectModalOverlay');
            if (overlay) overlay.addEventListener('click', function(e) { if (e.target === this) hideProjectModal(); });
        })();

        // ─── 图标选择器 ───
        window.selectProjectIcon = function(el) {
            document.querySelectorAll('#projectIconPicker .icon-option').forEach(function(o) { o.classList.remove('active'); });
            el.classList.add('active');
            selectedProjectIcon = el.dataset.icon;
            selectedIconColor = el.dataset.color || 'blue';
        };

        function resetProjectIconPicker() {
            selectedProjectIcon = '📦';
            selectedIconColor = 'blue';
            document.querySelectorAll('#projectIconPicker .icon-option').forEach(function(o) {
                o.classList.remove('active');
                if (o.dataset.icon === '📦') o.classList.add('active');
            });
        }

        // ─── 保存项目 ───
        window.saveProject = function() {
            var name   = document.getElementById('projNameInput').value.trim();
            var desc   = document.getElementById('projDescInput').value.trim();
            var type   = document.getElementById('projTypeSelect').value;
            var status = document.getElementById('projStatusSelect').value;
            var remark = document.getElementById('projRemarkInput').value.trim();

            // 校验
            if (!name) {
                showToast('warning', '请填写项目名称', '项目名称不能为空');
                document.getElementById('projNameInput').focus();
                return;
            }

            // 类型映射到中文
            var typeLabelMap = { web: 'Web 应用', app: '移动端 App', api: 'API / 接口', miniapp: '小程序', desktop: '桌面应用' };
            var typeIcons = { web: ['🌐','📦','⚙️'], app: ['📱','📲'], api: ['🔌','🔗'], miniapp: ['💬','📱'], desktop: ['💻'] };
            var statusLabelMap = { active: '进行中', planning: '规划中', paused: '已暂停' };

            var newProj = {
                id: projectIdCounter++,
                name: name,
                desc: desc || '暂无描述',
                type: type,
                status: status,
                icon: selectedProjectIcon,
                color: selectedIconColor,
                cases: 0,
                passRate: status === 'active' ? '100%' : '--',
                defects: 0
            };

            projectData.push(newProj);

            // 渲染新卡片
            renderProjectCard(newProj);

            hideProjectModal();
            showToast('success', '创建成功', '项目「' + name + '」已创建，可以开始添加用例了');

            // 如果当前有筛选，重新应用（新项目可能不符合筛选条件）
            applyProjectFilter();
        };

        // 渲染单个项目卡片
        function renderProjectCard(proj, prepend) {
            var grid = document.getElementById('projectGrid');

            var statusClass = proj.status === 'active' ? 'active' : (proj.status === 'planning' ? 'planning' : '');
            var statusText = { active: '进行中', planning: '规划中', paused: '已暂停', archived: '已归档' }[proj.status] || proj.status;

            var card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.projId = proj.id;
            card.dataset.projName = proj.name.toLowerCase();
            card.dataset.projStatus = proj.status;
            card.dataset.projType = proj.type;
            card.dataset.projDesc = (proj.desc || '').toLowerCase();

            if (prepend) card.style.animation = 'fadeInUp 0.4s ease';

            card.innerHTML =
                '<div class="project-header">' +
                    '<div class="project-icon ' + (proj.color || 'blue') + '">' + (proj.icon || '📦') + '</div>' +
                    '<span class="project-status ' + statusClass + '">' + statusText + '</span>' +
                '</div>' +
                '<div class="project-name">' + escapeHtml(proj.name) + '</div>' +
                '<div class="project-desc">' + escapeHtml(proj.desc || '暂无描述') + '</div>' +
                '<div class="project-stats">' +
                    '<div class="project-stat"><div class="project-stat-value">' + proj.cases + '</div><div class="project-stat-label">用例数</div></div>' +
                    '<div class="project-stat"><div class="project-stat-value" style="color:' + (proj.passRate !== '--' ? 'var(--success)' : 'var(--text-secondary)') + ';">' + proj.passRate + '</div><div class="project-stat-label">通过率</div></div>' +
                    '<div class="project-stat"><div class="project-stat-value">' + proj.defects + '</div><div class="project-stat-label">缺陷</div></div>' +
                '</div>';

            // 点击卡片进入详情或提示
            card.addEventListener('click', function() {
                showToast('info', proj.name, '正在打开「' + proj.name + '」项目详情...');
            });

            if (prepend && grid.firstChild) {
                grid.insertBefore(card, grid.firstChild);
            } else {
                grid.appendChild(card);
            }

            return card;
        }

        // ─── 项目筛选逻辑 ───
        window.applyProjectFilter = function() {
            var keyword = document.getElementById('projFilterKeyword').value.trim().toLowerCase();
            var status  = document.getElementById('projFilterStatus').value;
            var type    = document.getElementById('projFilterType').value;

            var cards = document.querySelectorAll('#page-projects .project-card');
            var visibleCount = 0;

            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                var show = true;

                if (keyword) {
                    var nameMatch = (card.dataset.projName || '').indexOf(keyword) >= 0;
                    var descMatch = (card.dataset.projDesc || '').indexOf(keyword) >= 0;
                    if (!nameMatch && !descMatch) show = false;
                }
                if (status && card.dataset.projStatus !== status) show = false;
                if (type && card.dataset.projType !== type) show = false;

                card.style.display = show ? '' : 'none';
                if (show) visibleCount++;
            }

            // 处理空结果
            removeProjectEmptyState();
            if (visibleCount === 0 && projectData.length > 0) {
                showProjectEmptyState();
            }
        };

        window.resetProjectFilter = function() {
            document.getElementById('projFilterKeyword').value = '';
            document.getElementById('projFilterStatus').selectedIndex = 0;
            document.getElementById('projFilterType').selectedIndex = 0;
            applyProjectFilter();
            showToast('info', '筛选已重置', '显示全部项目');
        };

        function showProjectEmptyState() {
            var grid = document.getElementById('projectGrid');
            var empty = document.createElement('div');
            empty.className = 'project-empty';
            empty.id = 'projectEmptyTip';
            empty.innerHTML = '<i class="fas fa-search"></i><p>没有找到匹配的项目<br><span style="font-size:13px;color:var(--text-muted);">尝试调整筛选条件或关键词</span></p>';
            grid.appendChild(empty);
        }

        function removeProjectEmptyState() {
            var tip = document.getElementById('projectEmptyTip');
            if (tip) tip.remove();
        }

        // 初始化时给现有卡片加上 dataset 属性（用于筛选）
        function initProjectCardDatasets() {
            var cards = document.querySelectorAll('#page-projects .project-card');
            for (var i = 0; i < Math.min(cards.length, projectData.length); i++) {
                var p = projectData[i];
                cards[i].dataset.projId = p.id;
                cards[i].dataset.projName = (p.name || '').toLowerCase();
                cards[i].dataset.projStatus = p.status;
                cards[i].dataset.projType = p.type;
                cards[i].dataset.projDesc = (p.desc || '').toLowerCase();
            }
        }

        // 页面切换到项目列表时初始化
        var _origSwitchPage = window.switchPage;
        window.switchPage = function(pageName) {
            _origSwitchPage(pageName);
            if (pageName === 'projects') {
                setTimeout(function() { initProjectCardDatasets(); }, 50);
            }
        };

        // ═══════════════════════════════════════════
        // 测试截图画廊逻辑
        // ═══════════════════════════════════════════

        const screenshotsData = [
            { name: '登录流程 - 成功场景', status: '通过', time: '08:32:15', icon: 'fa-sign-in-alt' },
            { name: '注册流程 - 手机号注册', status: '通过', time: '08:33:42', icon: 'fa-user-plus' },
            { name: '仪表盘 - 数据加载验证', status: '通过', time: '08:35:01', icon: 'fa-tachometer-alt' },
            { name: '订单列表 - 分页功能', status: '通过', time: '08:36:28', icon: 'fa-shopping-cart' },
            { name: '支付页面 - 支付流程',   status: '异常', time: '08:38:55', icon: 'fa-credit-card' },
            { name: '个人中心 - 信息修改',    status: '通过', time: '08:40:12', icon: 'fa-user-edit' }
        ];

        let lightboxCurrentIndex = 0;

        // 切换缩略图选中
        window.switchScreenshot = function(el, index) {
            document.querySelectorAll('.screenshot-thumb').forEach(t => t.classList.remove('active'));
            el.classList.add('active');
            lightboxCurrentIndex = index;
            updateMainScreenshot(index);
        };

        // 更新主图区域（模拟切换效果）
        function updateMainScreenshot(index) {
            const data = screenshotsData[index];
            if (!data) return;

            const mainWrap = document.querySelector('.screenshot-main .screenshot-placeholder');
            if (mainWrap) {
                mainWrap.style.display = 'flex';
                mainWrap.querySelector('.placeholder-icon').innerHTML = `<i class="fas ${data.icon}"></i>`;
                mainWrap.querySelector('.placeholder-text').textContent = data.name.split(' - ')[0];
            }
        }

        // 打开灯箱
        window.openScreenshotLightbox = function(index) {
            if (index === -1) index = 0; // 点击"+N"时显示全部从第一张开始

            lightboxCurrentIndex = index;
            const lb = document.getElementById('screenshotLightbox');
            if (lb) lb.classList.add('show');

            renderLightboxImage(index);
            document.body.style.overflow = 'hidden';
        };

        // 关闭灯箱
        window.closeScreenshotLightbox = function() {
            const lb = document.getElementById('screenshotLightbox');
            if (lb) lb.classList.remove('show');
            document.body.style.overflow = '';
        };

        // 灯箱导航
        window.navigateLightbox = function(dir) {
            lightboxCurrentIndex += dir;
            if (lightboxCurrentIndex < 0) lightboxCurrentIndex = screenshotsData.length - 1;
            if (lightboxCurrentIndex >= screenshotsData.length) lightboxCurrentIndex = 0;
            renderLightboxImage(lightboxCurrentIndex);
        };

        // 渲染灯箱图片
        function renderLightboxImage(index) {
            const data = screenshotsData[index];
            if (!data) return;

            const wrap = document.getElementById('lightboxImageWrap');
            const infoEl = document.getElementById('lightboxInfo');
            const counterEl = document.getElementById('lightboxCounter');

            if (wrap) {
                wrap.innerHTML = `
                    <div class="lightbox-placeholder-large">
                        <i class="fas ${data.icon}"></i>
                        <span>${data.name}</span>
                    </div>
                `;
            }

            if (infoEl) {
                const statusColor = data.status === '异常' ? '#ef4444' : '#22c55e';
                infoEl.innerHTML = `<strong>${data.name}</strong> &nbsp;&nbsp;|&nbsp;&nbsp; 
                    状态: <span style="color:${statusColor}">${data.status}</span> &nbsp;&nbsp;
                    |&nbsp;&nbsp; 时间: ${data.time} &nbsp;&nbsp; |&nbsp;&nbsp; 1920×1080`;
            }

            if (counterEl) {
                counterEl.textContent = `${index + 1} / ${screenshotsData.length}`;
            }
        }

        // ESC 关闭 / 键盘左右导航
        document.addEventListener('keydown', function(e) {
            const lb = document.getElementById('screenshotLightbox');
            if (lb && lb.classList.contains('show')) {
                if (e.key === 'Escape') closeScreenshotLightbox();
                if (e.key === 'ArrowLeft') navigateLightbox(-1);
                if (e.key === 'ArrowRight') navigateLightbox(1);
            }
        });

        // 点击遮罩关闭
        document.getElementById('screenshotLightbox')?.addEventListener('click', function(e) {
            if (e.target === this) closeScreenshotLightbox();
        });

        // ═══════════════════════════════════════════
        // 测试结果查看详情弹窗逻辑
        // ═══════════════════════════════════════════

        // 模拟测试用例数据（根据不同任务生成）
        function generateCaseData(taskName, passCount, totalCount, status) {
            const total = parseInt(totalCount);
            const passed = parseInt(passCount);
            const failed = Math.max(0, total - passed);
            const modules = [
                { name: '用户登录模块', cases: ['正常登录验证', '错误密码提示', '账号不存在处理', '登录超时重试'] },
                { name: '用户注册模块', cases: ['手机号格式校验', '邮箱注册流程', '验证码发送与验证', '重复注册拦截', '协议勾选检查'] },
                { name: '订单管理模块', cases: ['创建新订单', '订单列表分页', '订单搜索过滤', '订单状态流转', '取消订单操作'] },
                { name: '支付流程模块', cases: ['支付宝支付回调', '微信支付集成', '余额扣减验证', '支付超时处理', '退款流程测试'] },
                { name: '接口测试模块', cases: ['GET /api/user/info', 'POST /api/user/login', 'PUT /api/user/profile', 'DELETE /api/session'] }
            ];

            let allCases = [];
            let caseIdx = 1;

            modules.forEach((mod, mi) => {
                mod.cases.forEach((caseName, ci) => {
                    if (allCases.length >= total) return;
                    // 根据通过率分布失败用例
                    const isFail = allCases.length < failed && ((mi + ci * 2) % (Math.max(1, Math.floor(total / failed))) === 0);
                    const isSkip = !isFail && allCases.length > passed + 3 && Math.random() < 0.15;

                    allCases.push({
                        id: `TC_${String(caseIdx++).padStart(3,'0')}`,
                        module: mod.name,
                        name: caseName,
                        status: isFail ? 'fail' : (isSkip ? 'skip' : 'pass'),
                        duration: (0.5 + Math.random() * 4).toFixed(1),
                        error: isFail ? `断言失败: 期望值 "${ci % 2 === 0 ? 'success' : '200'}" 但实际为 "error"` : null
                    });
                });
            });

            // 补齐数量
            while (allCases.length < total) {
                const rMod = modules[Math.floor(Math.random() * modules.length)];
                allCases.push({
                    id: `TC_${String(caseIdx++).padStart(3,'0')}`,
                    module: rMod.name,
                    name: `补充用例_${caseIdx - 1}`,
                    status: 'pass',
                    duration: (0.5 + Math.random() * 2).toFixed(1)
                });
            }

            return allCases.slice(0, total);
        }

        // 打开详情弹窗
        window.openResultDetail = function(taskName, status, rate, passed, total) {
            const overlay = document.getElementById('resultDetailOverlay');
            if (!overlay) return;

            // 设置标题和徽章
            document.getElementById('detailTitle').innerHTML = `<i class="fas fa-clipboard-check"></i> ${taskName}`;
            const badgeEl = document.getElementById('detailBadge');
            badgeEl.textContent = status === 'success' ? '通过' : (status === 'danger' ? '失败' : '警告');
            badgeEl.className = `detail-badge ${status}`;

            // 渲染概览统计
            const t = parseInt(total), p = parseInt(passed);
            const f = Math.max(0, t - p), s = Math.floor(t * 0.03); // skip ~3%
            const durMin = Math.floor(t * 0.8 + Math.random() * t * 0.4);

            document.getElementById('detailOverview').innerHTML = `
                <div class="overview-stat pass">
                    <div class="overview-stat-value">${p}</div>
                    <div class="overview-stat-label">通过</div>
                </div>
                <div class="overview-stat fail">
                    <div class="overview-stat-value">${f}</div>
                    <div class="overview-stat-label">失败</div>
                </div>
                <div class="overview-stat skip">
                    <div class="overview-stat-value">${s}</div>
                    <div class="overview-stat-label">跳过</div>
                </div>
                <div class="overview-stat time">
                    <div class="overview-stat-value">${durMin}m</div>
                    <div class="overview-stat-label">执行耗时</div>
                </div>
                <div class="overview-stat rate">
                    <div class="overview-stat-value">${rate}%</div>
                    <div class="overview-stat-label">通过率</div>
                </div>
            `;

            // 生成并渲染用例列表
            const cases = generateCaseData(taskName, p, t, status);
            renderCaseList(cases);
            renderDetailScreenshots(cases.filter(c => c.status === 'fail'));
            renderDetailLogs(cases);
            renderDetailTimeline(cases, taskName, durMin);

            // 重置到第一个 Tab
            switchDetailTab(document.querySelector('.detail-tab'), 'cases');

            // 显示弹窗
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        };

        // 关闭详情
        window.closeResultDetail = function() {
            document.getElementById('resultDetailOverlay').classList.remove('show');
            document.body.style.overflow = '';
        };

        // 点击遮罩关闭
        document.getElementById('resultDetailOverlay')?.addEventListener('click', function(e) {
            if (e.target === this) closeResultDetail();
        });

        // Tab 切换
        window.switchDetailTab = function(el, tabId) {
            document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
            el.classList.add('active');
            document.querySelectorAll('.detail-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(`panel-${tabId}`);
            if (panel) panel.classList.add('active');
        };

        // ═══════════════════════════════════════════
        // 执行记录筛选 & 数据
        // ═══════════════════════════════════════════

        // 状态筛选（支持多选）
        var _activeStatuses = ['all'];
        window.toggleStatusFilter = function(el) {
            var status = el.dataset.status;
            if (status === 'all') {
                _activeStatuses = ['all'];
                el.parentElement.querySelectorAll('.status-chip').forEach(function(c) { c.classList.remove('active'); });
                el.classList.add('active');
            } else {
                // 取消"全部"
                el.parentElement.querySelector('[data-status="all"]').classList.remove('active');
                _activeStatuses = _activeStatuses.filter(function(s) { return s !== 'all'; });
                if (el.classList.contains('active')) {
                    el.classList.remove('active');
                    _activeStatuses = _activeStatuses.filter(function(s) { return s !== status; });
                    if (_activeStatuses.length === 0) {
                        _activeStatuses = ['all'];
                        el.parentElement.querySelector('[data-status="all"]').classList.add('active');
                    }
                } else {
                    el.classList.add('active');
                    _activeStatuses.push(status);
                }
            }
            applyResultFilter();
        };

        // 时间范围快捷按钮
        window.setTimeRange = function(btn) {
            btn.parentElement.querySelectorAll('.filter-chip').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            document.getElementById('filterDateStart').value = '';
            document.getElementById('filterDateEnd').value = '';
            applyResultFilter();
        };

        // 重置所有筛选条件
        window.resetResultFilter = function() {
            document.getElementById('filterTaskName').value = '';
            document.getElementById('filterProject').value = '';
            document.getElementById('filterLevel').value = '';
            document.getElementById('filterTrigger').value = '';
            document.getElementById('filterEnv').value = '';
            document.getElementById('filterPassRateMin').value = '';
            document.getElementById('filterDuration').value = '';
            document.getElementById('filterDefects').value = '';
            document.getElementById('filterBuildVer').value = '';
            document.getElementById('filterDateStart').value = '';
            document.getElementById('filterDateEnd').value = '';

            // 重置时间范围按钮
            document.querySelectorAll('.time-chips .filter-chip')[0].classList.add('active');

            // 重置状态筛选
            _activeStatuses = ['all'];
            document.querySelectorAll('.status-chip').forEach(function(c) { c.classList.remove('active'); });
            document.querySelector('.status-chip[data-status="all"]').classList.add('active');

            applyResultFilter();
        };

        // 导出数据
        window.exportResults = function() {
            showToast('success', '导出成功', '已导出当前筛选条件的执行记录为 Excel 文件');
        };

        // 筛选面板展开 / 收起
        window.toggleResultFilterPanel = function(btn) {
            var filterBar = document.querySelector('.result-filter-bar');
            var summaryBar = document.querySelector('.result-summary-bar');
            var card = filterBar ? filterBar.nextElementSibling : null;

            // 如果当前不在执行记录tab，先切换过去
            var historyTab = document.querySelector('.result-tab[data-rtab="history"]');
            if (!document.getElementById('rpanel-history').classList.contains('active')) {
                switchResultTab(historyTab, 'history');
            }

            btn.classList.toggle('active');

            if (btn.classList.contains('active')) {
                // 展开
                if (filterBar) {
                    filterBar.classList.remove('collapsed');
                    filterBar.style.maxHeight = '600px';
                    setTimeout(function() { filterBar.style.maxHeight = ''; }, 320);
                }
                if (summaryBar) summaryBar.classList.remove('collapsed');
                if (card) { card.style.borderTopLeftRadius = '0'; card.style.borderTopRightRadius = '0'; }
            } else {
                // 收起
                if (filterBar) filterBar.classList.add('collapsed');
                if (summaryBar) summaryBar.classList.add('collapsed');
                if (card) { card.style.borderTopLeftRadius = '12px'; card.style.borderTopRightRadius = '12px'; }
            }
        };

        // ═══ 执行记录数据集 ═══
        var execRecordsData = [
            { id: 1,  name: '支付流程集成测试',    level:'system',   project:'订单管理系统', trigger:'schedule', env:'staging', status:'success', passRate:98.8, passed:84, total:85, duration:28, defects:1, time:'2026-04-21 06:15', build:'release/v2.3.1' },
            { id: 2,  name: '订单管理冒烟测试',      level:'module',   project:'订单管理系统', trigger:'ci',       env:'test',     status:'fail',    passRate:90.6, passed:29, total:32, duration:12, defects:3, time:'2026-04-21 04:22', build:'feat/order-refactor' },
            { id: 3,  name: 'API 接口巡检',          level:'api',      project:'用户管理系统', trigger:'schedule', env:'test',     status:'success', passRate:100,  passed:200,total:200,duration:15, defects:0, time:'2026-04-21 00:00', build:'main' },
            { id: 4,  name: '用户登录全流程回归',      level:'function', project:'用户管理系统', trigger:'manual',   env:'dev',      status:'success', passRate:97.2, passed:138,total:142,duration:22, defects:2, time:'2026-04-20 18:30', build:'fix/auth-bug' },
            { id: 5,  name: '库存同步接口压力测试',   level:'api',      project:'库存管理系统', trigger:'webhook',  env:'staging', status:'fail',    passRate:85.0, passed:68, total:80, duration:45, defects:6, time:'2026-04-20 14:10', build:'perf/sync-optimize' },
            { id: 6,  name: '消息推送模块冒烟',        level:'module',   project:'消息通知服务', trigger:'ci',       env:'prod',     status:'abort',   passRate:72.0, passed:36, total:50, duration:8,  defects:0, time:'2026-04-20 11:00', build:'feature/push-v2' },
            { id: 7,  name: '权限控制矩阵验证',        level:'function', project:'用户管理系统', trigger:'manual',   env:'test',     status:'success', passRate:100,  passed:56, total:56, duration:9,  defects:0, time:'2026-04-19 23:00', build:'security/rbac' },
            { id: 8,  name: '注册流程端到端测试',      level:'case',     project:'用户管理系统', trigger:'schedule', env:'test',     status:'fail',    passRate:93.3, passed:42, total:45, duration:18, defects:2, time:'2026-04-19 20:15', build:'bugfix/register' },
            { id: 9,  name: '支付网关稳定性测试',      level:'system',   project:'支付中心',      trigger:'schedule', env:'staging', status:'success', passRate:99.2, passed:248,total:250,duration:52, defects:1, time:'2026-04-19 16:40', build:'stable/gateway' },
            { id: 10, name: '商品搜索性能基准测试',    level:'function', project:'订单管理系统', trigger:'webhook',  env:'staging', status:'success', passRate:96.0, passed:48, total:50, duration:35, defects:1, time:'2026-04-19 09:20', build:'perf/search-index' },
            { id: 11, name: '报表导出功能回归',        level:'module',   project:'订单管理系统', trigger:'manual',   env:'dev',      status:'success', passRate:94.7, passed:54, total:57, duration:14, defects:2, time:'2026-04-18 17:55', build:'fix/export-excel' },
            { id: 12, name: '并发会话安全测试',        level:'api',      project:'用户管理系统', trigger:'ci',       env:'test',     status:'success', passRate:100,  passed:90, total:90, duration:25, defects:0, time:'2026-04-18 13:30', build:'security/concurrent' },
            { id: 13, name: '购物车逻辑边界用例集',    level:'case',     project:'订单管理系统', trigger:'schedule', env:'test',     status:'fail',    passRate:88.9, passed:32, total:36, duration:16, defects:3, time:'2026-04-18 08:45', build:'bugfix/cart-edge' },
            { id: 14, name: '系统健康检查巡检',        level:'system',   project:'用户管理系统', trigger:'schedule', env:'prod',     status:'success', passRate:100,  passed:30, total:30, duration:3,  defects:0, time:'2026-04-17 06:00', build:'main' },
            { id: 15, name: '优惠券发放链路测试',      level:'function', project:'订单管理系统', trigger:'ci',       env:'staging', status:'success', passRate:95.8, passed:46, total:48, duration:21, defects:1, time:'2026-04-16 22:10', build:'feature/coupon' },
        ];

        // 级别显示名映射
        var levelNames = { system:'系统', module:'模块', function:'功能', case:'用例', api:'接口' };
        // 环境显示名映射
        var envNames   = { dev:'Dev', test:'Test', staging:'Staging', prod:'Prod' };
        // 触发方式显示名映射
        var triggerNames = { manual:'手动', schedule:'定时', ci:'CI流水线', webhook:'Webhook' };

        // 核心筛选函数
        window.applyResultFilter = function() {
            var taskName = document.getElementById('filterTaskName').value.trim().toLowerCase();
            var project = document.getElementById('filterProject').value;
            var level   = document.getElementById('filterLevel').value;
            var trigger = document.getElementById('filterTrigger').value;
            var env     = document.getElementById('filterEnv').value;
            var passRateMin = document.getElementById('filterPassRateMin').value;
            var durationRange = document.getElementById('filterDuration').value;
            var defectFilter  = document.getElementById('filterDefects').value;
            var buildVer      = document.getElementById('filterBuildVer').value.trim().toLowerCase();

            // 时间范围
            var dateStart = document.getElementById('filterDateStart').value;
            var dateEnd   = document.getElementById('filterDateEnd').value;

            // 活跃的时间范围芯片
            var activeTimeChip = document.querySelector('.time-chips .filter-chip.active');
            var timeRangeDays = activeTimeChip ? parseInt(activeTimeChip.dataset.range) : null;
            if (!isNaN(timeRangeDays)) { timeRangeDays = parseInt(activeTimeChip.dataset.range); }

            // 过滤
            var filtered = execRecordsData.filter(function(rec) {
                // 任务名称
                if (taskName && rec.name.toLowerCase().indexOf(taskName) === -1) return false;
                // 项目
                if (project && rec.project !== project) return false;
                // 级别
                if (level && rec.level !== level) return false;
                // 触发方式
                if (trigger && rec.trigger !== trigger) return false;
                // 环境
                if (env && rec.env !== env) return false;

                // 状态
                if (_activeStatuses.indexOf('all') === -1 && _activeStatuses.indexOf(rec.status) === -1) return false;

                // 通过率
                if (passRateMin) {
                    var minVal = parseFloat(passRateMin);
                    if (rec.passRate < minVal) return false;
                }

                // 耗时范围
                if (durationRange) {
                    var d = rec.duration;
                    if (durationRange === '0-10'   && d > 10) return false;
                    if (durationRange === '10-30'  && (d < 10 || d > 30)) return false;
                    if (durationRange === '30-60'  && (d < 30 || d > 60)) return false;
                    if (durationRange === '60+'    && d <= 60) return false;
                }

                // 缺陷情况
                if (defectFilter === 'hasDefect'  && rec.defects === 0) return false;
                if (defectFilter === 'noDefect'   && rec.defects > 0)  return false;
                if (defectFilter === 'critical'   && !rec.name.includes('严重')) return false;

                // 构建版本
                if (buildVer) {
                    if (rec.build.toLowerCase().indexOf(buildVer) === -1) return false;
                }

                // 日期
                if (dateStart || dateEnd) {
                    var recDate = new Date(rec.time.replace(/-/g, '/'));
                    if (dateStart && new Date(dateStart.replace(/-/g,'/')) > recDate) return false;
                    if (dateEnd && new Date(dateEnd.replace(/-/g,'/')).setHours(23,59,59) < recDate) return false;
                } else if (timeRangeDays) {
                    var now = new Date();
                    var cutoff = new Date(now.getTime() - timeRangeDays * 86400000);
                    var recDate = new Date(rec.time.replace(/-/g, '/'));
                    if (recDate < cutoff) return false;
                }

                return true;
            });

            renderResultTable(filtered);
            updateActiveFiltersTag();
        };

        // 渲染结果表格
        function renderResultTable(data) {
            var tbody = document.getElementById('resultTableBody');
            var emptyState = document.getElementById('resultEmptyState');
            var countEl = document.getElementById('resultTotalCount');

            countEl.textContent = data.length;

            if (data.length === 0) {
                tbody.innerHTML = '';
                emptyState.style.display = 'block';
                return;
            }

            emptyState.style.display = 'none';
            tbody.innerHTML = data.map(function(rec) {
                var statusClass = rec.status === 'success' ? 'success' : rec.status === 'fail' ? 'danger' : 'warning';
                var statusText = rec.status === 'success' ? '通过' : rec.status === 'fail' ? '失败' : '中断';
                var rateColor  = rec.passRate >= 95 ? 'var(--success)' : rec.passRate >= 80 ? 'var(--warning)' : 'var(--danger)';
                var durColor   = rec.duration <= 10 ? '#22c55e' : rec.duration <= 30 ? '#f59e0b' : '#ef4444';

                return '<tr>' +
                    '<td><div style="font-weight:600;font-size:13px;">' + rec.name + '</div>' +
                        '<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;"><i class="fas fa-' +
                        (rec.trigger==='manual'?'hand-pointer':rec.trigger==='schedule'?'clock':rec.trigger==='ci'?'code-branch':'link') + '" style="margin-right:3px;opacity:.5"></i>' +
                        triggerNames[rec.trigger] + ' · ' + rec.build + '</div></td>' +
                    '<td><span class="level-tag ' + rec.level + '">' + levelNames[rec.level] + '</span></td>' +
                    '<td style="color:' + rateColor + ';font-weight:700;">' + rec.passRate + '%</td>' +
                    '<td>' + rec.passed + ' / ' + rec.total + '</td>' +
                    '<td><span style="color:' + durColor + ';font-weight:600">' + rec.duration + 'min</span></td>' +
                    '<td style="color:var(--text-secondary);font-size:12px;">' + rec.time + '</td>' +
                    '<td><span class="status-badge ' + statusClass + '">' + statusText + '</span></td>' +
                    '<td><span class="env-tag ' + rec.env + '"><span class="env-dot"></span>' + envNames[rec.env] + '</span></td>' +
                    '<td><button class="btn btn-secondary btn-sm" style="padding:5px 12px;font-size:12px;" ' +
                        'onclick="openResultDetail(\'' + rec.name + '\',\'' + statusClass + '\',\'' + rec.passRate + '\',\'' + rec.passed + '\',\'' + rec.total + '\')">查看详情</button></td>' +
                '</tr>';
            }).join('');
        }

        // 更新活跃筛选标签
        function updateActiveFiltersTag() {
            var tagEl = document.getElementById('activeFiltersTag');
            var filters = [];

            if (document.getElementById('filterTaskName').value) filters.push('任务名');
            if (document.getElementById('filterProject').value) filters.push('项目');
            if (document.getElementById('filterLevel').value) filters.push('级别');
            if (document.getElementById('filterTrigger').value) filters.push('触发方式');
            if (document.getElementById('filterEnv').value) filters.push('环境');
            if (document.getElementById('filterPassRateMin').value) filters.push('通过率');
            if (document.getElementById('filterDuration').value) filters.push('耗时');
            if (document.getElementById('filterDefects').value) filters.push('缺陷');
            if (document.getElementById('filterBuildVer').value) filters.push('构建版本');
            if (document.getElementById('filterDateStart').value || document.getElementById('filterDateEnd').value) filters.push('时间');
            if (_activeStatuses.indexOf('all') === -1) filters.push('状态');

            if (filters.length > 0) {
                tagEl.style.display = '';
                tagEl.textContent = '已选: ' + filters.join(', ');
            } else {
                tagEl.style.display = 'none';
            }
        }

        // 初始化执行记录表格
        window.initResultHistory = function() {
            // 设置默认日期范围提示
            var today = new Date();
            var weekAgo = new Date(today.getTime() - 7*86400000);
            var ds = document.getElementById('filterDateStart');
            var de = document.getElementById('filterDateEnd');
            ds.value = formatDateStr(weekAgo);
            de.value = formatDateStr(today);

            applyResultFilter();
        };

        function formatDateStr(d) {
            return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
        }

        // ═══════════════════════════════════════════
        // 测试报告 - 筛选 / 列表 / 详情切换
        // ═══════════════════════════════════════════

        var _activeReportStatuses = ['all'];

        // 状态筛选（多选）
        window.toggleReportStatus = function(el) {
            var st = el.dataset.rstatus;
            if (st === 'all') {
                _activeReportStatuses = ['all'];
                el.parentElement.querySelectorAll('.status-chip').forEach(function(c) { c.classList.remove('active'); });
                el.classList.add('active');
            } else {
                el.parentElement.querySelector('[data-rstatus="all"]').classList.remove('active');
                _activeReportStatuses = _activeReportStatuses.filter(function(s) { return s !== 'all'; });
                if (el.classList.contains('active')) {
                    el.classList.remove('active');
                    _activeReportStatuses = _activeReportStatuses.filter(function(s) { return s !== st; });
                    if (_activeReportStatuses.length === 0) {
                        _activeReportStatuses = ['all'];
                        el.parentElement.querySelector('[data-rstatus="all"]').classList.add('active');
                    }
                } else {
                    el.classList.add('active');
                    _activeReportStatuses.push(st);
                }
            }
            applyReportFilter();
        };

        window.setReportTimeRange = function(btn) {
            btn.parentElement.querySelectorAll('.filter-chip').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            document.getElementById('rptDateStart').value = '';
            document.getElementById('rptDateEnd').value = '';
            applyReportFilter();
        };

        window.resetReportFilter = function() {
            document.getElementById('rptFilterSystem').value = '';
            document.getElementById('rptFilterTask').value = '';
            document.getElementById('rptFilterModule').value = '';
            document.getElementById('rptFilterType').value = '';
            document.getElementById('rptFilterExecutor').value = '';
            document.getElementById('rptFilterPassRate').value = '';
            document.getElementById('rptFilterDefects').value = '';
            document.getElementById('rptFilterBuildVer').value = '';
            document.getElementById('rptDateStart').value = '';
            document.getElementById('rptDateEnd').value = '';

            document.querySelector('.report-filter-bar .time-chips .filter-chip.active').classList.add('active');

            _activeReportStatuses = ['all'];
            document.querySelectorAll('#reportFilterBar .status-chip').forEach(function(c) { c.classList.remove('active'); });
            document.querySelector('#reportFilterBar .status-chip[data-rstatus="all"]').classList.add('active');

            applyReportFilter();
        };

        // 筛选面板展开/收起
        window.toggleReportFilterPanel = function(btn) {
            var bar = document.getElementById('reportFilterBar');
            var summary = document.getElementById('reportSummaryBar');
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                bar.classList.remove('collapsed'); summary.classList.remove('collapsed');
            } else {
                bar.classList.add('collapsed'); summary.classList.add('collapsed');
            }
        };

        // ═══ 报告数据集 ═══
        var reportsData = [
            { id: 1,  name: '用户管理系统全量回归测试', system:'用户管理系统', module:'登录认证', type:'full', status:'published',
              executor:'李明', passRate:96.2, passed:1428, total:1485, defects:5, duration:'52min', date:'2026-04-21', time:'08:45', build:'release/v2.3.1' },
            { id: 2,  name: '支付流程集成冒烟测试',     system:'订单管理系统', module:'支付流程', type:'smoke',   status:'published',
              executor:'王芳', passRate:98.8, passed:84, total:85, defects:1, duration:'28min', date:'2026-04-21', time:'06:15', build:'v2.2.8' },
            { id: 3,  name: 'API接口稳定性专项报告',      system:'用户管理系统', module:'报表导出', type:'special', status:'draft',
              executor:'张伟', passRate:100,  passed:200,total:200,defects:0,duration:'15min',date:'2026-04-21',time:'00:00',build:'main' },
            { id: 4,  name: '订单模块回归测试报告',         system:'订单管理系统', module:'订单管理', type:'regression', status:'published',
              executor:'刘洋', passRate:90.6, passed:29, total:32, defects:3, duration:'12min', date:'2026-04-20', time:'18:30', build:'feat/order-refactor' },
            { id: 5,  name: '库存同步性能基准报告',         system:'库存管理系统', module:'库存管理', type:'perf',    status:'published',
              executor:'陈静', passRate:85.0, passed:68, total:80, defects:6, duration:'45min', date:'2026-04-20', time:'14:10',build:'perf/sync-optimize' },
            { id: 6,  name: '消息推送功能验证报告',         system:'消息通知服务', module:'消息推送', type:'smoke',   status:'draft',
              executor:'李明', passRate:72.0, passed:36, total:50, defects:4, duration:'8min', date:'2026-04-19', time:'11:00', build:'feature/push-v2' },
            { id: 7,  name: '权限控制安全审计报告',         system:'用户管理系统', module:'权限控制', type:'security', status:'archived',
              executor:'张伟', passRate:100,  passed:56, total:56, defects:0, duration:'9min', date:'2026-04-19', time:'09:20', build:'security/rbac' },
            { id: 8,  name: '注册流程端到端回归报告',       system:'用户管理系统', module:'用户注册', type:'regression', status:'published',
              executor:'王芳', passRate:93.3, passed:42, total:45, defects:2, duration:'16min', date:'6-04-19'.replace('6-','2026-0'), time:'16:40', build:'bugfix/register' },
            { id: 9,  name: '支付网关压力测试报告',         system:'支付中心',      module:'支付流程', type:'perf',    status:'published',
              executor:'刘洋', passRate:99.2, passed:248,total:250,defects:1,duration:'52min',date:'2026-04-18',time:'22:10',build:'stable/gateway' },
            { id: 10, name: '商品搜索性能分析报告',          system:'订单管理系统', module:'报表导出', type:'special', status:'archived',
              executor:'陈静', passRate:96.0, passed:48, total:50, defects:1, duration:'35min', date:'2026-04-17', time:'15:55', build:'perf/search' },
            { id: 11, name: '用户登录安全渗透测试报告',     system:'用户管理系统', module:'登录认证', type:'security', status:'published',
              executor:'张伟', passRate:88.0, passed:44, total:50, defects:4, duration:'38min', date:'2026-04-16', time:'10:30', build:'security/pentest' },
            { id: 12, name: '购物车逻辑边界值测试报告',     system:'订单管理系统', module:'订单管理', type:'regression', status:'published',
              executor:'李明', passRate:88.9, passed:32, total:36, defects:3, duration:'14min', date:'2026-04-15', time:'08:45', build:'bugfix/cart-edge' },
        ];

        var rptTypeNames = { regression:'回归测试', smoke:'冒烟测试', full:'全量测试', special:'专项测试', perf:'性能测试', security:'安全测试' };
        var rptStatusNames = { published:'已发布', draft:'草稿', archived:'已归档' };

        // 核心筛选
        window.applyReportFilter = function() {
            var system  = document.getElementById('rptFilterSystem').value;
            var taskKey = document.getElementById('rptFilterTask').value.trim().toLowerCase();
            var module  = document.getElementById('rptFilterModule').value;
            var type    = document.getElementById('rptFilterType').value;
            var exec    = document.getElementById('rptFilterExecutor').value;
            var prMin   = document.getElementById('rptFilterPassRate').value;
            var defectF = document.getElementById('rptFilterDefects').value;
            var buildV  = document.getElementById('rptFilterBuildVer').value.trim().toLowerCase();
            var ds = document.getElementById('rptDateStart').value;
            var de = document.getElementById('rptDateEnd').value;

            var activeChip = document.querySelector('#reportFilterBar .time-chips .filter-chip.active');
            var rangeDays = activeChip ? parseInt(activeChip.dataset.range) : null;
            if (!isNaN(rangeDays)) rangeDays = parseInt(activeChip.dataset.range);

            var filtered = reportsData.filter(function(r) {
                if (system && r.system !== system) return false;
                if (taskKey && r.name.toLowerCase().indexOf(taskKey) === -1) return false;
                if (module && r.module !== module) return false;
                if (type && r.type !== type) return false;
                if (exec && r.executor !== exec) return false;
                if (_activeReportStatuses.indexOf('all') === -1 && _activeReportStatuses.indexOf(r.status) === -1) return false;
                if (prMin) { var v = parseFloat(prMin); if (r.passRate < v) return false; }
                if (defectF === '0' && r.defects > 0) return false;
                if (defectF === '1-3' && (r.defects < 1 || r.defects > 3)) return false;
                if (defectF === '4+' && r.defects < 4) return false;
                if (buildV && r.build.toLowerCase().indexOf(buildV) === -1) return false;
                if (ds || de) {
                    var rd = new Date(r.date.replace(/-/g,'/'));
                    if (ds && new Date(ds.replace(/-/g,'/')) > rd) return false;
                    if (de && new Date(de.replace(/-/g,'/')).setHours(23,59,59) < rd) return false;
                } else if (rangeDays) {
                    var now = new Date(); var cut = new Date(now.getTime() - rangeDays * 86400000);
                    if (new Date(r.date.replace(/-/g,'/')) < cut) return false;
                }
                return true;
            });

            renderReportList(filtered);
            updateReportFiltersTag();
        };

        function renderReportList(data) {
            var grid = document.getElementById('reportListGrid');
            var empty = document.getElementById('reportEmptyState');
            var countEl = document.getElementById('reportTotalCount');
            countEl.textContent = data.length;

            if (!grid) return;
            if (data.length === 0) {
                grid.innerHTML = ''; empty.style.display = ''; return;
            }
            empty.style.display = 'none';

            grid.innerHTML = data.map(function(r) {
                var rateCls = r.passRate >= 95 ? 'pass-high' : r.passRate >= 85 ? 'pass-mid' : 'pass-low';
                return '<div class="report-card status-' + r.status + '" onclick="openReportDetail(' + r.id + ')">' +
                    '<div class="rc-header"><span class="rc-type-badge ' + r.type + '">' + rptTypeNames[r.type] + '</span>' +
                        '<div style="display:flex;align-items:center;gap:6px;"><span class="rc-status-dot ' + r.status + '" title="' + rptStatusNames[r.status] + '"></span></div></div>' +
                    '<div class="rc-title">' + r.name + '</div>' +
                    '<div class="rc-subtitle">' + r.system + ' · ' + r.module + '</div>' +
                    '<div class="rc-meta-row">' +
                        '<span class="rc-meta-item"><i class="fas fa-user"></i> ' + r.executor + '</span>' +
                        '<span class="rc-meta-item"><i class="fas fa-calendar"></i> ' + r.date + ' ' + r.time + '</span>' +
                        '<span class="rc-meta-item"><i class="fas fa-code-branch"></i> ' + r.build + '</span>' +
                    '</div>' +
                    '<div class="rc-stats">' +
                        '<div class="rc-stat"><div class="rc-stat-val ' + rateCls + '">' + r.passRate + '%</div><div class="rc-stat-label">通过率</div></div>' +
                        '<div class="rc-stat"><div class="rc-stat-val" style="color:var(--primary)">' + r.passed + '/' + r.total + '</div><div class="rc-stat-label">用例数</div></div>' +
                        '<div class="rc-stat"><div class="rc-stat-val" style="color:' + (r.defects > 0 ? 'var(--danger)' : '#22c55e') + '">' + r.defects + '</div><div class="rc-stat-label">缺陷</div></div>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function updateReportFiltersTag() {
            var tag = document.getElementById('reportActiveFiltersTag');
            var f = [];
            if (document.getElementById('rptFilterSystem').value) f.push('系统');
            if (document.getElementById('rptFilterTask').value) f.push('任务');
            if (document.getElementById('rptFilterModule').value) f.push('模块');
            if (document.getElementById('rptFilterType').value) f.push('类型');
            if (_activeReportStatuses.indexOf('all') === -1) f.push('状态');
            if (document.getElementById('rptFilterExecutor').value) f.push('执行人');
            if (document.getElementById('rptFilterPassRate').value) f.push('通过率');
            if (document.getElementById('rptFilterDefects').value) f.push('缺陷');
            tag.style.display = f.length > 0 ? '' : 'none';
            if (f.length > 0) tag.textContent = '已选: ' + f.join(', ');
        }

        // 打开报告详情
        window.openReportDetail = function(id) {
            var r = reportsData.find(function(x) { return x.id === id; });
            if (!r) return;

            // 填充详情数据
            document.getElementById('detailReportTitle').textContent = '\uD83D\uDCCB 测试报告 · ' + r.build;
            document.getElementById('detailReportSub').textContent = r.system + ' · ' + rptTypeNames[r.type];
            document.getElementById('detailRptDate').textContent = r.date;
            document.getElementById('detailRptExecutor').textContent = r.executor;
            document.getElementById('detailRptTime').textContent = r.time;
            document.getElementById('detailRptBuild').textContent = r.build;
            document.getElementById('detailRptPassRate').textContent = r.passRate + '%';
            document.getElementById('reportBreadcrumb').innerHTML = '测试报告 <strong>&gt;</strong> ' + r.name;

            // 更新覆盖率（模拟不同报告有不同覆盖率）
            var cov = [
                { val: Math.floor(Math.random()*8+92), lbl:'需求覆盖率', color:'var(--primary)' },
                { val: Math.floor(Math.random()*5+95), lbl:'功能覆盖率', color:'var(--success)' },
                { val: Math.floor(Math.random()*25+65), lbl:'接口覆盖率', color:'var(--info)' },
                { val: 100, lbl:'主流程覆盖率', color:'var(--warning)' }
            ];
            var cg = document.getElementById('detailCoverageGrid');
            if (cg) cg.innerHTML = cov.map(function(c) {
                return '<div class="coverage-card"><div class="coverage-value" style="color:' + c.color + '">' + c.val + '%</div><div class="coverage-label">' + c.lbl + '</div><div class="coverage-bar"><div class="coverage-bar-fill" style="width:' + c.val + '%;background:' + c.color + '"></div></div></div>';
            }).join('');

            // 切换视图
            document.getElementById('reportListView').style.display = 'none';
            document.getElementById('reportDetailView').style.display = 'block';
            // 滚到顶部
            document.getElementById('page-report').scrollTo({ top: 0, behavior: 'smooth' });
        };

        // 返回列表
        window.backToReportList = function() {
            document.getElementById('reportDetailView').style.display = 'none';
            document.getElementById('reportListView').style.display = 'block';
        };

        // 初始化报告列表
        window.initReportPage = function() {
            var today = new Date(), weekAgo = new Date(today.getTime() - 7*86400000);
            document.getElementById('rptDateStart').value = formatDateStr(weekAgo);
            document.getElementById('rptDateEnd').value = formatDateStr(today);
            applyReportFilter();
        };

        // ═══════════════════════════════════════════
        // 测试结果页面 - Tab 切换 / 趋势 / 缺陷分析
        // ═══════════════════════════════════════════

        // 结果页 Tab 切换
        window.switchResultTab = function(el, panelId) {
            document.querySelectorAll('#page-result .result-tab').forEach(t => t.classList.remove('active'));
            el.classList.add('active');
            document.querySelectorAll('#page-result .result-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(`rpanel-${panelId}`);
            if (panel) {
                panel.classList.add('active');
                // 强制触发浏览器重排，让隐藏元素获得实际尺寸
                void panel.offsetHeight;
                // 首次切换时延迟渲染图表
                if (panelId === 'history' && !panel.dataset.inited) {
                    setTimeout(function() { initResultHistory(); panel.dataset.inited = '1'; }, 30);
                }
                if (panelId === 'trend' && !panel.dataset.inited) {
                    setTimeout(function() { initTrendAnalysis(); panel.dataset.inited = '1'; }, 50);
                }
                if (panelId === 'defect' && !panel.dataset.inited) {
                    setTimeout(function() { initDefectAnalysis(); panel.dataset.inited = '1'; }, 50);
                }
            }
        };

        // 趋势范围选择
        window.setTrendRange = function(range, btn) {
            btn.parentElement?.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setTimeout(function() { initTrendAnalysis(); }, 30);
        };

        // 初始化趋势分析 — 每个函数独立 try-catch，互不阻塞
        function initTrendAnalysis() {
            try { renderPassRateChart(); } catch(e) { console.warn('[Trend] passRateChart:', e); }
            try { renderModuleCompareBars(); } catch(e) { console.warn('[Trend] moduleBars:', e); }
            try { renderDailyExecChart(); } catch(e) { console.warn('[Trend] dailyExec:', e); }
            try { renderMiniSparklines(); } catch(e) { console.warn('[Trend] sparklines:', e); }
            try { renderCaseStatusDonut(); } catch(e) { console.warn('[Trend] caseStatus:', e); }
            try { renderDurationTrendChart(); } catch(e) { console.warn('[Trend] duration:', e); }
            try { renderEfficiencyMetrics(); } catch(e) { console.warn('[Trend] efficiency:', e); }
        }

        // ═══ KPI 迷你 Sparkline 图表 ═══
        function renderMiniSparklines() {
            const sparklineOpts = {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { x: { display: false }, y: { display: false } },
                elements: { point: { radius: 0, hoverRadius: 0 } }
            };

            createMiniChart('miniPassRate', [93.1, 94.5, 93.8, 95.2, 94.8, 96.0, 96.5], '#22c55e', 'line', sparklineOpts);
            createMiniChart('miniExecCount', [18, 24, 20, 28, 22, 30, 26], '#6366f1', 'bar', Object.assign({}, sparklineOpts, {
                datasets: { bar: { borderRadius: 2, barPercentage: 0.7 } }
            }));
            createMiniChart('miniDefects', [5, 3, 6, 4, 3, 5, 2], '#ef4444', 'line', sparklineOpts);
            createMiniChart('miniDuration', [52, 48, 50, 45, 44, 43, 42], '#06b6d4', 'line', sparklineOpts);
        }

        // hex 转 rgba
        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1,3), 16);
            const g = parseInt(hex.slice(3,5), 16);
            const b = parseInt(hex.slice(5,7), 16);
            return `rgba(${r},${g},${b},${alpha})`;
        }

        function createMiniChart(canvasId, data, color, type, opts) {
            var canvas = document.getElementById(canvasId);
            if (!canvas || typeof Chart === 'undefined') return;
            if (window['_mini_' + canvasId]) window['_mini_' + canvasId].destroy();

            window['_mini_' + canvasId] = new Chart(canvas, {
                type: type,
                data: {
                    labels: data.map((_, i) => i),
                    datasets: [{
                        data: data,
                        borderColor: color,
                        backgroundColor: type === 'line' ? hexToRgba(color, 0.12) : hexToRgba(color, 0.33),
                        fill: type === 'line',
                        tension: 0.4,
                        borderWidth: type === 'line' ? 1.8 : 0,
                    }]
                },
                options: opts
            });
        }

        // ═══ 通过率趋势图 ═══
        function renderPassRateChart() {
            var canvas = document.getElementById('trendPassRateChart');
            if (!canvas || typeof Chart === 'undefined') return;
            // 确保 canvas 有实际尺寸
            if (canvas.offsetWidth < 10) { canvas.style.width = '100%'; canvas.style.height = '260px'; }
            if (window._trendChartInst) window._trendChartInst.destroy();

            const labels = ['04-15', '04-16', '04-17', '04-18', '04-19', '04-20', '04-21'];
            const passRates = [94.2, 95.8, 93.5, 96.1, 95.0, 97.2, 96.5];
            const targetLine = [95.0, 95.0, 95.0, 95.0, 95.0, 95.0, 95.0];

            window._trendChartInst = new Chart(canvas, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: '通过率',
                            data: passRates,
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99,102,241,0.08)',
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#6366f1',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                        },
                        {
                            label: '目标线',
                            data: targetLine,
                            borderColor: '#f59e0b',
                            borderDash: [8, 4],
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { min: 85, max: 100, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8', callback: v => v + '%' } },
                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                    },
                    interaction: { intersect: false, mode: 'index' }
                }
            });
        }

        // 模块对比柱状图
        function renderModuleCompareBars() {
            var container = document.getElementById('moduleCompareBars');
            if (!container) return;

            const modules = [
                { name: '用户管理', rate: 98.2, color: 'var(--success)' },
                { name: '订单系统', rate: 94.5, color: 'var(--warning)' },
                { name: '支付中心', rate: 100.0, color: 'var(--success)' },
                { name: '库存管理', rate: 91.3, color: 'var(--danger)' },
                { name: '消息通知', rate: 96.8, color: 'var(--success)' },
                { name: '权限控制', rate: 99.1, color: 'var(--success)' },
            ];

            container.innerHTML = modules.map(m => `
                <div class="module-bar-item">
                    <span class="mbi-name">${m.name}</span>
                    <div class="mbi-bar-wrap">
                        <div class="mbi-bar-fill" style="width:${m.rate}%;background:linear-gradient(90deg,#22c55e,${m.rate>=95?'#22c55e':m.rate>=90?'#f59e0b':'#ef4444'})">
                        </div>
                    </div>
                    <span class="mbi-value">${m.rate}%</span>
                </div>
            `).join('');
        }

        // 每日执行量分布图
        function renderDailyExecChart() {
            var canvas = document.getElementById('dailyExecChart');
            if (!canvas || typeof Chart === 'undefined') return;
            if (canvas.offsetWidth < 10) { canvas.style.width = '100%'; canvas.style.height = '220px'; }
            if (window._dailyExecChartInst) window._dailyExecChartInst.destroy();

            window._dailyExecChartInst = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: ['周一','周二','周三','周四','周五','周六','周日'],
                    datasets: [
                        {
                            label: '成功',
                            data: [25, 29, 16, 32, 38, 10, 7],
                            backgroundColor: 'rgba(34,197,94,0.7)',
                            borderRadius: 4,
                            barPercentage: 0.55,
                        },
                        {
                            label: '失败',
                            data: [3, 3, 2, 3, 4, 2, 1],
                            backgroundColor: 'rgba(239,68,68,0.7)',
                            borderRadius: 4,
                            barPercentage: 0.55,
                        }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top', labels: { color: '#94a3b8', usePointStyle:true, padding: 14, font:{size:11} } }
                    },
                    scales: {
                        x: { stacked: true, grid: { display: false }, ticks: { color: '#94a3b8', font:{size:11} } },
                        y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8' } }
                    }
                }
            });
        }

        // ═══ 用例状态分布环形图 ═══
        function renderCaseStatusDonut() {
            var canvas = document.getElementById('caseStatusDonut');
            if (!canvas || typeof Chart === 'undefined') return;
            if (canvas.offsetWidth < 10) { canvas.style.width = '150px'; canvas.style.height = '150px'; }
            if (window._caseStatusDonut) window._caseStatusDonut.destroy();

            const statusData = [
                { name: '通过', count: 1428, color: '#22c55e' },
                { name: '失败', count: 52,   color: '#ef4444' },
                { name: '跳过', count: 35,    color: '#f59e0b' },
                { name: '阻塞', count: 15,    color: '#6366f1' },
            ];
            const total = statusData.reduce((s, d) => s + d.count, 0);

            window._caseStatusDonut = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: statusData.map(d => d.name),
                    datasets: [{
                        data: statusData.map(d => d.count),
                        backgroundColor: statusData.map(d => d.color),
                        borderWidth: 0,
                        hoverOffset: 8,
                        spacing: 2,
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    cutout: '68%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: ctx => `${ctx.label}: ${ctx.parsed} (${(ctx.parsed / total * 100).toFixed(1)}%)`
                            }
                        }
                    }
                }
            });

            // 渲染图例
            const legendEl = document.getElementById('caseStatusLegend');
            if (legendEl) {
                legendEl.innerHTML = statusData.map(d => `
                    <div class="case-status-legend-item">
                        <span class="csli-dot" style="background:${d.color}"></span>
                        <span class="csli-name">${d.name}</span>
                        <span class="csli-count" style="color:${d.color}">${d.count}</span>
                        <span class="csli-pct">(${(d.count / total * 100).toFixed(1)}%)</span>
                    </div>
                `).join('');
            }
        }

        // ═══ 执行耗时趋势面积图 ═══
        function renderDurationTrendChart() {
            var canvas = document.getElementById('durationTrendChart');
            if (!canvas || typeof Chart === 'undefined') return;
            if (canvas.offsetWidth < 10) { canvas.style.width = '100%'; canvas.style.height = '200px'; }
            if (window._durationTrend) window._durationTrend.destroy();

            const labels = ['04-15','04-16','04-17','04-18','04-19','04-20','04-21'];
            const avgData = [52, 48, 50, 45, 44, 43, 42];
            const upperData = avgData.map(v => v + 12);
            const lowerData = avgData.map(v => Math.max(v - 10, 20));

            window._durationTrend = new Chart(canvas, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: '波动上限',
                            data: upperData,
                            borderColor: 'transparent',
                            backgroundColor: 'rgba(99,102,241,0.08)',
                            fill: '+1',
                            tension: 0.35,
                            pointRadius: 0,
                        },
                        {
                            label: '波动下限',
                            data: lowerData,
                            borderColor: 'transparent',
                            backgroundColor: 'rgba(99,102,241,0.04)',
                            fill: false,
                            tension: 0.35,
                            pointRadius: 0,
                        },
                        {
                            label: '平均耗时',
                            data: avgData,
                            borderColor: '#06b6d4',
                            backgroundColor: 'rgba(6,182,212,0.12)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2.5,
                            pointBackgroundColor: '#06b6d4',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                        }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            min: 15, max: 70,
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#94a3b8', callback: v => v + 'min' }
                        },
                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                    },
                    interaction: { intersect: false, mode: 'index' }
                }
            });
        }

        // ═══ 测试效率指标卡片 ═══
        function renderEfficiencyMetrics() {
            const container = document.getElementById('efficiencyMetrics');
            if (!container) return;

            const metrics = [
                { icon: 'fa-rocket', iconClass: 'green', label: '自动化覆盖率', value: '87.3%', change: '+3.2%', up: true },
                { icon: 'fa-bolt', iconClass: 'blue',  label: '平均执行速度', value: '186用例/h', change: '+12%', up: true },
                { icon: 'fa-sync-alt', iconClass: 'purple',label: '回归频率', value: '每日2次', change: '稳定', up: null },
                { icon: 'fa-shield-alt', iconClass:'orange',label: '构建成功率', value: '96.8%', change: '-0.5%', up: false },
            ];

            container.innerHTML = metrics.map(m => `
                <div class="efficiency-metric-row">
                    <div class="em-icon ${m.iconClass}"><i class="fas ${m.icon}"></i></div>
                    <div class="em-info">
                        <div class="em-label">${m.label}</div>
                        <div class="em-value">${m.value}</div>
                    </div>
                    ${m.up !== null ? `<span class="em-change ${m.up ? 'up' : 'down'}">${m.change}</span>` : '<span class="em-change" style="background:rgba(148,163,184,0.1);color:#94a3b8">' + m.change + '</span>'}
                </div>
            `).join('');
        }

        // ═══ 缺陷分析初始化 ═══

        function initDefectAnalysis() {
            renderDefectPieChart();
            renderDefectTrendChart();
            renderDefectTable();
        }

        const defectsData = [
            { id: 'BUG-1024', title: '用户注册时手机号校验正则表达式不完整', module: '用户注册模块', priority: 'critical', status: 'open', time: '2026-04-21 08:33' },
            { id: 'BUG-1019', title: '支付回调接口超时未做重试处理', module: '支付流程', priority: 'critical', status: 'fixed', time: '2026-04-20 14:22' },
            { id: 'BUG-1015', title: '订单列表分页在数据为空时显示异常', module: '订单列表', priority: 'major', status: 'open', time: '2026-04-21 10:15' },
            { id: 'BUG-1012', title: '导出 Excel 文件名包含特殊字符导致下载失败', module: '报表导出', priority: 'major', status: 'resolved', time: '2026-04-19 16:40' },
            { id: 'BUG-1008', title: '搜索结果排序不稳定，刷新后顺序变化', module: '全局搜索', priority: 'minor', status: 'open', time: '2026-04-18 09:30' },
            { id: 'BUG-1003', title: '暗色模式下部分图标颜色不可见', module: 'UI主题', priority: 'minor', status: 'fixed', time: '2026-04-17 11:05' },
            { id: 'BUG-0998', title: '并发请求下 session 数据覆盖问题', module: '会话管理', priority: 'critical', status: 'open', time: '2026-04-21 07:48' },
            { id: 'BUG-0992', title: '密码重置邮件链接有效期配置错误', module: '安全认证', priority: 'major', status: 'open', time: '2026-04-16 13:20' },
            { id: 'BUG-0987', title: '移动端侧边栏展开时遮挡内容区域', module: '响应式布局', priority: 'minor', status: 'resolved', time: '2026-04-15 17:50' },
            { id: 'BUG-0981', title: '文件上传进度条在快速上传时不准确', module: '文件上传', priority: 'minor', status: 'fixed', time: '2026-04-14 10:00' },
            { id: 'BUG-0976', title: 'API 接口返回的 JSON 格式不一致', module: 'API层', priority: 'major', status: 'open', time: '2026-04-21 03:30' },
            { id: 'BUG-0970', title: '日志输出中敏感信息未脱敏处理', module: '日志系统', priority: 'major', status: 'open', time: '2026-04-13 15:18' },
        ];

        // 缺陷饼图
        function renderDefectPieChart() {
            const canvas = document.getElementById('defectPieChart');
            if (!canvas) return;
            if (window._defectPieInst) window._defectPieInst.destroy();

            const types = [
                { name: '功能缺陷', count: 5, color: '#ef4444' },
                { name: 'UI/样式',   count: 3, color: '#f59e0b' },
                { name: '性能问题',   count: 2, color: '#06b6d4' },
                { name: '安全漏洞',   count: 1, color: '#8b5cf6' },
                { name: '兼容性',     count: 1, color: '#22c55e' },
            ];

            window._defectPieInst = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: types.map(t => t.name),
                    datasets: [{ data: types.map(t => t.count), backgroundColor: types.map(t => t.color), borderWidth: 0, hoverOffset: 6 }]
                },
                options: { responsive: true, cutout: '62%', plugins: { legend: { display: false } } }
            });

            // 图例
            const legendEl = document.getElementById('defectPieLegend');
            if (legendEl) {
                legendEl.innerHTML = types.map(t => `
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px;">
                        <span style="width:12px;height:12px;border-radius:3px;background:${t.color};flex-shrink:0"></span>
                        <span style="color:var(--text-primary);flex:1">${t.name}</span>
                        <span style="color:var(--text-secondary);font-weight:600">${t.count}</span>
                    </div>
                `).join('');
            }
        }

        // 缺陷趋势图
        function renderDefectTrendChart() {
            const canvas = document.getElementById('defectTrendChart');
            if (!canvas) return;
            if (window._defectTrendInst) window._defectTrendInst.destroy();

            const days = ['04-13','04-14','04-15','04-16','04-17','04-18','04-19','04-20','04-21'];

            window._defectTrendInst = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: days,
                    datasets: [
                        {
                            label: '新增缺陷', data: [2,1,1,2,1,1,2,2,3],
                            borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4,
                            pointRadius: 4, pointBackgroundColor: '#ef4444'
                        },
                        {
                            label: '已修复', data: [1,1,0,0,2,1,1,1,1],
                            borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.4,
                            pointRadius: 4, pointBackgroundColor: '#22c55e'
                        }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { color: '#94a3b8', usePointStyle:true, padding: 16 } } },
                    scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1, color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.06)' } },
                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                    }
                }
            });
        }

        // 渲染缺陷表格
        function renderDefectTable() {
            const tbody = document.getElementById('defectTableBody');
            if (!tbody) return;

            tbody.innerHTML = defectsData.map(d => `
                <tr data-priority="${d.priority}">
                    <td><code style="font-size:12px;color:var(--primary)">${d.id}</code></td>
                    <td style="max-width:280px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d.title}</td>
                    <td>${d.module}</td>
                    <td><span class="defect-priority-tag ${d.priority}">${d.priority==='critical'?'严重':d.priority==='major'?'一般':'轻微'}</span></td>
                    <td><span class="defect-status-tag ${d.status}">${d.status==='open'?'待处理':d.status==='fixed'?'已修复':'已验证'}</span></td>
                    <td style="color:var(--text-secondary);font-size:12px;">${d.time}</td>
                </tr>
            `).join('');
        }

        // 缺陷筛选
        window.filterDefects = function(priority, btn) {
            btn.parentElement?.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('#defectTableBody tr').forEach(tr => {
                if (priority === 'all') {
                    tr.style.display = '';
                } else {
                    tr.style.display = tr.dataset.priority === priority ? '' : 'none';
                }
            });
        };

        // 渲染用例列表
        function renderCaseList(cases) {
            const list = document.getElementById('caseList');
            if (!list) return;

            list.innerHTML = cases.map(c => `
                <div class="case-item ${c.status}" data-status="${c.status}" data-name="${c.name.toLowerCase()}">
                    <div class="case-status-icon ${c.status}">
                        <i class="fas fa-${c.status === 'pass' ? 'check' : (c.status === 'fail' ? 'times' : 'forward')}"></i>
                    </div>
                    <div class="case-info">
                        <div class="case-name"><span style="color: var(--primary); font-weight: 600;">${c.id}</span> · ${c.name}</div>
                        <div class="case-desc">${c.module}</div>
                        ${c.error ? `<div class="case-error-msg">${c.error}</div>` : ''}
                    </div>
                    <div class="case-meta">
                        <span class="case-duration"><i class="fas fa-clock"></i> ${c.duration}s</span>
                    </div>
                    ${c.error ? `<button class="case-expand-btn" onclick="toggleCaseError(this)">
                        <i class="fas fa-chevron-down"></i></button>` : '<div style="width:26px"></div>'}
                </div>
            `).join('');
        }

        // 展开/收起错误信息
        window.toggleCaseError = function(btn) {
            const item = btn.closest('.case-item');
            item.classList.toggle('expanded');
            btn.querySelector('i').classList.toggle('fa-chevron-down');
            btn.querySelector('i').classList.toggle('fa-chevron-up');
        };

        // 筛选用例
        window.filterCases = function(filterType, btn) {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('#caseList .case-item').forEach(item => {
                if (filterType === 'all') {
                    item.style.display = '';
                } else {
                    item.style.display = item.dataset.status === filterType ? '' : 'none';
                }
            });
        };

        // 搜索用例
        window.searchCaseList = function(keyword) {
            const k = keyword.trim().toLowerCase();
            document.querySelectorAll('#caseList .case-item').forEach(item => {
                if (!k) { item.style.display = ''; return; }
                item.style.display = item.dataset.name.includes(k) ? '' : 'none';
            });
        };

        // 截图渲染
        function renderDetailScreenshots(failCases) {
            const grid = document.getElementById('detailScreenshotGrid');
            if (!grid) return;

            // 失败截图 + 一些成功截图
            const screenshots = failCases.length > 0
                ? [...failCases.map(c => ({ title: `${c.id} ${c.name}`, type: 'fail', icon: 'fa-bug' }))]
                  .concat([
                      { title: '首页加载完成', type: 'pass', icon: 'fa-home' },
                      { title: '数据展示正确性', type: 'pass', icon: 'fa-chart-bar' },
                      { title: '页面响应式布局', type: 'pass', icon: 'fa-mobile-alt' },
                  ])
                : [
                    { title: '登录页面验证', type: 'pass', icon: 'fa-sign-in-alt' },
                    { title: '数据查询结果', type: 'pass', icon: 'fa-table' },
                    { title: '导出功能测试', type: 'pass', icon: 'fa-download' },
                    { title: '权限控制验证', type: 'pass', icon: 'fa-shield-alt' },
                    { title: '并发请求处理', type: 'pass', icon: 'fa-layer-group' },
                    { title: '缓存机制验证', type: 'pass', icon: 'fa-database' },
                ];

            grid.innerHTML = screenshots.map(s => `
                <div class="detail-screenshot-card" onclick="openScreenshotLightbox(0)">
                    <div class="dsc-image"><i class="fas ${s.icon}"></i></div>
                    <div class="dsc-info">
                        <div class="dsc-title">${s.title}</div>
                        <div class="dsc-meta">
                            <span style="color:${s.type==='fail'?'var(--danger)':'var(--success)'}">
                                <i class="fas fa-circle" style="font-size:6px"></i> ${s.type==='fail'?'异常':'正常'}
                            </span>
                            <span>1920×1080</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // 日志渲染
        function renderDetailLogs(cases) {
            const viewer = document.getElementById('detailLogViewer');
            if (!viewer) return;

            let lines = [];
            const baseTime = new Date();
            baseTime.setHours(8, 30, 0, 0);

            lines.push({ time: '08:30:00', level: 'INFO', msg: `[${document.getElementById('detailTitle')?.textContent || '任务'}] 开始执行` });

            let elapsed = 0;
            cases.forEach((c, i) => {
                const d = parseFloat(c.duration);
                elapsed += d;
                baseTime.setSeconds(baseTime.getSeconds() + Math.round(d));
                const ts = baseTime.toTimeString().substring(0, 8);

                if (i % 20 === 0 && i > 0) {
                    lines.push({ time: ts, level: 'INFO', msg: `[${c.module}] 继续执行下一批用例...` });
                }
                lines.push({
                    time: ts,
                    level: c.status === 'pass' ? 'PASS' : (c.status === 'fail' ? 'FAIL' : 'WARN'),
                    msg: `${c.id}: ${c.name} ${c.status === 'pass' ? '- 执行成功 (' + c.duration + 's)' : (c.status === 'fail' ? `- 执行失败 [${c.error}]` : '- 已跳过')}`
                });
            });

            lines.push({ time: baseTime.toTimeString().substring(0,8), level: 'INFO', msg: '执行完毕，正在生成报告...' });

            viewer.innerHTML = lines.map(l =>
                `<div class="detail-log-line"><span class="dl-time">${l.time}</span><span class="dl-level ${l.level}">${l.level}</span><span class="dl-msg">${l.msg}</span></div>`
            ).join('');
        }

        // 时间线渲染
        function renderDetailTimeline(cases, taskName, durationMin) {
            const tl = document.getElementById('detailTimeline');
            if (!tl) return;

            let nodes = [];

            nodes.push({
                type: 'start',
                time: '08:30:00',
                title: '任务开始执行',
                body: `启动「${taskName}」任务，共 ${cases.length} 条用例`
            });

            // 按模块分组显示
            const byModule = {};
            cases.forEach(c => {
                if (!byModule[c.module]) byModule[c.module] = { pass: 0, fail: 0, skip: 0 };
                byModule[c.module][c.status]++;
            });

            Object.entries(byModule).forEach(([mod, stats], i) => {
                const h = 8 + Math.floor(i * durationMin / Object.keys(byModule).length / 60);
                const m = (i * durationMin / Object.keys(byModule).length) % 60;
                const hasFail = stats.fail > 0;

                nodes.push({
                    type: hasFail ? 'fail' : 'pass',
                    time: `${String(h).padStart(2,'0')}:${String(Math.floor(m)).padStart(2,'0')}:00`,
                    title: `${mod} 完成`,
                    body: `✅ 通过 ${stats.pass} · ${stats.fail > 0 ? '❌ 失败 ' + stats.fail + ' · ' : ''}⏭ 跳过 ${stats.skip}`
                });
            });

            nodes.push({
                type: 'end',
                time: `${8 + Math.floor(durationMin / 60)}:${String(durationMin % 60).padStart(2,'0')}:00`,
                title: '任务执行完毕',
                body: `总耗时约 ${durationMin} 分钟，通过率 ${(cases.filter(c=>c.status==='pass').length/cases.length*100).toFixed(1)}%`
            });

            tl.innerHTML = nodes.map(n =>
                `<div class="tl-node">
                    <div class="tl-dot ${n.type}"></div>
                    <div class="tl-card">
                        <div class="tl-card-header">
                            <span class="tl-card-title">${n.title}</span>
                            <span class="tl-card-time">${n.time}</span>
                        </div>
                        <div class="tl-card-body">${n.body}</div>
                    </div>
                </div>`
            ).join('');
        };

        // 切换开关
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
            });
        });

        // 文件上传
        document.getElementById('fileInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                showToast('success', '文件上传成功', `已读取: ${file.name}`);
            }
        });

        // 拖拽上传
        const uploadZone = document.getElementById('uploadZone');
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

        // 初始化
        document.addEventListener('DOMContentLoaded', () => {
            initTrendChart();
        });

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

        // 快捷提示点击
        document.querySelectorAll('.prompt-chip').forEach(chip => {
            chip.addEventListener('click', function() {
                const text = this.textContent.replace(/^[^\s]+\s/, '');
                const input = document.getElementById('aiInput');
                if (input) {
                    input.value = text;
                    input.focus();
                }
            });
        });

        // ═══ 全局搜索功能（输入补全 + ⌘K快捷键 + 键盘导航） ═══
        const globalSearchInput = document.getElementById('globalSearchInput');
        const globalSearchBox = document.getElementById('globalSearchBox');
        const searchDropdown = document.getElementById('searchDropdown');
        const searchResults = document.getElementById('searchResults');

        // 可搜索的数据源（从页面中提取）
        var searchData = [
            { type: 'project', name: '用户管理系统', desc: '包含用户注册、登录、个人中心等核心功能测试', icon: '👤', page: 'projects' },
            { type: 'project', name: '订单中心', desc: '订单创建、支付、退款全链路测试', icon: '🛒', page: 'projects' },
            { type: 'project', name: '支付中心', desc: '支付宝、微信、银联等多渠道支付测试', icon: '💳', page: 'projects' },
            { type: 'project', name: '移动端 App', desc: 'iOS/Android 双端核心流程测试', icon: '📱', page: 'projects' },
            { type: 'project', name: 'API 网关', desc: '接口自动化测试与性能压测', icon: '🔌', page: 'projects' },
            { type: 'project', name: '数据分析平台', desc: '数据采集、处理与可视化验证', icon: '📊', page: 'projects' },
            { type: 'page',    name: '仪表盘',     desc: '测试概览与实时监控', icon: '📈', page: 'dashboard' },
            { type: 'page',    name: '用例生成',   desc: 'AI 智能生成测试用例', icon: '✨', page: 'generate' },
            { type: 'page',    name: '执行任务',   desc: '手动或定时执行测试任务', icon: '▶️', page: 'execute' },
            { type: 'page',    name: '测试结果',   desc: '查看测试执行结果详情', icon: '📋', page: 'result' },
            { type: 'page',    name: '测试报告',   desc: '查看与分析测试报告', icon: '📑', page: 'report' },
            { type: 'page',    name: '智能分析',   desc: '基于 AI 的质量洞察', icon: '🧠', page: 'intelligence' },
            { type: 'page',    name: '定时任务',   desc: '配置自动化定时执行计划', icon: '⏰', page: 'schedule' },
            { type: 'page',    name: '执行环境',   desc: '管理测试运行环境配置', icon: '🖥️', page: 'environment' },
            { type: 'page',    name: '系统集成',   desc: 'API 密钥与第三方集成', icon: '🔗', page: 'integration' },
            { type: 'page',    name: '账号管理',   desc: '用户账号与权限配置', icon: '👥', page: 'settings' },
            { type: 'task',    name: '用户管理模块回归测试', desc: '正在进行 · 全量回归', icon: '🔄', page: 'execute' },
            { type: 'task',    name: '订单流程冒烟', desc: '每日 02:00 执行', icon: '📅', page: 'schedule' },
            { type: 'setting', name: '主题切换',   desc: '切换深色/浅色主题', icon: '🎨', page: 'settings' },
            { type: 'case',    name: '用户登录-正常场景', desc: '验证正确账号登录成功', icon: '✅', page: 'generate' },
            { type: 'case',    name: '订单支付-金额校验', desc: '验证订单金额计算正确性', icon: '✅', page: 'generate' },
            { type: 'case',    name: '注册表单-字段校验', desc: '必填项为空时提示错误', icon: '✅', page: 'generate' },
            { type: 'case',    name: 'API 接口超时重试', desc: '网络异常时的重试机制', icon: '✅', page: 'generate' }
        ];

        var activeSearchIndex = -1;
        var currentSearchItems = [];

        function highlightMatch(text, query) {
            if (!query) return text;
            var q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return text.replace(new RegExp('(' + q + ')', 'gi'), '<mark>$1</mark>');
        }

        function renderSearchResults(query) {
            if (!query || !query.trim()) {
                showRecentSearches();
                return;
            }

            var q = query.toLowerCase().trim();
            var filtered = searchData.filter(function(item) {
                return item.name.toLowerCase().indexOf(q) !== -1 ||
                       item.desc.toLowerCase().indexOf(q) !== -1 ||
                       item.type.indexOf(q) !== -1;
            });

            if (filtered.length === 0) {
                searchResults.innerHTML = '<div class="search-empty"><i class="fas fa-search"></i>没有找到相关结果<br><span style="font-size:12px;opacity:0.6">试试其他关键词</span></div>';
                showDropdown();
                return;
            }

            // 按类型分组
            var groups = {};
            var groupOrder = ['page', 'project', 'task', 'case', 'setting'];
            var groupLabels = { page:'页面导航', project:'项目', task:'任务', case:'测试用例', setting:'设置' };

            filtered.forEach(function(item) {
                if (!groups[item.type]) groups[item.type] = [];
                groups[item.type].push(item);
            });

            var html = '';
            groupOrder.forEach(function(type) {
                if (groups[type]) {
                    html += '<div class="search-group-label">' + groupLabels[type] + '</div>';
                    groups[type].forEach(function(item, idx) {
                        html += '<div class="search-item" data-page="' + item.page + '" data-name="' + item.name + '" data-type="' + item.type + '">' +
                            '<div class="search-item-icon ' + item.type + '">' + item.icon + '</div>' +
                            '<div class="search-item-info">' +
                                '<div class="search-item-title">' + highlightMatch(item.name, query) + '</div>' +
                                '<div class="search-item-desc">' + highlightMatch(item.desc, query) + '</div>' +
                            '</div>' +
                            '<span class="search-item-type">' + item.type + '</span>' +
                        '</div>';
                    });
                }
            });

            html += '<div class="search-hint"><span><kbd>↑↓</kbd> 导航 <kbd>↵</kbd> 跳转 <kbd>Esc</kbd> 关闭</span></div>';

            searchResults.innerHTML = html;
            currentSearchItems = Array.from(searchResults.querySelectorAll('.search-item'));
            activeSearchIndex = -1;

            // 绑定点击事件
            currentSearchItems.forEach(function(el) {
                el.addEventListener('click', function() {
                    navigateToResult(this.dataset.page, this.dataset.name);
                });
            });

            showDropdown();
        }

        function showRecentSearches() {
            var recent = JSON.parse(localStorage.getItem('aitest_recent_search') || '[]').slice(0, 5);
            var html = '';
            if (recent.length > 0) {
                html += '<div class="search-group-label">最近搜索</div>';
                recent.forEach(function(name) {
                    var found = searchData.find(function(s) { return s.name === name; });
                    var info = found || { type: 'page', icon: '📄', page: 'dashboard', desc: '' };
                    html += '<div class="search-item" data-page="' + info.page + '" data-name="' + name + '">' +
                        '<div class="search-item-icon ' + info.type + '">' + info.icon + '</div>' +
                        '<div class="search-item-info"><div class="search-item-title">' + name + '</div></div>' +
                    '</div>';
                });
                currentSearchItems = [];
                searchResults.innerHTML = html;
                Array.from(searchResults.querySelectorAll('.search-item')).forEach(function(el) {
                    el.addEventListener('click', function() {
                        navigateToResult(this.dataset.page, this.dataset.name);
                    });
                });
            } else {
                html += '<div class="search-empty" style="padding:20px;">' +
                    '<i class="fas fa-keyboard"></i>输入关键词搜索<br>' +
                    '<span style="font-size:11px;opacity:0.5;margin-top:4px;display:block">支持搜索项目、用例、报告和页面导航</span></div>';
                searchResults.innerHTML = html;
            }
            showDropdown();
        }

        function showDropdown() {
            searchDropdown.style.display = 'block';
            globalSearchBox.classList.add('focused');
        }

        function hideDropdown() {
            searchDropdown.style.display = 'none';
            globalSearchBox.classList.remove('focused');
            activeSearchIndex = -1;
            currentSearchItems = [];
        }

        function saveRecentSearch(query) {
            try {
                var recent = JSON.parse(localStorage.getItem('aitest_recent_search') || '[]');
                recent = recent.filter(function(r) { return r !== query; });
                recent.unshift(query);
                localStorage.setItem('aitest_recent_search', JSON.stringify(recent.slice(0, 10)));
            } catch(e) {}
        }

        function navigateToResult(pageName, itemName) {
            hideDropdown();
            globalSearchInput.value = '';
            
            if (itemName) saveRecentSearch(itemName);

            // 切换到目标页面
            if (typeof switchPage === 'function') {
                switchPage(pageName);
            } else {
                document.querySelectorAll('.sidebar-item').forEach(function(item) {
                    if (item.dataset.page === pageName) item.click();
                });
            }

            showToast('success', '已跳转', '前往「' + itemName + '」');
        }

        // 输入事件 - 带防抖
        var searchDebounce = null;
        globalSearchInput.addEventListener('input', function(e) {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(function() {
                renderSearchResults(e.target.value);
            }, 120);
        });

        // 聚焦事件
        globalSearchInput.addEventListener('focus', function() {
            if (this.value.trim()) {
                renderSearchResults(this.value);
            } else {
                showRecentSearches();
            }
        });

        // 键盘导航
        globalSearchInput.addEventListener('keydown', function(e) {
            if (!currentSearchItems.length) {
                if (e.key === 'Escape') { this.blur(); hideDropdown(); }
                return;
            }

            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    activeSearchIndex = Math.min(activeSearchIndex + 1, currentSearchItems.length - 1);
                    updateActiveItem();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    activeSearchIndex = Math.max(activeSearchIndex - 1, 0);
                    updateActiveItem();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (activeSearchIndex >= 0 && currentSearchItems[activeSearchIndex]) {
                        currentSearchItems[activeSearchIndex].click();
                    } else if (this.value.trim()) {
                        // 无高亮时搜索当前输入
                        saveRecentSearch(this.value.trim());
                        showToast('info', '搜索', '正在搜索: ' + this.value.trim());
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.blur();
                    hideDropdown();
                    break;
            }
        });

        function updateActiveItem() {
            currentSearchItems.forEach(function(el, i) {
                el.classList.toggle('active', i === activeSearchIndex);
            });
            if (activeSearchIndex >= 0 && currentSearchItems[activeSearchIndex]) {
                currentSearchItems[activeSearchIndex].scrollIntoView({ block: 'nearest' });
            }
        }

        // 点击外部关闭
        document.addEventListener('mousedown', function(e) {
            if (!globalSearchBox.contains(e.target)) {
                hideDropdown();
            }
        });

        // ⌘K / Ctrl+K 快捷键聚焦搜索框
        document.addEventListener('keydown', function(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                globalSearchInput.focus();
                globalSearchInput.select();
            }
        });

        // 项目卡片点击
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', function() {
                showToast('info', '项目详情', '正在加载项目详情...');
            });
        });

        // 模块卡片点击效果
        document.querySelectorAll('.module-card').forEach(card => {
            card.style.cursor = 'pointer';
        });

        // 刷新按钮
        document.querySelectorAll('.btn i.fa-sync, .btn i.fa-refresh').forEach(icon => {
            icon.parentElement.addEventListener('click', function(e) {
                if (!this.classList.contains('btn')) {
                    this.style.transform = 'rotate(180deg)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 500);
                }
            });
        });

        // 表格行悬停效果增强
        document.querySelectorAll('.task-table tbody tr').forEach(row => {
            row.style.cursor = 'pointer';
            row.addEventListener('click', function() {
                const name = this.querySelector('div[style*="font-weight: 500"]');
                if (name) {
                    showToast('info', '查看详情', `正在加载: ${name.textContent}`);
                }
            });
        });

        // 统计卡片点击
        document.querySelectorAll('.stat-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                const label = this.querySelector('.stat-label');
                if (label) {
                    showToast('info', '统计详情', `${label.textContent} 详细数据`);
                }
            });
        });

        // 快捷功能按钮点击
        document.querySelectorAll('.quick-action').forEach(action => {
            action.addEventListener('click', function() {
                const title = this.querySelector('h4');
                if (title) {
                    showToast('info', title.textContent, '正在加载...');
                }
            });
        });

        // 导出格式按钮
        document.querySelectorAll('.card .btn-secondary').forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon && icon.classList.contains('fa-file-pdf')) {
                btn.addEventListener('click', function() {
                    showToast('success', '导出 PDF', '正在生成 PDF 报告...');
                });
            } else if (icon && icon.classList.contains('fa-file-excel')) {
                btn.addEventListener('click', function() {
                    showToast('success', '导出 Excel', '正在生成数据表格...');
                });
            }
        });

        // AI 抽屉消息发送
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

        // 确保 sendDrawerMessage 可被调用
        if (typeof window.sendDrawerMessage !== 'function') {
            window.sendDrawerMessage = function() {
                const input = document.getElementById('drawerInput');
                if (!input) return;
                const msg = input.value.trim();
                if (!msg) return;
                window.appendAiMsg(msg, 'user');
                input.value = '';
                window.showAiTyping();
                setTimeout(() => {
                    window.removeAiTyping();
                    window.appendAiMsg('好的，已收到您的请求，正在处理中...', 'ai');
                }, 1500);
            };
        }

        // 模拟实时日志更新
        setInterval(() => {
            const logViewer = document.getElementById('logViewer');
            if (!logViewer || !document.getElementById('page-result').classList.contains('active')) return;

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

        // ═══════════════════════════════════════════
        // 并发设置功能
        // ═══════════════════════════════════════════
        
        // 并发设置状态 - 已在 js/concurrency.js 中声明
        /* let concurrencySettings = {
            execMode: 'parallel',
            concurrency: 50,
            caseTimeout: 300,
            taskTimeout: 7200,
            retryCount: 2,
            retryInterval: 5,
            fastFail: true,
            batchSize: 10,
            batchInterval: 1
        }; */

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
            document.getElementById('concurrencyOverlay').classList.add('show');
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
            slider.value = concurrencySettings.concurrency;
            document.getElementById('concurrencyValue').textContent = concurrencySettings.concurrency;
            
            // 超时设置
            document.getElementById('caseTimeout').value = concurrencySettings.caseTimeout;
            document.getElementById('taskTimeout').value = concurrencySettings.taskTimeout;
            
            // 重试策略
            document.getElementById('retryCount').value = concurrencySettings.retryCount;
            document.getElementById('retryInterval').value = concurrencySettings.retryInterval;
            
            // 快速失败开关
            document.getElementById('fastFailSwitch').checked = concurrencySettings.fastFail;
            
            // 高级选项
            document.getElementById('batchSize').value = concurrencySettings.batchSize;
            document.getElementById('batchInterval').value = concurrencySettings.batchInterval;
        }

        // 从表单获取设置
        function getSettingsFromForm() {
            // 执行模式
            const checkedMode = document.querySelector('input[name="execMode"]:checked');
            concurrencySettings.execMode = checkedMode ? checkedMode.value : 'parallel';
            
            // 并发数量
            concurrencySettings.concurrency = parseInt(document.getElementById('concurrencySlider').value);
            
            // 超时设置
            concurrencySettings.caseTimeout = parseInt(document.getElementById('caseTimeout').value);
            concurrencySettings.taskTimeout = parseInt(document.getElementById('taskTimeout').value);
            
            // 重试策略
            concurrencySettings.retryCount = parseInt(document.getElementById('retryCount').value);
            concurrencySettings.retryInterval = parseInt(document.getElementById('retryInterval').value);
            concurrencySettings.fastFail = document.getElementById('fastFailSwitch').checked;
            
            // 高级选项
            concurrencySettings.batchSize = parseInt(document.getElementById('batchSize').value);
            concurrencySettings.batchInterval = parseInt(document.getElementById('batchInterval').value);
            
            return concurrencySettings;
        }

        // 关闭并发设置面板
        function closeConcurrencySettings() {
            document.getElementById('concurrencyOverlay').classList.remove('show');
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

        // 绑定并发设置滑块事件
        document.addEventListener('DOMContentLoaded', function() {
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
        });

        // ═══════════════════════════════════════════
        // 账号管理功能
        // ═══════════════════════════════════════════

        // 账号数据
        let accountsData = [
            { id: 1, name: '李明', username: 'liming', email: 'liming@company.com', role: 'admin', status: true, createTime: '2024-01-15', lastLogin: '5 分钟前' },
            { id: 2, name: '王芳', username: 'wangfang', email: 'wangfang@company.com', role: 'admin', status: true, createTime: '2024-02-20', lastLogin: '30 分钟前' },
            { id: 3, name: '张伟', username: 'zhangwei', email: 'zhangwei@company.com', role: 'tester', status: true, createTime: '2024-03-10', lastLogin: '2 小时前' },
            { id: 4, name: '陈静', username: 'chenjing', email: 'chenjing@company.com', role: 'tester', status: true, createTime: '2024-04-05', lastLogin: '1 小时前' },
            { id: 5, name: '刘洋', username: 'liuyang', email: 'liuyang@company.com', role: 'viewer', status: false, createTime: '2024-05-12', lastLogin: '3 天前' }
        ];

        let currentEditId = null;

        // ═══════════════════════════════════════════
        // 角色权限管理功能
        // ═══════════════════════════════════════════
        
        let roleEditMode = false; // 角色权限编辑模式标志
        let originalPermissions = {}; // 保存原始权限配置

        // 初始化角色权限配置
        function initRolePermissions() {
            const editBtn = document.getElementById('editRoleBtn');
            const saveBtn = document.getElementById('saveRoleBtn');
            const cancelBtn = document.getElementById('cancelRoleBtn');
            const roleCard = document.getElementById('rolePermissionCard');
            
            // 保存原始权限配置
            saveOriginalPermissions();
            
            // 初始状态：所有权限设置为只读
            setPermissionReadOnly(true);
            
            // 隐藏保存和取消按钮
            if (saveBtn) saveBtn.style.display = 'none';
            if (cancelBtn) cancelBtn.style.display = 'none';
            
            // 显示修改按钮
            if (editBtn) {
                editBtn.style.display = 'inline-flex';
            }
        }

        // 保存原始权限配置
        function saveOriginalPermissions() {
            const permissionToggles = document.querySelectorAll('.permission-toggle');
            originalPermissions = {};
            permissionToggles.forEach((toggle, index) => {
                const checkbox = toggle.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    originalPermissions[index] = checkbox.checked;
                }
            });
        }

        // 设置权限为只读/可编辑状态
        function setPermissionReadOnly(readonly) {
            const permissionToggles = document.querySelectorAll('.permission-toggle');
            permissionToggles.forEach(toggle => {
                if (readonly) {
                    toggle.classList.remove('editable');
                } else {
                    toggle.classList.add('editable');
                }
            });
        }

        // 启用角色编辑模式
        window.enableRoleEdit = function() {
            roleEditMode = true;
            
            // 切换按钮显示
            const editBtn = document.getElementById('editRoleBtn');
            const saveBtn = document.getElementById('saveRoleBtn');
            const cancelBtn = document.getElementById('cancelRoleBtn');
            
            if (editBtn) editBtn.style.display = 'none';
            if (saveBtn) saveBtn.style.display = 'inline-flex';
            if (cancelBtn) cancelBtn.style.display = 'inline-flex';
            
            // 启用权限选择 - 移除只读状态
            setPermissionReadOnly(false);
            
            showToast('info', '提示', '已进入编辑模式，请修改权限后保存');
        };

        // 保存角色权限
        window.saveRolePermissions = function() {
            roleEditMode = false;
            
            // 切换按钮显示
            const editBtn = document.getElementById('editRoleBtn');
            const saveBtn = document.getElementById('saveRoleBtn');
            const cancelBtn = document.getElementById('cancelRoleBtn');
            
            if (editBtn) editBtn.style.display = 'inline-flex';
            if (saveBtn) saveBtn.style.display = 'none';
            if (cancelBtn) cancelBtn.style.display = 'none';
            
            // 禁用权限选择 - 设置为只读状态
            setPermissionReadOnly(true);
            
            // 这里可以添加保存到服务器的逻辑
            // 暂时使用 localStorage 保存
            localStorage.setItem('rolePermissions', JSON.stringify(getCurrentPermissions()));
            
            showToast('success', '保存成功', '角色权限配置已保存');
        };

        // 取消角色编辑
        window.cancelRoleEdit = function() {
            roleEditMode = false;
            
            // 切换按钮显示
            const editBtn = document.getElementById('editRoleBtn');
            const saveBtn = document.getElementById('saveRoleBtn');
            const cancelBtn = document.getElementById('cancelRoleBtn');
            
            if (editBtn) editBtn.style.display = 'inline-flex';
            if (saveBtn) saveBtn.style.display = 'none';
            if (cancelBtn) cancelBtn.style.display = 'none';
            
            // 恢复原始权限配置
            restoreOriginalPermissions();
            
            // 禁用权限选择
            setPermissionReadOnly(true);
            
            showToast('info', '提示', '已取消修改');
        };

        // 获取当前权限配置
        function getCurrentPermissions() {
            const permissions = {};
            const roles = ['admin', 'tester', 'viewer'];
            roles.forEach(role => {
                const roleCard = document.querySelector(`.role-config-card:has(.role-icon.${role})`);
                if (roleCard) {
                    const checkboxes = roleCard.querySelectorAll('input[type="checkbox"]');
                    permissions[role] = Array.from(checkboxes).map(cb => cb.checked);
                }
            });
            return permissions;
        }

        // 恢复原始权限配置
        function restoreOriginalPermissions() {
            const permissionToggles = document.querySelectorAll('.permission-toggle');
            permissionToggles.forEach((toggle, index) => {
                const checkbox = toggle.querySelector('input[type="checkbox"]');
                if (checkbox && originalPermissions[index] !== undefined) {
                    checkbox.checked = originalPermissions[index];
                }
            });
        }

        // 更新角色权限
        window.updateRolePermissions = function(role) {
            // 编辑模式下才触发更新
            if (!roleEditMode) {
                showToast('warning', '提示', '请先点击"修改"按钮进入编辑模式');
                return;
            }
            // 实时更新逻辑（可选）
        };

        // 初始化账号管理
        function initAccountManagement() {
            // 绑定标签切换
            const tabs = document.querySelectorAll('#accountTabs .card-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    filterAccounts(this.dataset.role);
                });
            });

            // 初始化角色权限配置
            initRolePermissions();

            // 绑定状态开关 - 确保切换时同步 active 类
            const statusToggle = document.getElementById('accountStatus');
            if (statusToggle) {
                statusToggle.addEventListener('change', function() {
                    var label = this.parentElement;
                    var statusLabelEl = document.getElementById('statusLabel');
                    if (this.checked) {
                        label.classList.add('active');
                        if (statusLabelEl) statusLabelEl.textContent = '启用';
                    } else {
                        label.classList.remove('active');
                        if (statusLabelEl) statusLabelEl.textContent = '禁用';
                    }
                });
            }
        }

        // 以下账号管理函数已在下方定义为 window.xxx 全局函数

        // 页面加载时初始化
        console.log('脚本开始加载');
        
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded触发');
            try {
                initAccountManagement();
            } catch(e) {
                console.error('initAccountManagement错误:', e);
            }
            
            // 绑定新增账号按钮
            const addBtn = document.getElementById('addAccountBtn');
            console.log('addAccountBtn元素:', addBtn);
            if (addBtn) {
                addBtn.onclick = function() {
                    console.log('新增账号按钮被点击');
                    showAddAccountModal();
                };
            }
            
            console.log('账号管理模块初始化完成');
        });

        // 绑定账号管理按钮到全局函数
        document.addEventListener('DOMContentLoaded', function() {
            var btn = document.getElementById('addAccountBtn');
            if (btn) btn.onclick = showAddAccountModal;
        });
        
        // 全局函数 - 编辑账号
        window.editAccount = function(id) {
            var account = accountsData.find(function(a) { return a.id === id; });
            if (!account) return;
            
            currentEditId = id;
            var modal = document.getElementById('accountModal');
            if (modal) {
                modal.classList.add('show');
                document.getElementById('accountModalTitle').innerHTML = '<i class="fas fa-user-edit"></i> 编辑账号';
                document.getElementById('editAccountId').value = account.id;
                document.getElementById('accountUsername').value = account.name;
                document.getElementById('accountEmail').value = account.email;
                document.getElementById('accountPassword').value = '';
                document.getElementById('accountPassword').required = false;
                document.getElementById('accountRole').value = account.role;
                document.getElementById('accountStatus').checked = account.status;
                // 同步开关样式
                var statusLabelEl = document.getElementById('accountStatus');
                if (statusLabelEl) {
                    if (account.status) {
                        statusLabelEl.parentElement.classList.add('active');
                    } else {
                        statusLabelEl.parentElement.classList.remove('active');
                    }
                }
                document.getElementById('statusLabel').textContent = account.status ? '启用' : '禁用';
            }
        };
        
        window.saveAccount = function() {
            var username = document.getElementById('accountUsername').value.trim();
            var email = document.getElementById('accountEmail').value.trim();
            var password = document.getElementById('accountPassword').value;
            var role = document.getElementById('accountRole').value;
            var status = document.getElementById('accountStatus').checked;

            if (!username) {
                showToast('error', '错误', '请输入用户名');
                return;
            }

            if (!email) {
                showToast('error', '错误', '请输入邮箱');
                return;
            }

            if (currentEditId) {
                var index = accountsData.findIndex(function(a) { return a.id === currentEditId; });
                if (index !== -1) {
                    accountsData[index].name = username;
                    accountsData[index].email = email;
                    accountsData[index].role = role;
                    accountsData[index].status = status;
                }
                showToast('success', '成功', '账号已更新');
            } else {
                if (!password || password.length < 6) {
                    showToast('error', '错误', '密码至少6位');
                    return;
                }

                var newId = Math.max.apply(Math, accountsData.map(function(a) { return a.id; })) + 1;
                accountsData.push({
                    id: newId,
                    name: username,
                    username: username.toLowerCase(),
                    email: email,
                    role: role,
                    status: status,
                    createTime: new Date().toISOString().split('T')[0],
                    lastLogin: '从未登录'
                });
                showToast('success', '成功', '账号已创建');
            }

            renderAccountTable();
            updateAccountStats();
            closeAccountModal();
        };

        // 全局函数 - 删除账号
        window.deleteAccount = function(id) {
            if (!confirm('确定要删除此账号吗？')) return;

            accountsData = accountsData.filter(function(a) { return a.id !== id; });
            renderAccountTable();
            updateAccountStats();
            showToast('success', '成功', '账号已删除');
        };

        // 全局函数 - 重置密码
        window.resetPassword = function(id) {
            document.getElementById('resetPasswordAccountId').value = id;
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            document.getElementById('resetPasswordModal').classList.add('show');
        };

        // 全局函数 - 关闭重置密码模态框
        window.closeResetPasswordModal = function() {
            document.getElementById('resetPasswordModal').classList.remove('show');
        };

        // 全局函数 - 确认重置密码
        window.confirmResetPassword = function() {
            var newPwd = document.getElementById('newPassword').value;
            var confirmPwd = document.getElementById('confirmPassword').value;

            if (!newPwd || newPwd.length < 6) {
                showToast('error', '错误', '密码至少6位');
                return;
            }

            if (newPwd !== confirmPwd) {
                showToast('error', '错误', '两次密码不一致');
                return;
            }

            showToast('success', '成功', '密码已重置');
            closeResetPasswordModal();
        };

        // 全局函数 - 切换账号状态
        window.toggleAccountStatus = function(id, enable) {
            var account = accountsData.find(function(a) { return a.id === id; });
            if (!account) return;

            account.status = enable;
            renderAccountTable();
            updateAccountStats();
            showToast('success', '成功', enable ? '账号已启用' : '账号已禁用');
        };

        // 全局函数 - 筛选账号
        window.filterAccounts = function(role) {
            renderAccountTable(role === 'all' ? null : role);
        };

        // 全局函数 - 切换密码可见性
        window.togglePasswordVisibility = function(inputId, btn) {
            var input = document.getElementById(inputId);
            var icon = btn.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        };

        // 全局函数 - 更新角色权限
        window.updateRolePermissions = function(role) {
            showToast('success', '成功', role + ' 角色权限已保存');
        };
