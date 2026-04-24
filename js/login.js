// ═══════════════════════════════════════════
// 登录功能模块
// ═══════════════════════════════════════════

// 登录页面初始化
function initLogin() {
    // 检查是否已登录
    const isLoggedIn = localStorage.getItem('aitestpro-logged-in') === 'true';
    if (isLoggedIn) {
        showMainApp();
        return;
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
        const usernameInput = document.getElementById('loginUsername');
        const rememberCheckbox = document.getElementById('rememberMe');
        if (usernameInput) usernameInput.value = savedUsername;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
}

// 显示主应用
function showMainApp() {
    const loginPage = document.getElementById('loginPage');
    const appContainer = document.getElementById('appContainer');

    if (!loginPage || !appContainer) return;

    loginPage.style.opacity = '0';
    loginPage.style.transform = 'scale(0.95)';

    setTimeout(() => {
        loginPage.style.display = 'none';
        appContainer.style.display = 'block';
        appContainer.style.opacity = '0';
        appContainer.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            appContainer.style.opacity = '1';
        }, 50);
    }, 300);

    // 初始化图表
    if (typeof initCharts === 'function') {
        initCharts('dashboard');
    }
}

// 处理登录
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginBtn = document.getElementById('loginBtn');

    if (!username || !password) {
        showToast('error', '请填写', '请输入用户名和密码');
        return;
    }

    // 显示加载状态
    if (loginBtn) loginBtn.classList.add('loading');

    // 模拟登录验证
    setTimeout(() => {
        // 演示账号验证
        if (username === 'admin' && password === 'admin123') {
            // 登录成功
            localStorage.setItem('aitestpro-logged-in', 'true');
            localStorage.setItem('aitestpro-username', username);

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
            if (loginBtn) loginBtn.classList.remove('loading');
            showToast('error', '登录失败', '用户名或密码错误');
            const pwdInput = document.getElementById('loginPassword');
            if (pwdInput) pwdInput.value = '';
        }
    }, 1000);
}

// 切换密码显示
function toggleLoginPassword() {
    const input = document.getElementById('loginPassword');
    const toggleBtn = document.getElementById('loginPasswordToggle');

    if (!input || !toggleBtn) return;

    const icon = toggleBtn.querySelector('i');
    if (!icon) return;

    // 切换 type 属性
    if (input.getAttribute('type') === 'password') {
        input.setAttribute('type', 'text');
        icon.className = 'fas fa-eye-slash';
    } else {
        input.setAttribute('type', 'password');
        icon.className = 'fas fa-eye';
    }
}

// 退出登录
function logout() {
    localStorage.removeItem('aitestpro-logged-in');
    location.reload();
}
