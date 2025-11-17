# PDF 合并排版工具

对多个发票、车票等 PDF 在财务报销时进行合并，按照 1×1、1×2、2×1、2×2、3×3 等布局生成一个合并 PDF，保持原始比例、便于打印。

## 功能特性
- 保持原始长宽比等比缩放，内容居中、不拉伸、不旋转
- 支持布局：`1×1 / 1×2 / 2×1 / 2×2 / 3×3`
- 纸张方向：`纵向（portrait）` 与 `横向（landscape）`
- 页边距与缩放：支持边距像素与缩放比例调节，单元格内尽量填满
- 分割线：`none / cross / grid`，可设置颜色与粗细
- 排序：`上传时间 / 文件日期 / 文件名`
- 预览：设置页内实时可视化网格预览，逻辑与导出一致

## 技术栈
- 前端：React 18、TypeScript 5、Vite 6
- 状态管理：Zustand
- 工具库：`clsx`、`tailwind-merge`
- PDF处理：`pdf-lib`（导出合并）、`pdfjs-dist`（预览缩略图）

## 本地开发
- 安装依赖：`npm i`
- 启动开发：`npm run dev`（默认 `http://localhost:5173/`，端口占用时自动调整）

## 构建与预览
- 生产构建：`npm run build`（输出到 `dist/`）
- 本地预览：`npm run preview`（默认 `http://localhost:4173/`）

## 部署
### Vercel
- 本项目已包含 `vercel.json`，提供 SPA 路由回退到 `index.html`
- Dashboard 配置建议：
  - Install Command：`npm i`
  - Build Command：`npm run build`
  - Output Directory：`dist`
- 直接导入仓库并 Deploy 即可

## 使用说明
1. 在“上传”页选择 PDF 文件（支持多选），可查看文件列表与基本信息
2. 在“排版设置”页选择布局类型、纸张方向、边距、缩放以及分割线样式；右侧预览实时显示效果
3. 点击“开始处理”进入“处理进度”页，生成合并 PDF，支持预览与下载

## 关键代码
- 布局导出逻辑：`src/lib/pdfExportService.ts`（保持比例等比缩放与居中）
  - `apply2x2Layout`：`src/lib/pdfExportService.ts:165-240`
  - `apply3x3Layout`：`src/lib/pdfExportService.ts:245-320`
  - `apply2x1Layout`：`src/lib/pdfExportService.ts:312-391`
  - `apply1x2Layout`：`src/lib/pdfExportService.ts:383-462`
  - 单页 `1×1`：`src/lib/pdfExportService.ts:92-114`
- 预览组件：`src/components/LayoutPreview.tsx`
- 排版设置面板：`src/components/LayoutSettings.tsx`
- 处理页流程：`src/pages/ProcessPage.tsx`
- 全局配置：`src/store/pdfStore.ts`

## 注意事项
- 单个文件大小限制：50MB（读取与处理阶段均校验）
- 预览使用 PDF.js 的 worker（CDN），如需自托管可调整 `pdfService.ts` 的 `GlobalWorkerOptions.workerSrc`
- 如果需要 OCR 才支持“金额/编号”排序，本项目默认不启用（已移除该排序项）

## 许可证
MIT