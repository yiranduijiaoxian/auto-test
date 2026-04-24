// ═══════════════════════════════════════════
// 主题切换功能模块
// ═══════════════════════════════════════════

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('aitestpro-theme') || 'dark';
    setTheme(savedTheme);
}

// 设置主题
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

// 切换主题
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // 显示切换提示
    const themeName = newTheme === 'light' ? '浅色模式' : '深色模式';
    showToast('success', '主题切换', `已切换到${themeName}`);
}

// 选择主题（账号设置页面）
function selectTheme(element) {
    const themeOptions = document.querySelectorAll('.theme-option');
    if (themeOptions) {
        themeOptions.forEach(opt => opt.classList.remove('active'));
    }
    if (element) element.classList.add('active');

    const theme = element.dataset.theme;
    if (theme) setTheme(theme);
}

// 绑定主题切换按钮
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}
