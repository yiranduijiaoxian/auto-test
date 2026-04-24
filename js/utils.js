// ═══════════════════════════════════════════
// 工具函数模块
// ═══════════════════════════════════════════

// Toast 通知
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${icons[type] || icons.info}"></i></div>
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
function showModal(title, content, buttons) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = content;

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.add('show');
}

function hideModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.remove('show');
}

// 页面切换
function switchPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // 显示目标页面
    const targetPage = document.getElementById('page-' + pageName);
    if (targetPage) targetPage.classList.add('active');

    // 更新侧边栏
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });

    // 初始化图表
    if (typeof initCharts === 'function') {
        initCharts(pageName);
    }
}

// 别名：用于用户下拉菜单导航
function switchToPage(pageName) {
    switchPage(pageName);
}

// 初始化页面交互
function initPageInteractions() {
    // 切换开关
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
        });
    });

    // 侧边栏点击
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            if (page) switchPage(page);
        });
    });

    // 模态框点击遮罩关闭
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) hideModal();
        });
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

    // 项目卡片点击
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            showToast('info', '项目详情', '正在加载项目详情...');
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

    // 刷新按钮动画
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
}
