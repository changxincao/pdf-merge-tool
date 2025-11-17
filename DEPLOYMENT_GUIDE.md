# PDF合并排版工具 - Vercel部署指南

## 🚀 快速部署步骤

### 1. 准备GitHub仓库
```bash
# 初始化Git仓库（已完成）
git init

# 添加所有文件（已完成）
git add .

# 提交代码（已完成）
git commit -m "Initial commit: PDF合并排版工具"

# 创建GitHub仓库并推送
# 请访问 https://github.com/new 创建新仓库
# 然后将代码推送到GitHub
```

### 2. 部署到Vercel

#### 方法一：通过Vercel网页界面
1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入GitHub仓库
4. 配置项目设置：
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### 方法二：通过Vercel CLI（推荐）
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel

# 按照提示配置：
# - 选择项目目录：当前目录
# - 是否链接到现有项目：否
# - 项目名称：pdf-merge-tool（或自定义）
# - 部署目录：./
# - 构建命令：npm run build
# - 输出目录：dist
# - 安装命令：npm install
```

### 3. 项目配置

#### vercel.json（已配置）
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### package.json脚本
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "check": "tsc -b --noEmit"
  }
}
```

### 4. 功能特性

✅ **核心功能：**
- PDF文件上传和预览
- 智能页面识别和分类
- 多种排版布局（2x2, 3x3, 2x1, 1x2）
- 发票金额和编号自动提取
- 文件排序和过滤
- 批量PDF处理

✅ **技术栈：**
- React 18 + TypeScript
- Vite构建工具
- Tailwind CSS样式
- pdf-lib PDF处理
- pdfjs-dist PDF解析
- Zustand状态管理

### 5. 部署验证

部署成功后，访问提供的URL进行验证：
1. 上传PDF文件测试
2. 检查文件预览功能
3. 测试排版布局选项
4. 验证PDF合并功能

### 6. 故障排除

#### 常见问题：
- **构建失败**：检查TypeScript编译错误
- **PDF处理错误**：确保pdf-lib正确安装
- **文件上传问题**：检查文件大小限制

#### 环境要求：
- Node.js 18+
- 现代浏览器支持
- 建议启用HTTPS

### 7. 性能优化建议

- 启用CDN加速
- 配置适当的缓存策略（已配置）
- 考虑添加加载状态指示器
- 优化大文件处理性能

---

🎉 **部署完成！** 您的PDF合并排版工具已成功部署到Vercel。