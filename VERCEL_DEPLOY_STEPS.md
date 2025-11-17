# 🚀 PDF合并排版工具 - Vercel部署步骤

## 当前状态
✅ Git仓库已初始化  
✅ 代码已提交  
✅ 项目构建成功  
✅ Vercel配置文件已优化  

## 📋 部署步骤

### 步骤1: 创建GitHub仓库
由于网络限制，请手动执行以下步骤：

1. 访问 https://github.com/new
2. 创建新仓库，命名为 `pdf-merge-tool`
3. 不要初始化README（因为已有代码）
4. 复制仓库地址（HTTPS或SSH）

### 步骤2: 推送代码到GitHub
```bash
# 添加远程仓库（替换YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/pdf-merge-tool.git

# 推送到GitHub
git push -u origin master
```

### 步骤3: 部署到Vercel

#### 方法一：通过Vercel网页界面（推荐）
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 选择您刚创建的GitHub仓库
5. Vercel会自动检测配置：
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. 点击 "Deploy" 按钮

#### 方法二：通过Vercel CLI（如果网络允许）
```bash
# 登录Vercel（需要网络）
npx vercel login

# 部署项目
npx vercel --prod
```

## 🎯 项目配置说明

### vercel.json 配置
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

### 项目特性
- **框架**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **PDF处理**: pdf-lib + pdfjs-dist
- **状态管理**: Zustand
- **路由**: React Router DOM
- **通知**: Sonner
- **图标**: Lucide React

## 📊 构建结果
```
✓ 1892 modules transformed
dist/index.html                    26.10 kB
dist/assets/index-B14baNp0.css     17.78 kB
dist/assets/index-rJsRCs7i.js   1,382.73 kB
✓ built in 4.56s
```

## 🔧 部署后验证

部署成功后，请访问提供的URL进行验证：

1. **首页测试**: https://your-app.vercel.app/
2. **文件上传**: 拖拽或选择PDF文件
3. **文件预览**: 检查文件是否正确显示
4. **处理功能**: 点击"开始处理"测试PDF合并
5. **下载测试**: 验证生成的PDF文件

## 🚨 常见问题

### 构建失败
- 检查TypeScript编译错误: `npm run check`
- 确保所有依赖已安装: `npm install`

### PDF处理错误  
- 检查文件大小限制（当前50MB）
- 验证PDF文件格式正确

### 页面空白
- 检查浏览器控制台错误
- 验证路由配置正确

## 📞 技术支持

如果遇到问题，请检查：
1. 浏览器控制台错误信息
2. Vercel部署日志
3. 网络连接状态

---

🎉 **准备就绪！** 按照上述步骤即可完成部署。部署成功后，您将获得一个类似 `https://pdf-merge-tool-xxx.vercel.app` 的访问地址。