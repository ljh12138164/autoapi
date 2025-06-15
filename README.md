# Auto Form API

这是一个基于 Express.js 的表单设计和数据管理 API 服务。

## 功能特点

- 用户认证和授权
- 表单设计和创建
- 数据管理
- 模板表单
- 仪表盘数据展示

## 安装和使用

### 安装依赖

```bash
npm install
# 或者
pnpm install
```

### 初始化数据库

```bash
npm run init-db
# 或者
pnpm run init-db
```

### 运行开发环境

```bash
npm run dev
# 或者
pnpm run dev
```

### 生产环境运行

```bash
npm start
# 或者
pnpm start
```

## 云环境部署 (CloudWork)

本项目包含了一个专门用于云环境部署的脚本 `cloudwork.js`。该脚本提供了在云环境中管理应用的基本功能。

### 使用方法

#### 显示帮助信息

```bash
npm run cloud
# 或者
pnpm run cloud
```

#### 在云环境中启动应用

```bash
npm run cloud:start
# 或者
pnpm run cloud:start
```

应用将在后台启动并将日志输出到 `logs` 目录。

#### 查看应用状态

```bash
npm run cloud:status
# 或者
pnpm run cloud:status
```

### 日志管理

应用日志保存在 `logs` 目录，每次启动应用会创建一个新的日志文件，格式为 `app-[时间戳].log`。

## 环境变量

项目使用以下环境变量:

- 开发环境: `.env` 文件
- 生产环境: `.env.production` 文件

请确保根据您的需要配置这些环境变量文件。

## 项目结构

- `/config` - 配置文件
- `/middleware` - Express 中间件
- `/routes` - API 路由
- `/utils` - 工具函数
