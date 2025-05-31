/**
 * 用户管理模块
 */
class UserManager {
    constructor() {
        this.currentData = [];
        this.originalData = [];
    }

    /**
     * 加载用户数据
     */
    async loadUsers() {
        try {
            const response = await api.getUsers();
            this.currentData = Array.isArray(response) ? response : 
                (response.data ? response.data : []);
            
            // 保存原始数据用于过滤
            this.originalData = [...this.currentData];
            
            this.renderTable();
            return this.currentData;
        } catch (error) {
            console.error('加载用户失败:', error);
            UIUtils.showNotification('加载用户数据失败: ' + error.message, 'error');
            return [];
        }
    }

    /**
     * 渲染用户表格
     */
    renderTable() {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';

        this.currentData.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.role}</td>
                <td><span class="status-badge status-${user.status}">${user.status === 'active' ? '活跃' : '非活跃'}</span></td>
                <td>${UIUtils.formatDateTime(user.created_at)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" data-action="view" data-id="${user.id}" title="查看">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" data-action="edit" data-id="${user.id}" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-action="delete" data-id="${user.id}" title="删除">
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
        const tbody = document.querySelector('#usersTable tbody');
        
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

        // console.log('UserManager: 点击按钮', { action, id, currentData: this.currentData.length });

        switch (action) {
            case 'view':
                this.viewUser(id);
                break;
            case 'edit':
                this.editUser(id);
                break;
            case 'delete':
                this.deleteUser(id);
                break;
        }
    }

    /**
     * 过滤用户
     */
    filterUsers() {
        const roleFilter = document.getElementById('userRole').value;
        const searchFilter = document.getElementById('userSearch').value.toLowerCase().trim();
        
        // console.log('开始过滤用户:', { role: roleFilter, search: searchFilter });
        // console.log('原始数据数量:', this.originalData.length);
        
        // 如果没有原始数据，直接返回
        if (this.originalData.length === 0) {
            // console.log('没有原始数据可供过滤');
            UIUtils.showNotification('没有数据可供搜索', 'warning');
            return;
        }
        
        // 从原始数据开始过滤
        let filteredUsers = this.originalData.slice();
        
        // 应用角色过滤
        if (roleFilter && roleFilter !== '') {
            filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
            // console.log('角色过滤后数量:', filteredUsers.length);
        }
        
        // 应用搜索过滤
        if (searchFilter && searchFilter !== '') {
            filteredUsers = filteredUsers.filter(user => {
                const name = user.name ? user.name.toLowerCase() : '';
                const email = user.email ? user.email.toLowerCase() : '';
                const phone = user.phone ? user.phone.toString() : '';
                const id = user.id ? user.id.toString() : '';
                
                return name.includes(searchFilter) ||
                       email.includes(searchFilter) ||
                       phone.includes(searchFilter) ||
                       id.includes(searchFilter);
            });
            // console.log('搜索过滤后数量:', filteredUsers.length);
        }
        
        // 更新当前显示的数据
        this.currentData = filteredUsers;
        this.renderTable();
        
        UIUtils.showNotification(`找到 ${filteredUsers.length} 个匹配的用户`, 'info');
    }

    /**
     * 查看用户详情
     */
    viewUser(id) {
        // console.log('ViewUser: 查找用户', { id, currentData: this.currentData });
        const user = this.currentData.find(u => u.id == id); // 使用松散比较
        // console.log('ViewUser: 找到用户', user);
        
        if (user) {
            const content = `
                <div class="detail-view">
                    <p><strong>用户ID:</strong> ${user.id}</p>
                    <p><strong>姓名:</strong> ${user.name}</p>
                    <p><strong>邮箱:</strong> ${user.email}</p>
                    <p><strong>电话:</strong> ${user.phone}</p>
                    <p><strong>角色:</strong> ${user.role}</p>
                    <p><strong>状态:</strong> ${user.status === 'active' ? '活跃' : '非活跃'}</p>
                    <p><strong>创建时间:</strong> ${UIUtils.formatDateTime(user.created_at)}</p>
                </div>
            `;
            UIUtils.showModal('用户详情', content, null);
        } else {
            console.error('ViewUser: 未找到用户', id);
            UIUtils.showNotification('未找到用户信息', 'error');
        }
    }

    /**
     * 显示添加用户模态框
     */
    showAddModal() {
        const content = FormGenerator.getUserForm();
        UIUtils.showModal('新增用户', content, () => {
            this.handleSubmit();
        });
    }

    /**
     * 编辑用户
     */
    editUser(id) {
        // console.log('EditUser: 查找用户', { id, currentData: this.currentData });
        const user = this.currentData.find(u => u.id == id); // 使用松散比较
        // console.log('EditUser: 找到用户', user);
        
        if (user) {
            const content = FormGenerator.getUserForm(user);
            UIUtils.showModal('编辑用户', content, () => {
                this.handleSubmit(user);
            });
        } else {
            console.error('EditUser: 未找到用户', id);
            UIUtils.showNotification('未找到用户信息', 'error');
        }
    }

    /**
     * 删除用户
     */
    async deleteUser(id) {
        if (confirm('确定要删除这个用户吗？')) {
            try {
                await api.deleteUser(id);
                UIUtils.showNotification('用户删除成功', 'success');
                await this.loadUsers();
            } catch (error) {
                UIUtils.showNotification('删除失败: ' + error.message, 'error');
            }
        }
    }

    /**
     * 处理用户提交
     */
    async handleSubmit(existingUser = null) {
        const form = document.getElementById('modalForm');
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData);

        try {
            if (existingUser) {
                userData.id = existingUser.id;
                await api.updateUser(userData);
                UIUtils.showNotification('用户更新成功', 'success');
            } else {
                await api.createUser(userData);
                UIUtils.showNotification('用户创建成功', 'success');
            }
            UIUtils.hideModal();
            await this.loadUsers();
        } catch (error) {
            UIUtils.showNotification('操作失败: ' + error.message, 'error');
        }
    }

    /**
     * 获取统计数据
     */
    getStats() {
        return {
            totalUsers: this.originalData.length
        };
    }
}