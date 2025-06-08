import { verifyAccessToken } from '../utils/jwtUtils.js';
import {error} from '../utils/response.js'
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
export default authMiddleware;