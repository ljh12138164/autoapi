import express from 'express';
import db from "../../config/db.js"
// 创建用户表
// db.schema.createTableIfNotExists('users', (table) => {
//     table.increments('id').primary().comment('用户ID');
//     table.string('username').notNullable().unique().comment('用户名');
//     table.string('password').notNullable().comment('密码');
//     table.string('email').notNullable().unique().comment('邮箱');
//     table.timestamps();
// }).then(() => {
//     console.log('Table created');
// })
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
// 登录
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: '用户名或密码不能为空', code: 400 });
        return;
    }
    db('users').where({ username, password }).then((rows) => {
        if (rows.length > 0) {
            res.json({ message: '登录成功', code: 201 });
        } else {
            res.status(401).json({ message: '用户名或密码错误', code: 401 });
        }
    })
});

// 注册
router.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        res.status(400).json({ message: '用户名或密码或邮箱不能为空', code: 400 });
        return;
    }
    db('users').where({ username }).orWhere({ email }).then((rows) => {
        if (rows.length > 0) {
            res.status(400).json({ message: '用户名或邮箱已存在', code: 400 });
        } else {
            db('users').insert({ username, password, email }).then(() => {
                res.json({ message: '注册成功', code: 201 });
            })
        }
    })
})
export default router;