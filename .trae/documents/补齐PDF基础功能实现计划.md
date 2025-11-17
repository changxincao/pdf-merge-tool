## 目标

补齐需求文档中的基础 PDF 处理功能（导入、预览、合并/排版、导出已具备），完善分割、注释、OCR 识别与历史存储，确保端到端流程可用。

## 功能范围

1. 分割：按页范围、偶/奇数页、关键字规则切分；批量导出
2. 注释：前端批注（矩形、高亮、文本）；导出含批注 PDF
3. OCR：对扫描件做文字识别；发票/车票字段抽取与排序
4. 历史：持久化处理记录、结果文件、配置；可重处理/下载

## 前端实现

1. 预览层扩展

* PDF 缩略图支持选择框与批注层

* 组件：`AnnotationLayer`、`SplitRangeSelector`

1. 处理流程扩展

* `ProcessPage` 增加分割与注释阶段

* 导出选项新增“导出分割包/含批注版本”

1. 布局与导出

* `pdfExportService` 增加 `splitPDF(pagespec)` 与 `applyAnnotations(annos)`

* 统一下载与 Blob URL 输出

## 后端服务

1. API（FastAPI）

* `/upload`、`/ocr`、`/layout`、`/split`、`/export`、`/history`

* 模型：任务、文件、配置、结果

1. 引擎

* PDF 处理：PyPDF2/pdfplumber/ReportLab

* OCR：Tesseract 或 PaddleOCR（中文优先）

* 存储：MinIO（文件）、Supabase/Postgres（元数据）、Redis（队列/进度）

## 验证与测试

* 单元：`pdfExportService` 的合并/分割/批注

* 集成：前后端处理流程、并发与大文件

* 可视化：预览交互、批注准确性、OCR 字段抽取率

## 交付与里程碑

* M1：分割与导出；历史记录本地持久化

* M2：注释层与导出；历史持久化对接后端

* M3：OCR 服务与字段抽取；全流程打通

