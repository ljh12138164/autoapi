import express from 'express';
import db from "../../config/db.js";
import { success, error } from "../../utils/response.js";
import { generateAccessToken, generateRefreshToken,verifyRefreshToken, getCookieOptions } from "../../utils/jwtUtils.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
// db.schema.createTableIfNotExists('users', (table) => {
//     table.increments('id').primary();
//     table.string('username').notNullable();
//     table.string('password').notNullable();
//     table.string('email').notNullable();
//     table.timestamp('created_at').defaultTo(db.fn.now());
// }).then(() => {
//     console.log('users表已创建');
// })

// 登录
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        error(res, '用户名或密码不能为空', 400);
        return;
    }

    db('users').where({ username, password }).then((rows) => {
        if (rows.length > 0) {
            const user = rows[0];
            // 生成Access Token和Refresh Token
            const accessToken = generateAccessToken({ userId: user.id });
            const refreshToken = generateRefreshToken({ userId: user.id });

            // 将Refresh Token设置到HttpOnly Cookie中
            res.cookie('refreshToken', refreshToken, getCookieOptions());

            // 返回Access Token给客户端
            success(res, { accessToken }, '登录成功', 201);
        } else {
            error(res, '用户名或密码错误', 400);
        }
    })
});

// 注册
router.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        error(res, '用户名或密码或邮箱不能为空', 400);
        return;
    }

    db('users').where({ username }).orWhere({ email }).then((rows) => {
        if (rows.length > 0) {
            error(res, '用户名或邮箱已存在', 400);
        } else {
            db('users').insert({ username, password, email }).then(() => {
                success(res, null, '注册成功', 201);
            })
        }
    })
});
// 刷新token
router.post('/refresh-token', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        error(res, 'Refresh Token不存在', 401);
        return;
    }
    // 验证Refresh Token并生成新的Access Token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
        error(res, 'Refresh Token无效或已过期', 401);
        return;
    }

    // 生成新的Access Token
    const newAccessToken = generateAccessToken({ userId: payload.userId });
    success(res, { accessToken: newAccessToken }, 'Token刷新成功', 201);
});

// 退出
router.post('/logout', (req, res) => {
    // 清除Refresh Token
    res.clearCookie('refreshToken', getCookieOptions());
    success(res, null, '退出成功', 200);
})

export default router;