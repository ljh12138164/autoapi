#!/usr/bin/env node

/**
 * cloudwork.js - 用于云环境中的应用程序管理和部署
 *
 * 此脚本提供了在云环境中运行、监控和管理 auto-form-api 应用程序的功能
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import os from 'os';

// 根据环境加载配置
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env' });
}

const PORT = process.env.PORT || 3000;
const LOG_DIR = path.join(process.cwd(), 'logs');
const VERSION = '1.0.0';

// 确保日志目录存在
async function ensureLogDir() {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    console.log(`日志目录已创建: ${LOG_DIR}`);
  } catch (err) {
    console.error(`创建日志目录失败: ${err.message}`);
    process.exit(1);
  }
}

// 启动应用
async function startApp() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFile = path.join(LOG_DIR, `app-${timestamp}.log`);

  try {
    const logStream = await fs.open(logFile, 'a');

    console.log(`启动应用程序，日志将写入: ${logFile}`);
    console.log(`运行环境: ${process.env.NODE_ENV || 'development'}`);
    console.log(`系统信息: ${os.type()} ${os.release()} (${os.arch()})`);

    const app = spawn('node', ['index.js'], {
      env: process.env,
      stdio: ['ignore', logStream.fd, logStream.fd],
    });

    app.on('close', (code) => {
      console.log(`应用程序退出，退出码: ${code}`);
      logStream.close();
    });

    process.on('SIGINT', () => {
      console.log('接收到终止信号，正在关闭应用...');
      app.kill('SIGINT');
      setTimeout(() => {
        console.log('应用程序未正常关闭，强制退出');
        process.exit(1);
      }, 5000);
    });

    console.log(`应用程序已在端口 ${PORT} 上启动`);
  } catch (err) {
    console.error(`启动应用程序失败: ${err.message}`);
    process.exit(1);
  }
}

// 显示帮助信息
function showHelp() {
  console.log(`
云工作脚本 (CloudWork Script) v${VERSION}
用法:
  node cloudwork.js [命令]

可用命令:
  start    - 启动应用程序
  status   - 检查应用程序状态
  version  - 显示版本信息
  help     - 显示此帮助信息
  `);
}

// 显示应用状态
function showStatus() {
  // 这里可以实现检查应用是否正在运行的逻辑
  console.log('状态检查功能尚未实现');
}

// 主函数
async function main() {
  const command = process.argv[2] || 'help';

  switch (command) {
    case 'start':
      await ensureLogDir();
      await startApp();
      break;
    case 'status':
      showStatus();
      break;
    case 'version':
      console.log(`云工作脚本 (CloudWork Script) 版本 ${VERSION}`);
      break;
    case 'help':
    default:
      showHelp();
      break;
  }
}

// 执行主函数
main().catch((err) => {
  console.error(`错误: ${err.message}`);
  process.exit(1);
});
