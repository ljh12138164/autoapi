import dotenv from 'dotenv';
// 导入环境变量
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import loginRouter from './routes/loginRouter/index.js';
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
app.use(cors());
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
app.use(loginRouter)

// 404处理（放在最后）
app.use((req, res) => {
  error(res, '接口不存在', 404);
});
// 启动服务器
app.listen(3000, () => {
  console.log('Server started on port 3000');
})