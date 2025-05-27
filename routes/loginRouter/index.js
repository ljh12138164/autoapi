import express from 'express';
import db from "../../config/db.js"
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