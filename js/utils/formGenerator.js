/**
 * 表单生成器 - 完整版（含金额输入修复）
 * 功能：生成订单/用户/产品表单，包含智能输入验证和格式化
 */
class FormGenerator {
    /* 订单表单 */
    static getOrderForm(order = null) {
        return `
            <form id="modalForm" class="needs-validation" novalidate>
                <div class="form-group">
                    <label for="customer_name">客户名称</label>
                    <input type="text" id="customer_name" name="customer_name" 
                           value="${this.escapeHtml(order?.customer_name || '')}" 
                           maxlength="50" 
                           required>
                    <div class="invalid-feedback">请输入客户名称</div>
                </div>
                
                <div class="form-group">
                    <label for="product_name">产品名称</label>
                    <input type="text" id="product_name" name="product_name" 
                           value="${this.escapeHtml(order?.product_name || '')}" 
                           maxlength="100" 
                           required>
                    <div class="invalid-feedback">请输入产品名称</div>
                </div>
                
                <div class="form-group">
                    <label for="quantity">数量</label>
                    <input type="text" id="quantity" name="quantity" 
                           value="${this.escapeHtml(order?.quantity || '')}"
                           oninput="FormGenerator.validateInteger(this, false)"
                           required>
                    <div class="invalid-feedback">请输入大于0的整数</div>
                </div>
                
                <div class="form-group">
                    <label for="total_amount">总金额</label>
                    <div class="input-group">
                        <span class="input-group-text">¥</span>
                        <input type="text"
                               id="total_amount"
                               name="total_amount"
                               class="form-control"
                               value="${this.formatAmount(order?.total_amount)}"
                               oninput="FormGenerator.validateAmount(this)"
                               placeholder="0.00"
                               required>
                    </div>
                    <div class="invalid-feedback">请输入有效金额（如：123.45）</div>
                </div>
                
                <div class="form-group">
                    <label for="status">状态</label>
                    <select id="status" name="status" class="form-select" required>
                        ${this.generateOptions(
                            ['pending', 'processing', 'completed', 'cancelled'],
                            ['待处理', '处理中', '已完成', '已取消'],
                            order?.status
                        )}
                    </select>
                    <div class="invalid-feedback">请选择状态</div>
                </div>
            </form>
        `;
    }

    /* 用户表单 */
    static getUserForm(user = null) {
        return `
            <form id="userForm" class="needs-validation" novalidate>
                <div class="form-group">
                    <label for="name">姓名</label>
                    <input type="text" id="name" name="name" 
                           value="${this.escapeHtml(user?.name || '')}" 
                           maxlength="50" 
                           required>
                    <div class="invalid-feedback">请输入姓名</div>
                </div>
                
                <div class="form-group">
                    <label for="email">邮箱</label>
                    <input type="email" id="email" name="email" 
                           value="${this.escapeHtml(user?.email || '')}" 
                           pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                           required>
                    <div class="invalid-feedback">请输入有效的邮箱地址</div>
                </div>
                
                <div class="form-group">
                    <label for="phone">电话</label>
                    <input type="tel" id="phone" name="phone" 
                           value="${this.escapeHtml(user?.phone || '')}" 
                           pattern="\\d{11}"
                           oninput="this.value=this.value.replace(/\\D/g,'')"
                           maxlength="11"
                           required>
                    <div class="invalid-feedback">请输入11位手机号码</div>
                </div>
                
                <div class="form-group">
                    <label for="role">角色</label>
                    <select id="role" name="role" class="form-select" required>
                        ${this.generateOptions(
                            ['employee', 'manager', 'admin'],
                            ['员工', '经理', '管理员'],
                            user?.role
                        )}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="status">状态</label>
                    <select id="status" name="status" class="form-select" required>
                        ${this.generateOptions(
                            ['active', 'inactive'],
                            ['活跃', '非活跃'],
                            user?.status
                        )}
                    </select>
                </div>
            </form>
        `;
    }

