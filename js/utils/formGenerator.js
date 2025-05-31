/**
 * 表单生成器 - 生成各种表单HTML
 */
class FormGenerator {
    /**
     * 获取订单表单HTML
     */
    static getOrderForm(order = null) {
        return `
            <form id="modalForm">
                <div class="form-group">
                    <label for="customer_name">客户名称</label>
                    <input type="text" id="customer_name" name="customer_name" value="${order?.customer_name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="product_name">产品名称</label>
                    <input type="text" id="product_name" name="product_name" value="${order?.product_name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="quantity">数量</label>
                    <input type="text" id="quantity" name="quantity" value="${order?.quantity || ''}"
                           pattern="^[1-9][0-9]*$"
                           title="请输入大于0的整数"
                           oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value.startsWith('0')) this.value = this.value.replace(/^0+/, '') || '1';"
                           required>
                </div>
                <div class="form-group">
                    <label for="total_amount">总金额</label>
                    <input type="text" id="total_amount" name="total_amount" value="${order?.total_amount || ''}"
                           pattern="^[0-9]+(\.[0-9]{1,2})?$"
                           title="请输入有效金额（支持最多两位小数）"
                           oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/^(\d+\.\d{2})\d+$/, '$1');"
                           required>
                </div>
                <div class="form-group">
                    <label for="status">状态</label>
                    <select id="status" name="status" required>
                        <option value="pending" ${order?.status === 'pending' ? 'selected' : ''}>待处理</option>
                        <option value="processing" ${order?.status === 'processing' ? 'selected' : ''}>处理中</option>
                        <option value="completed" ${order?.status === 'completed' ? 'selected' : ''}>已完成</option>
                        <option value="cancelled" ${order?.status === 'cancelled' ? 'selected' : ''}>已取消</option>
                    </select>
                </div>
            </form>
        `;
    }

    /**
     * 获取用户表单HTML
     */
    static getUserForm(user = null) {
        return `
            <form id="modalForm">
                <div class="form-group">
                    <label for="name">姓名</label>
                    <input type="text" id="name" name="name" value="${user?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="email">邮箱</label>
                    <input type="email" id="email" name="email" value="${user?.email || ''}" required>
                </div>
                <div class="form-group">
                    <label for="phone">电话</label>
                    <input type="tel" id="phone" name="phone" value="${user?.phone || ''}" required>
                </div>
                <div class="form-group">
                    <label for="role">角色</label>
                    <select id="role" name="role" required>
                        <option value="employee" ${user?.role === 'employee' ? 'selected' : ''}>员工</option>
                        <option value="manager" ${user?.role === 'manager' ? 'selected' : ''}>经理</option>
                        <option value="admin" ${user?.role === 'admin' ? 'selected' : ''}>管理员</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="status">状态</label>
                    <select id="status" name="status" required>
                        <option value="active" ${user?.status === 'active' ? 'selected' : ''}>活跃</option>
                        <option value="inactive" ${user?.status === 'inactive' ? 'selected' : ''}>非活跃</option>
                    </select>
                </div>
            </form>
        `;
    }

    /**
     * 获取产品表单HTML
     */
    static getProductForm(product = null) {
        return `
            <form id="modalForm">
                <div class="form-group">
                    <label for="name">产品名称</label>
                    <input type="text" id="name" name="name" value="${product?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="category">分类</label>
                    <select id="category" name="category" required>
                        <option value="electronics" ${product?.category === 'electronics' ? 'selected' : ''}>电子产品</option>
                        <option value="clothing" ${product?.category === 'clothing' ? 'selected' : ''}>服装</option>
                        <option value="books" ${product?.category === 'books' ? 'selected' : ''}>图书</option>
                        <option value="home" ${product?.category === 'home' ? 'selected' : ''}>家居用品</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="price">价格</label>
                    <input type="text" id="price" name="price" value="${product?.price || ''}"
                           pattern="^[0-9]+(\.[0-9]{1,2})?$"
                           title="请输入有效价格（支持最多两位小数，可以为0）"
                           oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/^(\d+\.\d{2})\d+$/, '$1');"
                           required>
                </div>
                <div class="form-group">
                    <label for="stock">库存</label>
                    <input type="text" id="stock" name="stock" value="${product?.stock || ''}"
                           pattern="^[0-9]+$"
                           title="请输入非负整数（可以为0）"
                           oninput="this.value = this.value.replace(/[^0-9]/g, '');"
                           required>
                </div>
                <div class="form-group">
                    <label for="status">状态</label>
                    <select id="status" name="status" required>
                        <option value="active" ${product?.status === 'active' ? 'selected' : ''}>上架</option>
                        <option value="inactive" ${product?.status === 'inactive' ? 'selected' : ''}>下架</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="description">描述</label>
                    <textarea id="description" name="description" rows="3">${product?.description || ''}</textarea>
                </div>
            </form>
        `;
    }
}