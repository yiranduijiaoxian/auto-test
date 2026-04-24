// ═══════════════════════════════════════════
// 账号设置页面功能模块
// ═══════════════════════════════════════════

// 切换账号设置选项卡
function switchAccountTab(tabName) {
    const tabs = document.querySelectorAll('.account-tab');
    const contents = document.querySelectorAll('.account-content');

    if (tabs) {
        tabs.forEach(tab => tab.classList.remove('active'));
    }
    if (contents) {
        contents.forEach(content => content.classList.remove('active'));
    }

    const activeTab = document.querySelector(`.account-tab[data-tab="${tabName}"]`);
    const activeContent = document.getElementById(`tab-${tabName}`);

    if (activeTab) activeTab.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
}

// 保存账号设置
function saveAccountSettings() {
    const name = document.getElementById('userName')?.value || '';
    const nickname = document.getElementById('userNickname')?.value || '';
    const email = document.getElementById('userEmail')?.value || '';
    const phone = document.getElementById('userPhone')?.value || '';
    const dept = document.getElementById('userDept')?.value || '';
    const title = document.getElementById('userTitle')?.value || '';

    // 保存到本地存储
    localStorage.setItem('aitestpro-user-name', name);
    localStorage.setItem('aitestpro-user-nickname', nickname);
    localStorage.setItem('aitestpro-user-email', email);
    localStorage.setItem('aitestpro-user-phone', phone);
    localStorage.setItem('aitestpro-user-dept', dept);
    localStorage.setItem('aitestpro-user-title', title);

    showToast('success', '保存成功', '账号信息已更新');
}

// 重置账号表单
function resetAccountForm() {
    const fields = {
        'userName': '李明',
        'userNickname': '小明',
        'userEmail': 'liming@company.com',
        'userPhone': '138****8888',
        'userDept': 'qa',
        'userTitle': '测试工程师'
    };

    Object.entries(fields).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    });

    showToast('info', '已重置', '表单已恢复为原始值');
}

// 切换密码可见性
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const icon = input.nextElementSibling?.querySelector('i');
    if (!icon) return;

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

// 修改密码
function changePassword() {
    const currentPwd = document.getElementById('currentPwd')?.value || '';
    const newPwd = document.getElementById('newPwd')?.value || '';
    const confirmPwd = document.getElementById('confirmPwd')?.value || '';

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

    // 清空表单
    ['currentPwd', 'newPwd', 'confirmPwd'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

// 启用两步验证
function enableTwoFactor(type) {
    if (type === 'sms') {
        showToast('info', '验证手机', '验证码已发送，请查收短信');
    } else {
        showToast('info', '身份验证器', '请使用身份验证器APP扫描二维码');
    }
}

// 切换通知设置
function toggleNotification(element) {
    element.classList.toggle('active');
}

// 预览头像
function previewAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('avatarPreview');
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">`;
            }
        };
        reader.readAsDataURL(input.files[0]);
        showToast('success', '头像已更新', '点击保存按钮以保存更改');
    }
}

// 导出数据
function exportAllData() {
    showToast('info', '导出数据', '正在准备您的数据...');
    setTimeout(() => {
        showToast('success', '导出完成', '数据已保存为 JSON 文件');
    }, 1500);
}

// 确认删除账号
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
