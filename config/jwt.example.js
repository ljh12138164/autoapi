// Access Token配置
export const ACCESS_TOKEN = {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '15m',  // 15分钟过期
    algorithm: 'HS256'
}

// Refresh Token配置
export const REFRESH_TOKEN = {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',   // 7天过期
    algorithm: 'HS256'
}

// Cookie配置（用于存储refresh token）
export const COOKIE_OPTIONS = {
    httpOnly: true,     // 防止客户端JS访问
    secure: process.env.NODE_ENV === 'production',  // 生产环境才启用HTTPS
    sameSite: 'strict', // 防止CSRF攻击
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7天过期（毫秒）
}