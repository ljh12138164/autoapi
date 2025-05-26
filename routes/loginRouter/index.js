import express, { Router } from 'express';
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.get('/login', (req, res) => {
    res.send('登录成功');
});
export default router;