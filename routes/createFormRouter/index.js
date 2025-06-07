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
        const raw = await db.select('*').from('forms').where('user_id', req.userId)
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

export default router;