/**
 * 订单管理系统 - 主应用程序（重构版）
 */
class OrderManagementApp {
    constructor() {
        this.currentSection = 'orders';
        this.init();
    }

    /**
     * 初始化应用程序
     */
    async init() {
        this.setupManagers();
        this.setupEventListeners();
        UIUtils.setupTheme();
        await this.loadInitialData();
        UIUtils.showLoading(false);
    }

    /**
     * 设置管理器实例
     */
    setupManagers() {
        window.orderManager = new OrderManager();
        window.userManager = new UserManager();
        window.productManager = new ProductManager();
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 主题切换
        document.getElementById('themeToggle').addEventListener('click', () => {
            UIUtils.toggleTheme();
        });

        // 导航切换
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchSection(tab);
            });
        });

        // 模态框事件
        document.getElementById('modalClose').addEventListener('click', UIUtils.hideModal);
        document.getElementById('modalCancel').addEventListener('click', UIUtils.hideModal);
        document.getElementById('modalConfirm').addEventListener('click', UIUtils.handleModalConfirm);

        // 添加按钮事件
        document.getElementById('addOrderBtn').addEventListener('click', () => {
            orderManager.showAddModal();
        });
        document.getElementById('addUserBtn').addEventListener('click', () => {
            userManager.showAddModal();
        });
        document.getElementById('addProductBtn').addEventListener('click', () => {
            productManager.showAddModal();
        });

        // 搜索和过滤事件
        document.getElementById('searchOrderBtn').addEventListener('click', (e) => {
            e.preventDefault();
            orderManager.filterOrders();
        });
        document.getElementById('searchUserBtn').addEventListener('click', (e) => {
            e.preventDefault();
            userManager.filterUsers();
        });
        document.getElementById('searchProductBtn').addEventListener('click', (e) => {
            e.preventDefault();
            productManager.filterProducts();
        });

        // 回车搜索
        document.getElementById('orderSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') orderManager.filterOrders();
        });
        document.getElementById('userSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') userManager.filterUsers();
        });
        document.getElementById('productSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') productManager.filterProducts();
        });

        // 模态框外部点击关闭
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                UIUtils.hideModal();
            }
        });
    }

    /**
     * 切换页面区域
     */
    switchSection(section) {
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${section}"]`).classList.add('active');

        // 切换内容区域
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;

        // 加载对应数据
        this.loadSectionData(section);
    }

    /**
     * 加载初始数据
     */
    async loadInitialData() {
        UIUtils.showLoading(true);
        try {
            await this.loadSectionData('orders');
            await this.loadDashboardStats();
        } catch (error) {
            UIUtils.showNotification('加载数据失败: ' + error.message, 'error');
        }
        UIUtils.showLoading(false);
    }

    /**
     * 加载区域数据
     */
    async loadSectionData(section) {
        try {
            switch (section) {
                case 'orders':
                    await orderManager.loadOrders();
                    break;
                case 'users':
                    await userManager.loadUsers();
                    break;
                case 'products':
                    await productManager.loadProducts();
                    break;
                case 'dashboard':
                    await this.loadDashboardStats();
                    break;
            }
        } catch (error) {
            UIUtils.showNotification('加载数据失败: ' + error.message, 'error');
        }
    }

    /**
     * 加载仪表板统计数据
     */
    async loadDashboardStats() {
        try {
            // 确保数据已加载
            if (!orderManager.originalData.length) await orderManager.loadOrders();
            if (!userManager.originalData.length) await userManager.loadUsers();
            if (!productManager.originalData.length) await productManager.loadProducts();

            // 获取统计数据
            const orderStats = orderManager.getStats();
            const userStats = userManager.getStats();
            const productStats = productManager.getStats();

            // 更新显示
            document.getElementById('totalOrders').textContent = orderStats.totalOrders;
            document.getElementById('totalUsers').textContent = userStats.totalUsers;
            document.getElementById('totalProducts').textContent = productStats.totalProducts;
            document.getElementById('totalRevenue').textContent = `¥${orderStats.totalRevenue.toFixed(2)}`;
        } catch (error) {
            console.error('加载统计数据失败:', error);
            // 使用默认值
            document.getElementById('totalOrders').textContent = '0';
            document.getElementById('totalUsers').textContent = '0';
            document.getElementById('totalProducts').textContent = '0';
            document.getElementById('totalRevenue').textContent = '¥0.00';
        }
    }
}

// 初始化应用程序
document.addEventListener('DOMContentLoaded', () => {
    window.app = new OrderManagementApp();
});