#!/bin/bash

# PDF合并排版工具 - Vercel部署脚本

echo "🚀 开始部署PDF合并排版工具到Vercel..."

# 检查Git状态
echo "📋 检查Git状态..."
git status

# 添加更改
echo "📁 添加文件更改..."
git add .

# 提交更改（如果有）
if git diff --staged --quiet; then
    echo "✅ 没有新的更改需要提交"
else
    echo "💾 提交更改..."
    git commit -m "$(date '+%Y-%m-%d %H:%M:%S') 更新"
fi

# 推送到GitHub
echo "📤 推送到GitHub..."
git push origin master

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

# 使用Vercel CLI部署
echo "🌐 部署到Vercel..."
npx vercel --prod

echo "🎉 部署完成！"
echo "📋 请检查Vercel提供的部署URL"
echo "🔗 通常格式为: https://pdf-merge-tool-xxx.vercel.app"