/**
 * 产品管理模块
 */
class ProductManager {
    constructor() {
        this.currentData = [];
        this.originalData = [];
    }

    /**
     * 加载产品数据
     */
    async loadProducts() {
        try {
            const response = await api.getProducts();
            this.currentData = Array.isArray(response) ? response : 
                (response.data ? response.data : []);
            
            // 保存原始数据用于过滤
            this.originalData = [...this.currentData];
            
            this.renderTable();
            return this.currentData;
        } catch (error) {
            console.error('加载产品失败:', error);
            UIUtils.showNotification('加载产品数据失败: ' + error.message, 'error');
            return [];
        }
    }

    /**
     * 渲染产品表格
     */
    renderTable() {
        const tbody = document.querySelector('#productsTable tbody');
        tbody.innerHTML = '';

        this.currentData.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>¥${product.price}</td>
                <td>${product.stock}</td>
                <td><span class="status-badge status-${product.status}">${product.status === 'active' ? '上架' : '下架'}</span></td>
                <td>${UIUtils.formatDateTime(product.created_at)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" data-action="view" data-id="${product.id}" title="查看">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" data-action="edit" data-id="${product.id}" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-action="delete" data-id="${product.id}" title="删除">
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
        const tbody = document.querySelector('#productsTable tbody');
        
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

        // console.log('ProductManager: 点击按钮', { action, id, currentData: this.currentData.length });

        switch (action) {
            case 'view':
                this.viewProduct(id);
                break;
            case 'edit':
                this.editProduct(id);
                break;
            case 'delete':
                this.deleteProduct(id);
                break;
        }
    }

    /**
     * 过滤产品
     */
    filterProducts() {
        const categoryFilter = document.getElementById('productCategory').value;
        const searchFilter = document.getElementById('productSearch').value.toLowerCase().trim();
        
        // console.log('开始过滤产品:', { category: categoryFilter, search: searchFilter });
        // console.log('原始数据数量:', this.originalData.length);
        
        // 如果没有原始数据，直接返回
        if (this.originalData.length === 0) {
            // console.log('没有原始数据可供过滤');
            UIUtils.showNotification('没有数据可供搜索', 'warning');
            return;
        }
        
        // 从原始数据开始过滤
        let filteredProducts = this.originalData.slice();
        
        // 应用分类过滤
        if (categoryFilter && categoryFilter !== '') {
            filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
            // console.log('分类过滤后数量:', filteredProducts.length);
        }
        
        // 应用搜索过滤
        if (searchFilter && searchFilter !== '') {
            filteredProducts = filteredProducts.filter(product => {
                const name = product.name ? product.name.toLowerCase() : '';
                const description = product.description ? product.description.toLowerCase() : '';
                const id = product.id ? product.id.toString() : '';
                
                return name.includes(searchFilter) ||
                       description.includes(searchFilter) ||
                       id.includes(searchFilter);
            });
            // console.log('搜索过滤后数量:', filteredProducts.length);
        }
        
        // 更新当前显示的数据
        this.currentData = filteredProducts;
        this.renderTable();
        
        UIUtils.showNotification(`找到 ${filteredProducts.length} 个匹配的产品`, 'info');
    }

    /**
     * 查看产品详情
     */
    viewProduct(id) {
        // console.log('ViewProduct: 查找产品', { id, currentData: this.currentData });
        const product = this.currentData.find(p => p.id == id); // 使用松散比较
        // console.log('ViewProduct: 找到产品', product);
        
        if (product) {
            const content = `
                <div class="detail-view">
                    <p><strong>产品ID:</strong> ${product.id}</p>
                    <p><strong>产品名称:</strong> ${product.name}</p>
                    <p><strong>分类:</strong> ${product.category}</p>
                    <p><strong>价格:</strong> ¥${product.price}</p>
                    <p><strong>库存:</strong> ${product.stock}</p>
                    <p><strong>状态:</strong> ${product.status === 'active' ? '上架' : '下架'}</p>
                    <p><strong>描述:</strong> ${product.description || '无'}</p>
                    <p><strong>创建时间:</strong> ${UIUtils.formatDateTime(product.created_at)}</p>
                </div>
            `;
            UIUtils.showModal('产品详情', content, null);
        } else {
            console.error('ViewProduct: 未找到产品', id);
            UIUtils.showNotification('未找到产品信息', 'error');
        }
    }

    /**
     * 显示添加产品模态框
     */
    showAddModal() {
        const content = FormGenerator.getProductForm();
        UIUtils.showModal('新增产品', content, () => {
            this.handleSubmit();
        });
    }

    /**
     * 编辑产品
     */
    editProduct(id) {
        // console.log('EditProduct: 查找产品', { id, currentData: this.currentData });
        const product = this.currentData.find(p => p.id == id); // 使用松散比较
        // console.log('EditProduct: 找到产品', product);
        
        if (product) {
            const content = FormGenerator.getProductForm(product);
            UIUtils.showModal('编辑产品', content, () => {
                this.handleSubmit(product);
            });
        } else {
            console.error('EditProduct: 未找到产品', id);
            UIUtils.showNotification('未找到产品信息', 'error');
        }
    }

    /**
     * 删除产品
     */
    async deleteProduct(id) {
        if (confirm('确定要删除这个产品吗？')) {
            try {
                await api.deleteProduct(id);
                UIUtils.showNotification('产品删除成功', 'success');
                await this.loadProducts();
            } catch (error) {
                UIUtils.showNotification('删除失败: ' + error.message, 'error');
            }
        }
    }

    /**
     * 处理产品提交
     */
    async handleSubmit(existingProduct = null) {
        const form = document.getElementById('modalForm');
        const formData = new FormData(form);
        const productData = Object.fromEntries(formData);

        try {
            if (existingProduct) {
                productData.id = existingProduct.id;
                await api.updateProduct(productData);
                UIUtils.showNotification('产品更新成功', 'success');
            } else {
                await api.createProduct(productData);
                UIUtils.showNotification('产品创建成功', 'success');
            }
            UIUtils.hideModal();
            await this.loadProducts();
        } catch (error) {
            UIUtils.showNotification('操作失败: ' + error.message, 'error');
        }
    }

    /**
     * 获取统计数据
     */
    getStats() {
        return {
            totalProducts: this.originalData.length
        };
    }
}