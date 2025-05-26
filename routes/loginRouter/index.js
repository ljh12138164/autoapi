import express from 'express';
import knex from 'knex';
const db = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'auto_form'
    },
    pool: {
        min: 2,       // 最小空闲连接数
        max: 10,      // 最大连接数
        idleTimeoutMillis: 30000, // 连接空闲超时时间（毫秒）
        acquireTimeoutMillis: 60000, // 获取连接超时时间（毫秒）
        createTimeoutMillis: 30000, // 创建连接超时时间（毫秒）
        destroyTimeoutMillis: 5000, // 销毁连接超时时间（毫秒）
        propagateCreateError: false // 是否传播创建连接时的错误
    }
})
db.schema.createTableIfNotExists('users', (table) => {
    table.increments('id').primary();
    table.string('username');
    table.string('password');
    table.timestamps();
}).then(() => {
    console.log('Table created');
})
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/login', (req, res) => {
    res.send('登录成功');
});
export default router;