    /* 产品表单 */
    static getProductForm(product = null) {
        return `
            <form id="productForm" class="needs-validation" novalidate>
                <div class="form-group">
                    <label for="name">产品名称</label>
                    <input type="text" id="name" name="name" 
                           value="${this.escapeHtml(product?.name || '')}" 
                           maxlength="100" 
                           required>
                    <div class="invalid-feedback">请输入产品名称</div>
                </div>
                
                <div class="form-group">
                    <label for="category">分类</label>
                    <select id="category" name="category" class="form-select" required>
                        ${this.generateOptions(
                            ['electronics', 'clothing', 'books', 'home'],
                            ['电子产品', '服装', '图书', '家居用品'],
                            product?.category
                        )}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="price">价格</label>
                    <div class="input-group">
                        <span class="input-group-text">¥</span>
                        <input type="text"
                               id="price"
                               name="price"
                               class="form-control"
                               value="${this.formatAmount(product?.price)}"
                               oninput="FormGenerator.validateAmount(this)"
                               placeholder="0.00"
                               required>
                    </div>
                    <div class="invalid-feedback">请输入有效价格</div>
                </div>
                
                <div class="form-group">
                    <label for="stock">库存</label>
                    <input type="text" id="stock" name="stock" 
                           value="${this.escapeHtml(product?.stock || '')}"
                           oninput="FormGenerator.validateInteger(this, true)"
                           required>
                    <div class="invalid-feedback">请输入库存数量</div>
                </div>
                
                <div class="form-group">
                    <label for="status">状态</label>
                    <select id="status" name="status" class="form-select" required>
                        ${this.generateOptions(
                            ['active', 'inactive'],
                            ['上架', '下架'],
                            product?.status
                        )}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="description">描述</label>
                    <textarea id="description" name="description" 
                              class="form-control" 
                              rows="3" 
                              maxlength="500">${this.escapeHtml(product?.description || '')}</textarea>
                </div>
            </form>
        `;
    }

    /**
     * 整数验证
     * @param {boolean} allowZero - 是否允许0
     */
    static validateInteger(input, allowZero = false) {
        const cursorPos = input.selectionStart;
        const originalValue = input.value;
        
        // 1. 过滤非数字字符
        let newValue = originalValue.replace(/\D/g, '');
        
        // 2. 处理前导零
        if (newValue.length > 1 && newValue.startsWith('0')) {
            newValue = newValue.replace(/^0+/, '');
        }
        
        // 3. 处理空值或0
        if (!allowZero && (newValue === '' || newValue === '0')) {
            newValue = '1';
        }
        
        // 4. 更新值
        if (newValue !== originalValue) {
            input.value = newValue;
            const diff = newValue.length - originalValue.length;
            input.setSelectionRange(
                Math.max(0, cursorPos + diff),
                Math.max(0, cursorPos + diff)
            );
        }
    }

    /**
     * 金额验证和格式化
     * 允许输入数字和小数点，限制小数位数为2位
     */
    static validateAmount(input) {
        const cursorPos = input.selectionStart;
        const originalValue = input.value;
        
        // 1. 只允许数字和一个小数点
        let newValue = originalValue.replace(/[^\d.]/g, '');
        
        // 2. 确保只有一个小数点
        const dotCount = (newValue.match(/\./g) || []).length;
        if (dotCount > 1) {
            const firstDotIndex = newValue.indexOf('.');
            newValue = newValue.substring(0, firstDotIndex + 1) +
                      newValue.substring(firstDotIndex + 1).replace(/\./g, '');
        }
        
        // 3. 限制小数点后最多2位
        if (newValue.includes('.')) {
            const parts = newValue.split('.');
            if (parts[1] && parts[1].length > 2) {
                parts[1] = parts[1].substring(0, 2);
                newValue = parts.join('.');
            }
        }
        
        // 4. 防止以多个0开头（除非是0.xx格式）
        if (newValue.length > 1 && newValue.startsWith('0') && !newValue.startsWith('0.')) {
            newValue = newValue.replace(/^0+/, '');
            if (newValue === '') newValue = '0';
        }
        
        // 5. 限制最大长度（防止输入过大数字）
        if (newValue.replace('.', '').length > 10) {
            newValue = originalValue;
        }
        
        // 6. 更新值并保持光标位置
        if (newValue !== originalValue) {
            input.value = newValue;
            const diff = newValue.length - originalValue.length;
            const newCursorPos = Math.max(0, Math.min(cursorPos + diff, newValue.length));
            input.setSelectionRange(newCursorPos, newCursorPos);
        }
    }

    /**********************
     * 工具方法
     **********************/
    
    static formatAmount(value) {
        if (value === null || value === undefined) return '';
        const num = parseFloat(value);
        return isNaN(num) ? '' : num.toFixed(2);
    }

    static generateOptions(values, labels, selectedValue) {
        return values.map((v, i) => 
            `<option value="${v}" ${v === selectedValue ? 'selected' : ''}>${labels[i]}</option>`
        ).join('');
    }

    static escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

/**********************
 * 使用示例
 **********************/
// 渲染订单表单
document.getElementById('order-form-container').innerHTML = 
    FormGenerator.getOrderForm({
        customer_name: "示例客户",
        product_name: "测试产品",
        quantity: "10",
        total_amount: "99.5",  // 测试自动补全为99.50
        status: "processing"
    });

// 添加表单验证逻辑
document.querySelectorAll('form.needs-validation').forEach(form => {
    form.addEventListener('submit', function(e) {
        if (!this.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.classList.add('was-validated');
    });
});