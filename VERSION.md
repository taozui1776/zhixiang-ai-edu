# 智象平台版本管理规范

## 版本号命名规则

采用**语义化版本号**：`v主版本号.次版本号.修订号`

### 版本号含义

| 位 | 名称 | 升级时机 | 示例 |
|---|---|---|---|
| 第一位 | 主版本号 | 重大架构变更、不兼容的API修改、核心定位调整 | v1.0.0 → v2.0.0 |
| 第二位 | 次版本号 | 新增功能模块、页面、重要特性 | v1.0.0 → v1.1.0 |
| 第三位 | 修订号 | Bug修复、样式优化、小功能调整 | v1.0.0 → v1.0.1 |

### 版本阶段标识

| 标识 | 含义 | 示例 |
|---|---|---|
| 无后缀 | 正式发布版 | v1.0.0 |
| -beta | 测试版（功能基本完整，可能有bug） | v1.1.0-beta |
| -alpha | 开发版（功能不完整，内部测试） | v1.2.0-alpha |
| -rc | 发布候选版（准备正式发布） | v1.0.0-rc1 |

### Git Tag命名

与版本号一致：`v1.0.0`、`v1.1.0`

---

## 版本发布检查清单

发布前必须逐项确认：

### 一、构建验证
- [ ] `npm run build` 构建成功，无错误
- [ ] 构建产物 `dist/` 目录完整
- [ ] CSS文件正常加载（非纯文本显示）

### 二、页面验证（32个核心页面）
- [ ] 首页 `/`
- [ ] 登录页 `/login`
- [ ] 课程库 `/courses`
- [ ] 课程详情 `/courses/:courseId`
- [ ] 备课工作台 `/prepare`
- [ ] 素材库 `/my-materials`
- [ ] AI实验室 `/ai-lab`
- [ ] AI实验详情 `/ai-lab/:projectId`
- [ ] 编程实验室 `/coding-lab`
- [ ] AI工具 `/ai-tools`
- [ ] 硬件生态 `/hardware`
- [ ] 硬件连接 `/hardware/connect`
- [ ] 固件中心 `/hardware/firmware`
- [ ] AI模型中心 `/ai-model-center`
- [ ] AI训练平台 `/ai-training`
- [ ] 边缘AI `/edge-ai`
- [ ] 开放平台 `/open-platform`
- [ ] 教师中心 `/teacher`
- [ ] 数据分析 `/teacher/analytics`
- [ ] 班级管理 `/teacher/class`
- [ ] 学校管理 `/teacher/school`
- [ ] 数据管理 `/teacher/data-management`
- [ ] 版权 `/copyright`
- [ ] 视觉课程 `/vision`
- [ ] 知识地图 `/knowledge-map`
- [ ] 学生中心 `/student`
- [ ] 课后拓展 `/after-school`
- [ ] 教师培训 `/teacher-training`
- [ ] 个人中心 `/profile`
- [ ] 订阅方案 `/pricing`
- [ ] 学科工具 `/tools`
- [ ] 训练中心 `/training`
- [ ] 授课模式 `/teach/:courseId`

### 三、核心功能验证
- [ ] 登录/登出正常
- [ ] 课程浏览和详情查看正常
- [ ] 开始授课模式正常
- [ ] AI实验室项目详情正常
- [ ] 页面间跳转无404
- [ ] 无控制台JS错误

### 四、部署验证
- [ ] GitHub推送成功
- [ ] Vercel自动部署成功
- [ ] 线上域名 https://www.lesn.vip 可访问
- [ ] 线上版本与本地版本一致

---

## 版本发布流程

### 日常开发（本地）
1. 本地修改代码
2. `npm run build` 验证构建
3. `npm run preview` 本地预览验证
4. **不推送GitHub**，累积到版本发布

### 版本发布
1. 确认所有修改完成并本地验证通过
2. 更新版本号（package.json）
3. 填写版本更新日志（CHANGELOG.md）
4. Git提交：`git commit -m "release: v1.x.x"`
5. Git打标签：`git tag v1.x.x`
6. 推送：`git push && git push --tags`
7. Vercel自动部署
8. 线上验证

---

## 版本历史

### v1.1.1（2026-09-10 发布）
**UI/UX优化：**
- 首页授课记录区全面重新设计
  - 左侧：今日课程卡片（蓝紫渐变+装饰圆），显示课程名/班级/节次/时间
  - 右侧：增加课程进度条，课时卡片更紧凑，显示课件/实验资源标签
  - 去掉课时列表中重复的"开始上课"按钮，点击课时卡片直接进入授课
- 顶部"开始上课"按钮改为"快速上课"（弹出快速选课面板）
- AI助手头像改为会动的🐘emoji（上下跳动+背景光晕呼吸效果）
- 修复"开始上课"按钮图标显示为圆圈的问题（PlayCircle→Play）

### v1.1.0（2026-09-10 发布）
**重大更新：**
- 全新左侧边栏布局（方案A），替代原顶部导航
  - 侧边栏按"教学/实验与工具/管理/更多"四组分类
  - 顶部栏：页面标题 + 全局搜索 + 开始上课按钮
  - 深色侧边栏+明亮蓝紫配色，科技感更强
- 平台名称全面更新为"希沃-智象AI人工智能教育平台"
- 登录守卫：所有页面需登录，未登录自动跳转登录页，登录后跳回来源页
- 演示账号teacher/123456自动注册（首次使用无需手动注册）

**Bug修复：**
- 修复AI助手悬浮按钮头像URL为空导致显示紫色方块
- 移除HomePage中重复的AIAssistantFloat组件（与Layout中的AiAssistantPanel冲突）
- 修复AI实验室详情页Tabs结构错误（TabsContent必须在Tabs内）
- 修复AI实验室"对应课程"跳转路径 /course/ → /courses/
- 修复Footer数据管理链接 /data-management → /teacher/data-management
- 修复首页教师中心快捷入口 /teacher-center → /teacher
- 修复编程实验室硬件连接跳转 /hardware-connect → /hardware/connect（3处）
- 修复教师中心数据管理跳转路径
- 修复权限配置中的数据管理路径（2处）
- 移除Layout中重复的TeacherAuthProvider，避免嵌套冲突

**新增页面：**
- 备课工作台页面 /prepare
- 我的素材库页面 /my-materials
- 版本管理规范文档 VERSION.md

**验证：**
- 38个页面全部通过，0个JS错误/崩溃/404
- 所有侧边栏导航链接已核对
- 登录守卫功能验证通过
- 已部署：https://www.lesn.vip
