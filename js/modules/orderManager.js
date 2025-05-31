/**
 * 订单管理模块
 */
class OrderManager {
    constructor() {
        this.currentData = [];
        this.originalData = [];
    }

    /**
     * 加载订单数据
     */
    async loadOrders() {
        try {
            const response = await api.getOrders();
            this.currentData = Array.isArray(response) ? response : 
                (response.data ? response.data : []);
            
            // 保存原始数据用于过滤
            this.originalData = [...this.currentData];
            
            this.renderTable();
            return this.currentData;
        } catch (error) {
            console.error('加载订单失败:', error);
            UIUtils.showNotification('加载订单数据失败: ' + error.message, 'error');
            return [];
        }
    }

    /**
     * 渲染订单表格
     */
    renderTable() {
        const tbody = document.querySelector('#ordersTable tbody');
        tbody.innerHTML = '';

        this.currentData.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer_name}</td>
                <td>${order.product_name}</td>
                <td>${order.quantity}</td>
                <td>¥${order.total_amount}</td>
                <td><span class="status-badge status-${order.status}">${UIUtils.getStatusText(order.status)}</span></td>
                <td>${UIUtils.formatDateTime(order.created_at)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" data-action="view" data-id="${order.id}" title="查看">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" data-action="edit" data-id="${order.id}" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-action="delete" data-id="${order.id}" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // 绑定事件委托
        this.bindTableEvents();
    }

    /**
     * 绑定表格事件
     */
    bindTableEvents() {
        const tbody = document.querySelector('#ordersTable tbody');
        
        // 移除之前的事件监听器
        tbody.removeEventListener('click', this.handleTableClick);
        
        // 绑定新的事件监听器
        this.handleTableClick = this.handleTableClick.bind(this);
        tbody.addEventListener('click', this.handleTableClick);
    }

    /**
     * 处理表格点击事件
     */
    handleTableClick(e) {
        const button = e.target.closest('.action-btn');
        if (!button) return;

        const action = button.dataset.action;
        const id = parseInt(button.dataset.id);

        // console.log('OrderManager: 点击按钮', { action, id, currentData: this.currentData.length });

        switch (action) {
            case 'view':
                this.viewOrder(id);
                break;
            case 'edit':
                this.editOrder(id);
                break;
            case 'delete':
                this.deleteOrder(id);
                break;
        }
    }

    /**
     * 过滤订单
     */
    filterOrders() {
        const statusFilter = document.getElementById('orderStatus').value;
        const searchFilter = document.getElementById('orderSearch').value.toLowerCase().trim();
        
        // console.log('开始过滤订单:', { status: statusFilter, search: searchFilter });
        // console.log('原始数据数量:', this.originalData.length);
        
        // 如果没有原始数据，直接返回
        if (this.originalData.length === 0) {
            // console.log('没有原始数据可供过滤');
            UIUtils.showNotification('没有数据可供搜索', 'warning');
            return;
        }
        
        // 从原始数据开始过滤
        let filteredOrders = this.originalData.slice();
        
        // 应用状态过滤
        if (statusFilter && statusFilter !== '') {
            filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
            // console.log('状态过滤后数量:', filteredOrders.length);
        }
        
        // 应用搜索过滤
        if (searchFilter && searchFilter !== '') {
            filteredOrders = filteredOrders.filter(order => {
                const customerName = order.customer_name ? order.customer_name.toLowerCase() : '';
                const productName = order.product_name ? order.product_name.toLowerCase() : '';
                const id = order.id ? order.id.toString() : '';
                
                return customerName.includes(searchFilter) ||
                       productName.includes(searchFilter) ||
                       id.includes(searchFilter);
            });
            // console.log('搜索过滤后数量:', filteredOrders.length);
        }
        
        // 更新当前显示的数据
        this.currentData = filteredOrders;
        this.renderTable();
        
        UIUtils.showNotification(`找到 ${filteredOrders.length} 个匹配的订单`, 'info');
    }

    /**
     * 查看订单详情
     */
    viewOrder(id) {
        // console.log('ViewOrder: 查找订单', { id, currentData: this.currentData });
        const order = this.currentData.find(o => o.id == id); // 使用松散比较
        // console.log('ViewOrder: 找到订单', order);
        
        if (order) {
            const content = `
                <div class="detail-view">
                    <p><strong>订单ID:</strong> ${order.id}</p>
                    <p><strong>客户名称:</strong> ${order.customer_name}</p>
                    <p><strong>产品名称:</strong> ${order.product_name}</p>
                    <p><strong>数量:</strong> ${order.quantity}</p>
                    <p><strong>总金额:</strong> ¥${order.total_amount}</p>
                    <p><strong>状态:</strong> ${UIUtils.getStatusText(order.status)}</p>
                    <p><strong>创建时间:</strong> ${UIUtils.formatDateTime(order.created_at)}</p>
                </div>
            `;
            UIUtils.showModal('订单详情', content, null);
        } else {
            console.error('ViewOrder: 未找到订单', id);
            UIUtils.showNotification('未找到订单信息', 'error');
        }
    }

    /**
     * 显示添加订单模态框
     */
    showAddModal() {
        const content = FormGenerator.getOrderForm();
        UIUtils.showModal('新增订单', content, () => {
            this.handleSubmit();
        });
    }

    /**
     * 编辑订单
     */
    editOrder(id) {
        // console.log('EditOrder: 查找订单', { id, currentData: this.currentData });
        const order = this.currentData.find(o => o.id == id); // 使用松散比较
        // console.log('EditOrder: 找到订单', order);
        
        if (order) {
            const content = FormGenerator.getOrderForm(order);
            UIUtils.showModal('编辑订单', content, () => {
                this.handleSubmit(order);
            });
        } else {
            console.error('EditOrder: 未找到订单', id);
            UIUtils.showNotification('未找到订单信息', 'error');
        }
    }

    /**
     * 删除订单
     */
    async deleteOrder(id) {
        if (confirm('确定要删除这个订单吗？')) {
            try {
                await api.deleteOrder(id);
                UIUtils.showNotification('订单删除成功', 'success');
                await this.loadOrders();
            } catch (error) {
                UIUtils.showNotification('删除失败: ' + error.message, 'error');
            }
        }
    }

    /**
     * 处理订单提交
     */
    async handleSubmit(existingOrder = null) {
        const form = document.getElementById('modalForm');
        const formData = new FormData(form);
        const orderData = Object.fromEntries(formData);

        try {
            if (existingOrder) {
                orderData.id = existingOrder.id;
                await api.updateOrder(orderData);
                UIUtils.showNotification('订单更新成功', 'success');
            } else {
                await api.createOrder(orderData);
                UIUtils.showNotification('订单创建成功', 'success');
            }
            UIUtils.hideModal();
            await this.loadOrders();
        } catch (error) {
            UIUtils.showNotification('操作失败: ' + error.message, 'error');
        }
    }

    /**
     * 获取统计数据
     */
    getStats() {
        const totalOrders = this.originalData.length;
        const totalRevenue = this.originalData.reduce((sum, order) => 
            sum + (parseFloat(order.total_amount) || 0), 0
        );
        
        return {
            totalOrders,
            totalRevenue
        };
    }
}