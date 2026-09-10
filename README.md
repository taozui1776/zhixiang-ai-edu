# 智象 K12 人工智能通识教育资源平台

> 让每一节 AI 通识课都能动手

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产包
npm run build

# 预览构建结果
npm run preview
```

## AI 功能配置

部署到外部服务器后，AI 功能需要配置您自己的 API Key：

1. 进入「个人中心 → AI 设置」
2. 填入 API Key（默认 DeepSeek，也支持任何 OpenAI 兼容服务）
3. 点击「保存设置」→「测试连接」

推荐使用 DeepSeek（便宜、中文效果好）：https://platform.deepseek.com

也支持阿里云通义千问兼容模式：`https://dashscope.aliyuncs.com/compatible-mode/v1`

## 部署

### Vercel / Netlify

连接 Git 仓库后自动部署：
- Build Command: `npm run build`
- Output Directory: `dist`

### 静态托管（阿里云 OSS / 腾讯云 COS 等）

上传 `dist/` 目录下所有文件，配置：
- 默认首页：`index.html`
- 404 回退：`index.html`（SPA 路由必须）
