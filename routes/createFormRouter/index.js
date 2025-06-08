// 导入必要的模块
import express from 'express';
import db from "../../config/db.js";
import { success, error } from "../../utils/response.js";
import { verifyAccessToken } from "../../utils/jwtUtils.js";

const router = express.Router();

router.use(express.json());
// 配置中间件：解析URL编码的请求体（表单数据）
router.use(express.urlencoded({ extended: true }));
const authMiddleware = (req, res, next) => {
    // 从请求头中提取Token（去掉"Bearer "前缀）
    const token = req.headers.authorization?.replace('Bearer ', '');

    // 检查是否提供了Token
    if (!token) {
        return error(res, '未提供访问令牌', 401);
    }

    // 验证Token的有效性，获取用户信息
    const payload = verifyAccessToken(token);
    if (!payload) {
        return error(res, '访问令牌无效或已过期', 401);
    }

    // 将用户ID存储到请求对象中，供后续路由使用
    req.userId = payload.userId;
    // 继续执行下一个中间件或路由处理函数
    next();
};

// 获取创建的表单
router.get('/create-form', authMiddleware,async (req, res) => {
    try {
        const raw = await db.select('*').from('forms').where('user_id', req.userId).orderBy('created_at', 'desc')
        raw.forEach(item => {
            item.created_at = item.created_at.toISOString().replace('T', ' ').slice(0, 19);
            item.updated_at = item.updated_at.toISOString().replace('T', ' ').slice(0, 19);
        });
        const data = raw.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            createTime: item.created_at,
            updateTime: item.updated_at,
        }));
        success(res, data, '获取创建的表单成功');
    }catch (error) {
        error(res, '获取创建的表单失败', 500, error);
    }
});

// 添加创建表单
router.post('/create-form', authMiddleware, async (req, res) => {
    try {
        // 从请求体中获取title和描述
        const { title, description } = req.body;
        
        // 验证必填字段
        if (!title || title.trim() === '') {
            return error(res, '表单标题不能为空', 400);
        }
        
        // 准备插入的数据
        const formData = {
            title: title.trim(),
            description: description ? description.trim() : '', // 描述可以为空
            user_id: req.userId,
        };
        // 插入数据到数据库
        await db('forms').insert(formData);
        
        // 返回创建成功的响应，包含新创建的表单ID
        return success(res, null, '创建表单成功',201);
        
    } catch (err) {
        console.error('创建表单失败:', err);
        return error(res, '创建表单失败', 500);
    }
});
// 删除创建表单
router.delete('/create-form/:id',authMiddleware,async(req,res)=>{
    const {id} = req.params
    try{
        await db('forms').where("id",id).del()
        return success(res,null,'删除表单成功')
    }catch(err){
        return error(res,'删除表单失败',500)
    }
})
// 表单保存（修改操作）
router.post('/save-form', authMiddleware, async (req, res) => {
    try {
        // 从请求体中获取表单ID和要更新的数据
        const { id, title, description, form_config } = req.body;
        
        // 验证必填字段
        if (!id) {
            return error(res, '表单ID不能为空', 400);
        }
        
        if (!title || title.trim() === '') {
            return error(res, '表单标题不能为空', 400);
        }
        
        // 首先检查表单是否存在且属于当前用户
        const existingForm = await db('forms')
            .where('id', id)
            .where('user_id', req.userId)
            .first();
            
        if (!existingForm) {
            return error(res, '表单不存在或无权限修改', 404);
        }
        
        // 准备更新的数据
        const updateData = {
            title: title.trim(),
            description: description ? description.trim() : '',
            updated_at: new Date()
        };
        
        // 如果有表单配置，也一起更新
        if (form_config) {
            updateData.form_config = JSON.stringify(form_config);
        }
        
        // 执行更新操作
        const affectedRows = await db('forms')
            .where('id', id)
            .where('user_id', req.userId)
            .update(updateData);
            
        if (affectedRows === 0) {
            return error(res, '更新失败，表单不存在或无权限', 404);
        }
        return success(res, null, '保存表单成功');
        
    } catch (err) {
        console.error('保存表单失败:', err);
        return error(res, '保存表单失败', 500);
    }
});
export default router;