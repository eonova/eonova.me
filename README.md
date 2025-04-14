<h1 align="center"> Eonova 💠</h1>

> "纪元（Eon）" + "Nova"（超新星），狮子座的宇宙级爆发

## 🎉 项目介绍

基于现代化技术栈构建的高性能个人博客，集成技术文章展示、开源项目管理等能力

## 🌌 核心特性

- Comments system
- Like functionality
- Post view counter
- Blog post search
- RSS feed
- Sitemap
- PWA

## ✨ 技术栈

```mermaid
graph TD
    A[前端框架] --> B["Next.js 15"]
    A --> C["Tailwind CSS 4"]
    A --> D["TypeScript 5.7"]
    D --> E["React 19"]
    D --> F["Vue 3 (可选)"]
    
    G[后端服务] --> H["Drizzle Kit"]
    G --> I["Trpc Server"]
    H --> J["PostgreSQL 8"]
    I --> K["Redis 1.34"]
    
    L[构建工具链] --> M["bun 10"]
    L --> N["Webpack 5"]
    M --> O["ESLint 9"]
    M --> P["TypeScript 编译器"]
    
    classDef framework fill:#2196F3,stroke:#1976D2;
    classDef service fill:#FFC107,stroke:#FFA07A;
    classDef build fill:#9C27B0,stroke:#7B1FA2;
    
    class A,F,D,E,L,N,M,O,P service;
    class B,C,G,H,I,J,K build;
```

## 🚀 快速部署

### Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=[https%3A%2F%2Fgithub.com%2Fhamster1963%2Fnextme&env=SITE_URL,SITE_AUTHOR](https://github.com/eonova/eonova.me))

### Docker Compose 部署

```yml
# docker-compose.yml
version: '3'
services:
  web:
    build: .
    command: bun dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

## 🖥️ 本地启动

本地运行准备

```bash
# 安装全部依赖
bun i

# 启动开发服务器（带3000进程并行）
bun dev --p 3000

# 构建生产版本
bun build

# 数据库初始化
bun db:migrate
bun db:seed
```

关键脚本说明

```bash
# 代码质量检查
bun lint # ESLint + Prettier

# 数据库操作
bun db:studio # 图形化数据库管理

# 分析构建包
bun bundle-analyzer
```

## ☕️ 请我喝咖啡

![赞赏码](https://img.leostar.top/blog/20250219233034194.jpg)
