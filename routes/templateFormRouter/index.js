// 导入必要的模块
import express from 'express';
import db from "../../config/db.js";
import { success, error } from "../../utils/response.js";
import {transDate} from "../../utils/transDate.js";

const router = express.Router();

router.use(express.json());
// 配置中间件：解析URL编码的请求体（表单数据）
router.use(express.urlencoded({ extended: true }));

router.get('/template-form', async (req, res) => {
    try {
        const raw = await db('form_templates').select('*').orderBy('created_at','desc');
        raw.forEach(item => {
            item.created_at =transDate(item.created_at);
            item.updated_at =transDate(item.updated_at);
        });
        const data = raw.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            usageCount: item.usage_count,
            templateConfig: item.template_config,
            createTime: item.created_at,
            updateTime: item.updated_at,
        }));
        return success(res, data, '获取模板表单成功');
    }catch (err) {
        error(res, '获取模板表单失败', 500, err);
    }
})
export default router;