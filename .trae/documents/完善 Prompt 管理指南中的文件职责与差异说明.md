## 修改目标
- 解释并区分 `.trae/documents/prompt-rules.md` 与 `.trae/config/ai-prompts.json` 的职责、受众与使用场景
- 补充各个文件（含 `prompts/{context}/{purpose}.md`、`src/**/.prompt-rules`、`.github/workflows/prompt-validation.yml`）的作用说明与示例
- 在现有文档中新增“文件角色与区别”与“使用场景示例”两节，确保团队依据文档即可落地

## 文档结构调整
- 在“## 概述”后新增“## 文件角色与区别”
- 在“## 3. 具体实现方案”后新增“## 使用场景示例”
- 在“## 4. 管理和维护”中补充“规则更新建议与责任分工”小节

## 新增内容大纲
### 文件角色与区别
- `prompt-rules.md`（项目级规则，面向人类）：定位、适用范围、典型内容（语言、风格、注释、错误处理）
- `ai-prompts.json`（结构化配置，面向工具）：字段说明、上下文与提示模板、被 IDE/CI/CLI 消费的方式
- `prompts/{context}/{purpose}.md`（可选的场景提示库）：组织方式与使用场景
- `src/**/.prompt-rules`（文件夹级规则，YAML）：继承与覆盖、适配本地模块的约束
- `.github/workflows/prompt-validation.yml`：自动化校验、配置变更守护

### 重点区别梳理（`prompt-rules.md` vs `ai-prompts.json`）
- 格式：Markdown 叙述 vs JSON 结构化
- 受众：人读 vs 工具读（IDE、CLI、CI）
- 内容：原则性规约 vs 可执行/可解析的上下文提示与键值
- 更新频率与流程：评审更新 vs 迭代同步
- 示例映射：如何将规则中的“中文优先”映射到 JSON 的 `global_rules.language: zh-CN`

### 使用场景示例
- 编写组件：参考 `prompt-rules.md` 的风格原则 + `src/components/.prompt-rules` 的局部约束
- 写测试：用 `ai-prompts.json` 的 `contexts.testing.prompts.unit_test` 生成提示，确保覆盖主要分支
- PDF 处理：遵循“特定场景规则”并在 `src/lib/.prompt-rules` 中强化错误边界

## 示例文本（将插入到文档）
- 新增“文件角色与区别”示例段落，含要点列表与两三行对照说明
- 新增“使用场景示例”示例段落，列出具体操作步骤与引用字段路径

## 验证方式
- 通过现有 CI 工作流校验 JSON/YAML 格式
- 人工检查：文档引用的路径与行号在仓库内存在且描述一致
