// 导入必要的模块
import express from 'express';
import db from "../../config/db.js";
import { success, error } from "../../utils/response.js";

const router = express.Router();

router.use(express.json());
// 配置中间件：解析URL编码的请求体（表单数据）
router.use(express.urlencoded({ extended: true }));

/**
 * 获取仪表盘统计数据接口
 * 路由：GET /api/dashboard/stats
 * 功能：返回用户的核心统计数据
 * 返回数据：我的表单数、今日提交数、总提交数
 */
router.get('/stats', async (req, res) => {
    try {
        // 从中间件中获取当前登录用户的ID
        const userId = req.userId;
        // 在forms表中查找creator_id等于当前用户ID的记录数量
        const myFormsCount = await db('forms')
            .where('user_id', userId)    // 筛选条件：创建者是当前用户
            .count('id as count')           // 计算记录数量
            .first();                       // 获取第一条结果
        // 查询2：获取今日提交数
        // 首先设置今日的开始时间（00:00:00）
        const today = new Date();
        today.setHours(0, 0, 0, 0);        // 设置为今天的0点
        // 直接查询，不需要联表
        const todaySubmissions = await db('form_submissions')
            .where('user_id', userId)  // 直接根据用户ID查询
            .where('submitted_at', '>=', today)  // 今天的提交
            .count('id as count')
            .first();

        const totalSubmissions = await db('form_submissions')
            .where('user_id', userId)  // 直接根据用户ID查询
            .count('id as count')
            .first();
        // 组装统计数据对象
        const stats = {
            myForms: parseInt(myFormsCount.count) || 0,           // 我的表单数（转为整数，默认0）
            todaySubmissions: parseInt(todaySubmissions.count) || 0,  // 今日提交数
            totalSubmissions: parseInt(totalSubmissions.count) || 0   // 总提交数
        };

        // 返回成功响应
        success(res, stats, '获取统计数据成功');
    } catch (err) {
        // 错误处理：记录错误日志并返回错误响应
        console.error('获取统计数据失败:', err);
        error(res, '获取统计数据失败', 500);
    }
});

/**
 * 获取表单提交趋势数据接口
 * 路由：GET /api/dashboard/trends?days=7
 * 功能：返回指定天数内每天的表单提交数量，用于绘制趋势图
 * 参数：days - 查询天数（默认7天）
 * 参数：
 * 返回：每日提交数据数组 [{date: '2024-01-01', count: 5}, ...]
 */
router.get('/trends', async (req, res) => {
    try {
        const userId = req.userId;
        // 支持两种查询方式：
        // 方式1：传入天数 ?days=7
        // 方式2：传入日期范围 ?startDate=2025-06-05&endDate=2025-06-07
        const { days, startDate: startDateParam, endDate: endDateParam } = req.query;

        let startDate, endDate;

        if (startDateParam && endDateParam) {
            // 使用传入的日期范围
            startDate = new Date(startDateParam);
            endDate = new Date(endDateParam);
            startDate.setHours(0, 0, 0, 0);  // 设置为当天0点
            endDate.setHours(23, 59, 59, 999);  // 设置为当天23:59:59
        } else {
            // 使用天数方式（保持向后兼容）
            const daysCount = parseInt(days) || 7;
            endDate = new Date();
            startDate = new Date();
            startDate.setDate(endDate.getDate() - daysCount + 1);
            startDate.setHours(0, 0, 0, 0);
        }

        // 计算实际查询的天数（用于后面填充缺失日期）
        const actualDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        // 查询指定日期范围内的每日提交数据
        const trendsData = await db('forms')
            .where('forms.user_id', userId)
            .where('forms.created_at', '>=', startDate)
            .where('forms.created_at', '<=', endDate)
            .select(
                db.raw('DATE(forms.created_at) as date'),
                db.raw('COUNT(*) as count')
            )
            .groupBy(db.raw('DATE(forms.created_at)'))
            .orderBy('date');

        // 填充缺失的日期
        const result = [];
        for (let i = 0; i < actualDays; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dateStr = currentDate.toISOString().split('T')[0];

            const existingData = trendsData.find(item => item.date.toISOString().split('T')[0] === dateStr);
            result.push({
                date: dateStr,
                count: existingData ? parseInt(existingData.count) : 0
            });
        }

        success(res, result, '获取趋势数据成功');
    } catch (err) {
        console.error('获取趋势数据失败:', err);
        error(res, '获取趋势数据失败', 500);
    }
});

/**
 * 获取最近提交记录接口
 * 路由：GET /api/dashboard/recent-activities?limit=10
 * 功能：获取用户表单的最近提交记录
 * 参数：limit - 返回记录数量（默认10条）
 */
