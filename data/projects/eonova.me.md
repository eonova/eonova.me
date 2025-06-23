---
name: 'eonova.me'
description: '基于现代化技术栈构建的高性能个人博客'
homepage: 'https://eonova.me/'
github: 'https://github.com/eonova/eonova.me'
date: '2025-02-01T03:13:39.164Z'
techstack:
  [
    'Next.js',
    'TailwindCSS',
    'Drizzle-ORM',
    'Trpc',
    'Shiki',
    'Content-Collections',
    'Better-Auth',
    'TypeScript',
  ]
selected: true
---

# eonova.me

## 🎉 项目介绍

> "纪元（Eon）" + "Nova"（超新星），狮子座的宇宙级爆发

基于现代化技术栈构

[预览](https://eonova.me)

## 🌌 核心特性

- Comments system
- Like functionality
- Post view counter
- Blog post search
- RSS feed
- Sitemap
- PWA

## 🚀 快速部署

### Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=[https%3A%2F%2Fgithub.com%2Fhamster1963%2Fnextme&env=SITE_URL,SITE_AUTHOR](https://github.com/eonova/eonova.me)>)

## 🖥️ 本地启动

本地运行准备

```bash
# 安装全部依赖
pnpm i

# 启动开发服务器（带3000进程并行）
pnpm dev --p 3000

# 构建生产版本
pnpm build

# 数据库初始化
pnpm db:migrate
pnpm db:seed
```

关键脚本说明

```bash
# 代码质量检查
pnpm lint # ESLint + Prettier

# 数据库操作
pnpm db:studio # 图形化数据库管理

# 分析构建包
pnpm bundle-analyzer
```
