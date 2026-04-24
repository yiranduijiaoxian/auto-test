// ═══════════════════════════════════════════
// 侧边栏功能模块
// ═══════════════════════════════════════════

// 初始化侧边栏
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const toggleBtn = document.getElementById('sidebarToggle');

    if (!sidebar || !mainContent || !toggleBtn) return;

    // 恢复保存的状态
    const isCollapsed = localStorage.getItem('aitestpro-sidebar-collapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }

    // 绑定折叠按钮
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        localStorage.setItem('aitestpro-sidebar-collapsed', sidebar.classList.contains('collapsed'));
    });
}

// 初始化侧边栏菜单分组折叠
function initSidebarGroups() {
    const groups = document.querySelectorAll('.sidebar-group');
    groups.forEach(function(group) {
        const header = group.querySelector('.sidebar-group-header');
        if (header) {
            header.addEventListener('click', function(e) {
                // 不触发行击事件
                e.stopPropagation();
                group.classList.toggle('collapsed');
            });
        }
    });
}

// 导航栏下拉菜单功能
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
