// 导入jsonwebtoken库
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN, REFRESH_TOKEN, COOKIE_OPTIONS } from '../config/jwt.js';
// 导入JWT配置

/**
 * 生成Access Token
 * @param {Object} payload - 要加密的数据，通常包含用户ID等信息
 * @returns {string} 返回生成的Access Token
 */
const generateAccessToken = (payload) => {
    try {
        return jwt.sign(payload, ACCESS_TOKEN.secret, {
            expiresIn: ACCESS_TOKEN.expiresIn,
            algorithm: ACCESS_TOKEN.algorithm
        });
    } catch (error) {
        console.error('生成Access Token失败:', error);
        return null;
    }
};

/**
 * 生成Refresh Token
 * @param {Object} payload - 要加密的数据，通常只包含用户ID
 * @returns {string} 返回生成的Refresh Token
 */
const generateRefreshToken = (payload) => {
    try {
        return jwt.sign(payload, REFRESH_TOKEN.secret, {
            expiresIn: REFRESH_TOKEN.expiresIn,
            algorithm: REFRESH_TOKEN.algorithm
        });
    } catch (error) {
        console.error('生成Refresh Token失败:', error);
        return null;
    }
};

/**
 * 验证Access Token
 * @param {string} token - 要验证的Access Token
 * @returns {Object|null} 验证成功返回解密的数据，失败返回null
 */
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN.secret);
    } catch (error) {
        // token过期或无效
        console.error('Access Token验证失败:', error.message);
        return null;
    }
};

/**
 * 验证Refresh Token
 * @param {string} token - 要验证的Refresh Token
 * @returns {Object|null} 验证成功返回解密的数据，失败返回null
 */
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN.secret);
    } catch (error) {
        console.error('Refresh Token验证失败:', error.message);
        return null;
    }
};
/**
 * 使用Refresh Token刷新Access Token
 * @param {string} refreshToken - Refresh Token
 * @returns {Object|null} 返回新的Access Token和用户信息，失败返回null
 */
const refreshAccessToken = (refreshToken) => {
    try {
        // 验证Refresh Token
        const payload = verifyRefreshToken(refreshToken);
        if (!payload) {
            return null;
        }
        // 生成新的Access Token
        // 注意：这里只使用用户ID生成新token，避免信息过期
        const newAccessToken = generateAccessToken({ userId: payload.userId });

        return {
            accessToken: newAccessToken,
            userId: payload.userId
        };
    } catch (error) {
        console.error('刷新Access Token失败:', error);
        return null;
    }
};

/**
 * 获取用于设置Refresh Token的Cookie选项
 * @returns {Object} Cookie配置选项
 */
const getCookieOptions = () => COOKIE_OPTIONS;

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    refreshAccessToken,
    getCookieOptions
};