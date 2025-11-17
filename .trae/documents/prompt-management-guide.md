# 项目 Prompt 管理指南

## 概述
本文档说明如何在项目中设置和管理 AI Prompt 规则，包括项目级和文件夹级配置的最佳实践。

## 1. Prompt 设置的最佳位置

### 1.1 项目根目录配置
建议在项目根目录创建专门的配置文件：

```
项目根目录/
├── .trae/
│   ├── documents/
│   │   └── prompt-rules.md      # 项目级prompt规则
│   └── config/
│       └── ai-prompts.json      # 结构化prompt配置
├── src/
├── docs/
└── prompts/                     # 可选：专门的prompts文件夹
    ├── development/
    ├── testing/
    └── production/
```

### 1.2 推荐的文件命名
- `.trae/documents/prompt-rules.md` - 项目级规则文档
- `.trae/config/ai-prompts.json` - 结构化配置文件
- `prompts/{context}/{purpose}.md` - 分类prompt文件

## 2. 文件夹级别设置支持

### 2.1 分层配置结构
支持文件夹级别的prompt设置，采用继承机制：

```
src/
├── .prompt-rules               # 当前文件夹规则
├── components/
│   ├── .prompt-rules          # 组件特定规则
│   └── Button/
│       └── .prompt-rules      # 按钮组件专用规则
├── utils/
│   └── .prompt-rules          # 工具函数规则
└── services/
    └── .prompt-rules          # 服务层规则
```

### 2.2 规则继承机制
子文件夹可以：
- 继承父文件夹规则
- 覆盖特定规则
- 添加新规则

## 3. 具体实现方案

### 3.1 JSON配置文件格式

`.trae/config/ai-prompts.json`:
```json
{
  "version": "1.0",
  "project": {
    "name": "PDFTest",
    "type": "typescript-react",
    "description": "PDF处理工具项目"
  },
  "global_rules": {
    "language": "zh-CN",
    "coding_style": "clean-code",
    "error_handling": "comprehensive",
    "testing": "required"
  },
  "contexts": {
    "development": {
      "prompts": {
        "code_review": "请进行代码审查，关注：1) 代码质量 2) 性能优化 3) 安全性",
        "refactoring": "重构代码时保持原有功能，提高可读性和维护性"
      }
    },
    "testing": {
      "prompts": {
        "unit_test": "编写单元测试，覆盖主要逻辑分支，使用Jest框架",
        "integration_test": "编写集成测试，验证组件间交互"
      }
    }
  }
}
```

### 3.2 Markdown规则文档

`.trae/documents/prompt-rules.md`:
```markdown
# 项目 AI Prompt 规则

## 全局规则
- **语言**: 中文优先，技术术语可用英文
- **代码风格**: 遵循Clean Code原则
- **注释**: 关键逻辑必须添加注释
- **错误处理**: 所有异步操作必须有错误处理

## 特定场景规则

### PDF处理相关
- 处理PDF文件时使用适当的库（如pdf-lib、jspdf）
- 考虑大文件处理性能
- 确保浏览器兼容性

### TypeScript开发
- 严格类型检查
- 避免使用any类型
- 接口定义清晰

## 文件夹特定规则

### /src/lib
- 工具函数必须纯函数
- 添加完整的JSDoc注释
- 编写对应单元测试

### /src/components  
- React组件使用函数式组件
- 合理使用TypeScript泛型
- 实现适当的Props验证
```

### 3.3 文件夹级规则文件

`src/lib/.prompt-rules`:
```yaml
# Library模块专用规则
rules:
  - name: "pure_functions"
    description: "所有工具函数必须是纯函数"
    priority: high
  
  - name: "typescript_generics"
    description: "复杂类型使用泛型提高复用性"
    priority: medium
    
  - name: "error_boundary"
    description: "文件操作必须有错误边界处理"
    priority: high

context:
  - pdf_processing
  - file_operations
  - data_transformation
```

## 4. 管理和维护

### 4.1 版本控制
- 所有prompt配置文件纳入Git版本控制
- 使用语义化版本号管理规则变更
- 重大变更需要团队评审

### 4.2 规则更新流程
1. **提案**: 创建Issue说明规则变更需求
2. **讨论**: 团队成员讨论必要性
3. **实施**: 更新相应配置文件
4. **测试**: 验证新规则效果
5. **文档**: 更新相关文档

### 4.3 自动化检查
建议集成到CI/CD流程：
```yaml
# .github/workflows/prompt-validation.yml
name: Prompt Rules Validation
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Validate Prompt Configs
        run: |
          # 验证JSON格式
          python -m json.tool .trae/config/ai-prompts.json
          # 验证YAML格式
          yamllint src/*/.prompt-rules
```

## 5. 最佳实践建议

### 5.1 规则设计原则
- **明确性**: 规则描述清晰无歧义
- **可测性**: 规则效果可以验证
- **一致性**: 避免规则间冲突
- **渐进性**: 从简单规则开始逐步完善

### 5.2 团队协作
- 定期评审现有规则的有效性
- 收集团队成员对规则的反馈
- 建立规则变更的标准流程
- 维护规则使用指南和示例

### 5.3 效果监控
- 记录规则应用的效果
- 统计AI建议的采纳率
- 定期评估规则对代码质量的影响
- 根据实际效果调整规则

## 6. 工具集成建议

### 6.1 IDE插件
- 开发VS Code插件读取本地prompt规则
- 实现规则语法高亮和验证
- 提供规则模板和自动补全

### 6.2 命令行工具
```bash
# 建议的命令行工具功能
prompt-tools validate          # 验证配置文件
prompt-tools list              # 列出所有规则
prompt-tools context           # 显示当前上下文适用的规则
prompt-tools update            # 更新规则模板
```

通过以上方案，您可以建立一套完整的项目prompt管理体系，支持项目级和文件夹级别的精细化配置，确保AI辅助开发的一致性和有效性。