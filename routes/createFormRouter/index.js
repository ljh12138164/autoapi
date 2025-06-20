// 导入必要的模块
import express from 'express';
import db from "../../config/db.js";
import { success, error } from "../../utils/response.js";
import {transDate} from "../../utils/transDate.js";

const router = express.Router();

router.use(express.json());
// 配置中间件：解析URL编码的请求体（表单数据）
router.use(express.urlencoded({ extended: true }));

// 获取创建的表单
router.get('/create-form', async (req, res) => {
    try {
        // 获取分页参数，设置默认值
        const page = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        
        // 获取搜索参数
        const { title, description } = req.query;
        
        // 构建基础查询
        let baseQuery = db('forms').where('user_id', req.userId);
        
        // 添加搜索条件
        if (title || description) {
            baseQuery = baseQuery.where(function() {
                if (title) {
                    this.where('title', 'like', `%${title}%`);
                }
                if (description) {
                    this.orWhere('description', 'like', `%${description}%`);
                }
            });
        }
        
        // 查询总数
        const totalResult = await baseQuery.clone()
            .count('id as total')
            .first();
        const total = totalResult.total;
        
        // 分页查询数据
        const raw = await baseQuery.clone()
            .select('*')
            .orderBy('created_at', 'desc')
            .limit(pageSize)
            .offset(offset);
            
        raw.forEach(item => {
            item.created_at = transDate(item.created_at);
            item.updated_at = transDate(item.updated_at);
        });
        
        const createData = raw.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            createTime: item.created_at,
            updateTime: item.updated_at,
            submitCount: item.submission_count,
            formConfig: item.form_config,
        }));
        
        // 返回分页信息
        success(res, {
            createData,
            total,
            page,
            pageSize,
            searchParams: { title, description }  // 返回搜索参数
        }, '获取创建的表单成功');
    } catch (error) {
        console.error('获取创建的表单失败:', error);
        error(res, '获取创建的表单失败', 500, error);
    }
});

// 添加创建表单
router.post('/create-form', async (req, res) => {
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
        return success(res, null, '创建表单成功', 201);

    } catch (err) {
        console.error('创建表单失败:', err);
        return error(res, '创建表单失败', 500);
    }
});
// 删除创建表单
router.delete('/create-form/:id', async (req, res) => {
    const { id } = req.params
    try {
        await db('forms').where("id", id).del()
        return success(res, null, '删除表单成功')
    } catch (err) {
        return error(res, '删除表单失败', 500)
    }
})
// 表单保存（修改操作）
router.post('/save-form', async (req, res) => {
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

// 获取表单信息
router.get('/form/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const form = await db('forms').where('id', id).first();
        if (!form) {
            return error(res, '表单不存在', 404);
        }
        return success(res, form, '获取表单信息成功');
    } catch (err) {
        console.error('获取表单信息失败:', err);
        return error(res, '获取表单信息失败', 500);
    }
})
export default router;