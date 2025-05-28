import { verifyAccessToken } from '../utils/jwtUtils.js';
import {error} from '../utils/response.js'
const authMiddleware = (req, res, next) => {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        error(res, '未提供token', 401)
    }
    // 提取token（去掉Bearer 前缀）
    const token = authHeader?.split(' ')[1]||'';
    if (!token) {
        error(res, 'token格式错误', 401)
    }

    // 验证token
    const payload = verifyAccessToken(token);
    if (!payload) {
        error(res, 'token无效或已过期', 401)
    }

    // 将用户信息添加到请求对象
    req.user = payload;
    next();
};
export default authMiddleware;