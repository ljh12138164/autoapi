import express from 'express';
import db from "../../config/db.js"
import { success, error } from "../../utils/response.js"
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
// 登录
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        error(res,  '用户名或密码不能为空', 400);
    }
    db('users').where({ username, password }).then((rows) => {
        if (rows.length > 0) {
            success(res, null, '登录成功', 201);
        } else {
            error(res, '用户名或密码错误', 201);
        }
    })
});

// 注册
router.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        error(res, '用户名或密码或邮箱不能为空', 400);
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
})
export default router;