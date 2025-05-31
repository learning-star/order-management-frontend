/**
 * UI工具类 - 处理通用的UI交互
 */
class UIUtils {
    /**
     * 显示加载状态
     */
    static showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.add('show');
        } else {
            loading.classList.remove('show');
        }
    }

    /**
     * 显示通知
     */
    static showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const icon = notification.querySelector('.notification-icon');
        const messageEl = notification.querySelector('.notification-message');

        // 设置图标
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        icon.className = `notification-icon ${icons[type]}`;
        
        // 设置消息和类型
        messageEl.textContent = message;
        notification.className = `notification ${type}`;
        
        // 显示通知
        notification.classList.add('show');

        // 3秒后自动隐藏
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    /**
     * 显示模态框
     */
    static showModal(title, content, confirmCallback) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('modal').classList.add('show');
        
        // 存储回调函数
        window.currentModalCallback = confirmCallback;
    }

    /**
     * 隐藏模态框
     */
    static hideModal() {
        document.getElementById('modal').classList.remove('show');
        window.currentModalCallback = null;
    }

    /**
     * 处理模态框确认
     */
    static handleModalConfirm() {
        if (window.currentModalCallback) {
            window.currentModalCallback();
        }
    }

    /**
     * 格式化日期时间
     */
    static formatDateTime(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN');
    }

    /**
     * 获取状态文本
     */
    static getStatusText(status) {
        const statusMap = {
            pending: '待处理',
            processing: '处理中',
            completed: '已完成',
            cancelled: '已取消',
            active: '活跃',
            inactive: '非活跃'
        };
        return statusMap[status] || status;
    }

    /**
     * 切换主题
     */
    static toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    /**
     * 更新主题图标
     */
    static updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    /**
     * 设置主题
     */
    static setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }
}