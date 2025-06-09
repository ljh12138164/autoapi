import express from 'express';
import db from "../../config/db.js";
import { success, error } from "../../utils/response.js";
import {transDate} from "../../utils/transDate.js";

const router = express.Router();

router.use(express.json());
// 配置中间件：解析URL编码的请求体（表单数据）
router.use(express.urlencoded({ extended: true }));

// 获取提交表单列表
router.get('/submit-form', async (req, res) => {
    try {
        // 获取分页参数和搜索参数
        const { pageSize = 10, pageNum = 1, title, submitDate } = req.query;
        // 计算偏移量
        const offset = (pageNum - 1) * pageSize;

        // 构建基础查询
        let query = db('form_submissions')
            .join('forms', 'form_submissions.form_id', 'forms.id')
            .where('form_submissions.user_id', '=', req.userId);

        // 添加标题搜索条件（模糊搜索）
        if (title && title.trim()) {
            query = query.where('forms.title', 'like', `%${title.trim()}%`);
        }

        // 添加提交时间搜索条件（按日期模糊搜索）
        if (submitDate && submitDate.trim()) {
            // 如果传入的是年月日格式（如：2025-06-05），则搜索该日期的所有记录
            query = query.whereRaw('DATE(form_submissions.submitted_at) = ?', [submitDate.trim()]);
        }

        // 查询用户创建的表单的提交数据
        const row = await query
            .select(
                'form_submissions.submission_data',
                'form_submissions.id',
                'form_submissions.submitted_at',
                'forms.title',
            )
            .orderBy('form_submissions.submitted_at', 'desc')  // 按提交时间倒序排列
            .offset(offset)
            .limit(parseInt(pageSize));

        // 获取总数用于分页（使用相同的搜索条件）
        let countQuery = db('form_submissions')
            .join('forms', 'form_submissions.form_id', 'forms.id')
            .where('form_submissions.user_id', '=', req.userId);

        // 添加相同的搜索条件到计数查询
        if (title && title.trim()) {
            countQuery = countQuery.where('forms.title', 'like', `%${title.trim()}%`);
        }

        if (submitDate && submitDate.trim()) {
            countQuery = countQuery.whereRaw('DATE(form_submissions.submitted_at) = ?', [submitDate.trim()]);
        }

        const totalResult = await countQuery
            .count('form_submissions.id as total')
            .first();

        const total = totalResult.total;
        const submittedDate = row.map(item => ({
            id: item.id,
            title: item.title,
            submitTime:transDate(item.submitted_at),
        }));
        console.log(submittedDate[0].submitTime);

        // 返回成功响应
        return success(res, {
            submittedDate,
            total,
            searchParams: { title, submitDate }  // 返回搜索参数，方便前端显示
        }, '获取提交数据成功');

    } catch (err) {
        console.error('获取提交数据失败:', err);
        return error(res, '获取提交数据失败', 500);
    }
});

router.delete('/submit-form', async (req, res) => {
    try {
        // 从查询参数获取ID数组（格式：ids=1,2,3）
        const ids = req.query.ids?.split(',').map(Number) || [];
        if (!ids.length) {
            return error(res, '请至少选择一条记录', 400);
        }

        const deletedCount = await db('form_submissions')
            .whereIn('id', ids)  // 使用 whereIn 批量删除
            .del();

        if (deletedCount === 0) {
            return error(res, '未找到匹配的记录', 404);
        }

        return success(res, null, `成功删除 ${deletedCount} 条记录`);
    } catch (err) {
        console.error('批量删除失败:', err);
        return error(res, '批量删除失败', 500);
    }
});

// 提交表单
router.post('/submit-form', async (req, res) => {
    try {
        const data = req.body;
        const { formId, formData } = data;
        // 检查表单是否存在
        // 构建基础查询
        await db('form_submissions')
            .join('forms', 'form_submissions.form_id', 'forms.id')
            .where('form_submissions.user_id', '=', req.userId).insert({
                form_id: formId,
                submission_data: JSON.stringify(formData),
                user_id: req.userId,
            })

        return success(res, null, '提交表单成功');
    } catch (err) {
        console.error('提交表单失败:', err);
    }
})
export default router;