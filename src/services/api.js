/**
 * API 服务层 - 处理所有HTTP请求
 */
class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:8080'; // DISP 服务端口
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    /**
     * 通用HTTP请求方法
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('API请求失败:', error);
            throw new Error(`请求失败: ${error.message}`);
        }
    }

    /**
     * GET 请求
     */
    async get(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}${endpoint}`);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
                url.searchParams.append(key, params[key]);
            }
        });

        return this.request(url.pathname + url.search, {
            method: 'GET'
        });
    }

    /**
     * POST 请求
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT 请求
     */
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * PATCH 请求
     */
    async patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE 请求
     */
    async delete(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'DELETE',
            body: JSON.stringify(data)
        });
    }

    // =========================
    // 订单管理 API
    // =========================

    /**
     * 获取订单列表
     */
    async getOrders(filters = {}) {
        return this.get('/api/order', filters);
    }

    /**
     * 获取单个订单
     */
    async getOrder(id) {
        return this.get(`/api/order/${id}`);
    }

    /**
     * 创建订单
     */
    async createOrder(orderData) {
        return this.post('/api/order', orderData);
    }

    /**
     * 更新订单
     */
    async updateOrder(orderData) {
        return this.put('/api/order', orderData);
    }

    /**
     * 删除订单
     */
    async deleteOrder(id) {
        return this.delete('/api/order', { id });
    }

    /**
     * 更新订单状态
     */
    async updateOrderStatus(id, status) {
        return this.patch(`/api/order/${id}/status`, { status });
    }

    // =========================
    // 用户管理 API
    // =========================

    /**
     * 获取用户列表
     */
    async getUsers(filters = {}) {
        return this.get('/api/user', filters);
    }

    /**
     * 获取单个用户
     */
    async getUser(id) {
        return this.get(`/api/user/${id}`);
    }

    /**
     * 创建用户
     */
    async createUser(userData) {
        return this.post('/api/user', userData);
    }

    /**
     * 更新用户
     */
    async updateUser(userData) {
        return this.put('/api/user', userData);
    }

    /**
     * 删除用户
     */
    async deleteUser(id) {
        return this.delete('/api/user', { id });
    }

    // =========================
    // 产品管理 API
    // =========================

    /**
     * 获取产品列表
     */
    async getProducts(filters = {}) {
        return this.get('/api/product', filters);
    }

    /**
     * 获取单个产品
     */
    async getProduct(id) {
        return this.get(`/api/product/${id}`);
    }

    /**
     * 创建产品
     */
    async createProduct(productData) {
        return this.post('/api/product', productData);
    }

    /**
     * 更新产品
     */
    async updateProduct(productData) {
        return this.put('/api/product', productData);
    }

    /**
     * 删除产品
     */
    async deleteProduct(id) {
        return this.delete('/api/product', { id });
    }

    // =========================
    // 系统 API
    // =========================

    /**
     * 检查系统健康状态
     */
    async checkHealth() {
        return this.get('/api/health');
    }

    /**
     * 获取系统版本信息
     */
    async getVersion() {
        return this.get('/api/version');
    }
}

// 创建全局API实例
window.api = new ApiService();