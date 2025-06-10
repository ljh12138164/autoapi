import dotenv from 'dotenv';
// 导入环境变量
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import loginRouter from './routes/loginRouter/index.js';
import dashboardRouter from './routes/dashboardRouter/index.js';
import createFormRouter from './routes/createFormRouter/index.js';
import dataManagementRouter from './routes/dataManagementRouter/index.js';
import templateFormRouter from './routes/templateFormRouter/index.js';
// 导入关于权限中间件
import authMiddleware from './middleware/authMiddleware.js';
import { error } from './utils/response.js';
const excludePaths = [
  '/api/login',
  '/api/register',
  '/api/refresh-token',
  '/login',
  '/register',
  '/refresh-token',
];
const app = express();
// 解决跨域问题
// 根据环境加载配置
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env' });
}

// CORS 配置
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'],
    credentials: true
}));
// 解析请求体
app.use(bodyParser.json());
// 解析请求体
app.use(bodyParser.urlencoded({ extended: true }));
// 解析Cookie
app.use(cookieParser());

// 注册应用级中间件
app.use((req, res, next) => {
  if (excludePaths.includes(req.originalUrl)) {
    return next();
  }
  return authMiddleware(req, res, next)
})
// 登录
app.use(loginRouter)
// 仪表盘
app.use('/dashboard',dashboardRouter)
// 数据管理
app.use(dataManagementRouter)
// 表单设计
app.use(createFormRouter)
// 模板表单
app.use(templateFormRouter)
// 404处理（放在最后）
app.use((req, res) => {
  error(res, '接口不存在', 404);
});
// 启动服务器
app.listen(3000, () => {
  console.log('Server started on port 3000');
})