router.get('/recent-activities', async (req, res) => {
    try {
        const userId = req.userId;
        // 从查询参数中获取限制数量，默认10条
        const { limit = 10 } = req.query;

        // 查询最近的表单提交活动
        const activities = await db('form_submissions')
            .where('form_submissions.user_id', userId)
            .select(
                'form_submissions.id',
                'form_submissions.submitted_at',
            )
            .orderBy('form_submissions.submitted_at', 'desc')
            .limit(parseInt(limit));
        // 格式化活动数据，转换为前端需要的格式
        const formattedActivities = activities.map(activity => ({
            id: activity.id,                                           // 活动ID
            type: 'submission',                                        // 活动类型：提交
            title: `收到新的表单提交`,                                    // 活动标题
            submittedDate: activity.submitted_at.toISOString().replace('T', ' ').slice(0, 19),                       // 活动时间
        }));

        success(res, formattedActivities, '获取最近活动成功');
    } catch (err) {
        console.error('获取最近活动失败:', err);
        error(res, '获取最近活动失败', 500);
    }
});

/**
 * 获取我的表单列表接口
 * 路由：GET /api/dashboard/my-forms?page=1&limit=10
 * 功能：分页获取当前用户创建的表单列表，包含每个表单的提交统计
 * 参数：page - 页码（默认1），limit - 每页数量（默认10）
 * 返回：表单列表和分页信息
 */
router.get('/my-forms', async (req, res) => {
    try {
        const userId = req.userId;
        // 获取分页参数
        const { page = 1, limit = 10 } = req.query;
        // 计算偏移量（跳过前面几页的记录）
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // 查询当前用户的表单列表（分页）
        const forms = await db('forms')
            .where('creator_id', userId)                               // 只看当前用户创建的表单
            .select(
                'id',                                                  // 表单ID
                'title',                                               // 表单标题
                'description',                                         // 表单描述
                'status',                                              // 表单状态
                'created_at',                                          // 创建时间
                'updated_at'                                           // 更新时间
            )
            .orderBy('updated_at', 'desc')                            // 按更新时间倒序
            .limit(parseInt(limit))                                   // 限制返回数量
            .offset(offset);                                          // 跳过前面的记录

        // 为每个表单获取提交统计数据
        // 使用Promise.all并行执行多个查询，提高性能
        const formsWithStats = await Promise.all(
            forms.map(async (form) => {
                // 查询当前表单的提交数量
                const submissionCount = await db('form_submissions')
                    .where('form_id', form.id)                        // 筛选当前表单的提交
                    .count('id as count')                             // 计算数量
                    .first();

                // 返回表单信息 + 提交统计
                return {
                    ...form,                                           // 展开原表单信息
                    submission_count: parseInt(submissionCount.count) || 0  // 添加提交数量
                };
            })
        );

        // 查询总记录数，用于计算分页信息
        const totalCount = await db('forms')
            .where('creator_id', userId)
            .count('id as count')
            .first();

        // 组装返回结果
        const result = {
            forms: formsWithStats,                                     // 表单列表（含统计）
            pagination: {                                              // 分页信息
                current_page: parseInt(page),                         // 当前页码
                per_page: parseInt(limit),                            // 每页数量
                total: parseInt(totalCount.count),                    // 总记录数
                total_pages: Math.ceil(parseInt(totalCount.count) / parseInt(limit))  // 总页数
            }
        };

        success(res, result, '获取表单列表成功');
    } catch (err) {
        console.error('获取表单列表失败:', err);
        error(res, '获取表单列表失败', 500);
    }
});

/**
 * 记录用户活动的工具函数
 * 功能：将用户的操作行为记录到user_activities表中
 * 参数：
 * - userId: 用户ID
 * - activityType: 活动类型（如：'create_form', 'submit_form'等）
 * - description: 活动描述
 * - relatedId: 关联的记录ID（可选，如表单ID）
 * 
 * 注意：这是一个工具函数，目前在代码中定义了但没有被调用
 * 可以在其他接口中调用此函数来记录用户行为
 */
const logActivity = async (userId, activityType, description, relatedId = null) => {
    try {
        // 向user_activities表插入活动记录
        await db('user_activities').insert({
            user_id: userId,                                           // 用户ID
            activity_type: activityType,                               // 活动类型
            description: description,                                  // 活动描述
            related_id: relatedId,                                     // 关联ID（可选）
            created_at: new Date()                                     // 记录时间
        });
    } catch (err) {
        // 记录活动失败不影响主要业务流程，只记录错误日志
        console.error('记录用户活动失败:', err);
    }
};

// 导出路由模块，供主应用使用
export default router;