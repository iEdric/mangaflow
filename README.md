# MangaFlow AI Studio

> 一个基于 AI 的智能漫画创作平台，让每个人都能轻松创作专业级漫画作品

![ESA](public/esa.png)

"本项目由阿里云ESA提供加速、计算和保护"

## 📖 项目简介

MangaFlow AI Studio 是一个创新的 AI 驱动漫画创作工具，通过简单的文本描述即可生成高质量的漫画分镜和插图。无需绘画技能，只需描述你的故事，AI 就能帮你完成从分镜到插图的整个创作流程。

## ✨ 主要功能

### 🎯 核心功能

- **AI 漫画生成** - 基于文本描述自动生成漫画分镜和插图
- **多种漫画风格** - 支持 5 种经典漫画风格：
  - 经典少年漫（Classic Shonen）- 动态、细致、墨线
  - 青年黑漫（Seinen Noir）- 高对比、粗犷、写实阴影
  - 可爱少女漫（Kawaii Shoujo）- 柔和线条、花卉图案、梦幻
  - 赛博朋克机甲（Cyberpunk Mecha）- 霓虹点缀、锐利金属、未来感
  - 哥特恐怖（Gothic Horror）- 黑暗、诡异、维多利亚风格
- **项目管理** - 创建、保存和管理多个漫画项目
- **实时编辑** - 编辑面板提示词、添加对话气泡、重新生成图片
- **多语言支持** - 完整的中英文界面切换

### 🎨 创作流程

1. **创建项目** - 输入故事标题和描述，选择视觉风格
2. **AI 分镜生成** - 系统自动生成漫画分镜和面板提示词
3. **图片生成** - 为每个面板生成对应的漫画插图
4. **编辑优化** - 修改提示词、添加对话、重新生成图片
5. **保存作品** - 所有项目自动保存到本地

## 🛠️ 技术栈

- **前端框架**: React 19.2.3
- **开发语言**: TypeScript 5.8.2
- **构建工具**: Vite 6.2.0
- **样式方案**: Tailwind CSS (CDN)
- **状态管理**: React Hooks
- **AI 服务**: ModelScope API (Qwen/Qwen-Image)
- **图标库**: Font Awesome (CDN)

## 📦 安装与运行

### 环境要求

- Node.js 18+ (推荐 20.19+ 或 22.12+)
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件并添加你的 ModelScope API Key：

```env
MODELSCOPE_API_KEY=your_api_key_here
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 🎨 项目结构

```
src/
├── components/              # React 组件
│   ├── Sidebar.tsx         # 侧边栏 - 项目列表
│   ├── MangaCanvas.tsx     # 漫画画布 - 主编辑区域
│   └── LanguageSwitcher.tsx # 语言切换器
├── contexts/               # React Context
│   └── LanguageContext.tsx  # 多语言上下文
├── services/               # 服务层
│   └── modelScopeService.ts # ModelScope API 服务
├── types.ts                # TypeScript 类型定义
├── translations.ts         # 多语言翻译
├── App.tsx                 # 主应用组件
├── main.tsx                # 应用入口
└── index.css               # 全局样式
```

## 💡 使用说明

### 1. 创建新项目

1. 点击侧边栏的"新建项目"按钮
2. 填写项目信息：
   - **系列标题**: 你的漫画标题
   - **故事前提**: 详细描述你的故事背景和情节
   - **视觉风格**: 选择一种漫画风格
3. 点击"生成漫画"开始创建

### 2. 编辑漫画

- **编辑提示词**: 悬停在面板上，点击编辑按钮修改提示词
- **重新生成**: 点击旋转图标重新生成当前面板的图片
- **添加对话**: 在对话气泡中输入文字

### 3. 管理项目

- **切换项目**: 在侧边栏点击项目名称
- **删除项目**: 点击项目右侧的删除按钮

## 🌍 多语言支持

应用支持以下语言：
- 🇺🇸 English
- 🇨🇳 简体中文

语言会根据浏览器设置自动选择，也可以点击顶部栏的语言切换器手动切换。

## 💾 数据存储

所有数据存储在浏览器的 `localStorage` 中：
- `mangaflow_projects` - 所有漫画项目数据
- `mangaflow_language` - 语言偏好设置

数据完全本地存储，不会上传到任何服务器。

## 🔌 API 配置

### ModelScope API

本项目使用 ModelScope 的 Qwen/Qwen-Image 模型进行图片生成。

#### 获取 API Key

1. 访问 [ModelScope](https://www.modelscope.cn/)
2. 注册并登录账号
3. 在控制台获取 API Key

#### 配置 API Key

在项目根目录创建 `.env` 文件：

```env
MODELSCOPE_API_KEY=ms-your-api-key-here
```

#### API 特性

- **异步模式**: 使用异步任务模式，支持长时间图片生成
- **轮询机制**: 自动轮询任务状态，直到生成完成
- **错误处理**: 完善的错误处理和重试机制
- **代理支持**: 开发模式下自动使用 Vite 代理避免 CORS 问题

## 🎯 设计理念

MangaFlow AI Studio 旨在：

- **降低创作门槛** - 让没有绘画技能的人也能创作漫画
- **提高创作效率** - AI 辅助生成，快速迭代
- **保持创作自由** - 提供丰富的编辑和自定义选项
- **专业级输出** - 生成高质量的漫画作品

## 📝 开发说明

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 React Hooks 最佳实践
- 组件化设计，职责单一
- 类型安全，完整的类型定义

### 主要依赖

```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "typescript": "~5.8.2",
  "vite": "^6.2.0",
  "uuid": "^13.0.0"
}
```

### 开发注意事项

1. **环境变量**: 确保正确配置 `MODELSCOPE_API_KEY`
2. **CORS 问题**: 开发模式下使用 Vite 代理自动处理
3. **图片加载**: 图片来自外部 CDN，可能需要处理 CORS
4. **类型安全**: 使用 `import type` 导入类型，符合 `verbatimModuleSyntax` 要求

## 🚀 未来计划

- [ ] 支持多页漫画编辑
- [ ] 添加更多漫画风格
- [ ] 支持自定义 LoRA 模型
- [ ] 导出为 PDF/图片格式
- [ ] 协作编辑功能
- [ ] 云端同步


## 🙏 致谢

- [ModelScope](https://www.modelscope.cn/) - 提供 AI 图片生成服务
- [React](https://react.dev/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架

---

**开始你的漫画创作之旅吧！** 🎨✨
