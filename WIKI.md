# eonova.me Code Wiki

本 Wiki 文档旨在帮助开发者快速理解 eonova.me 项目的架构、模块设计、核心功能以及如何进行开发。

## 1. 项目概览 (Project Overview)

**eonova.me** 是一个现代化的个人网站与作品集项目，采用全栈 TypeScript 开发，具有高性能、强类型、响应式设计等特点。项目内嵌了博客、随笔、项目展示、留言板、后台管理以及丰富的第三方集成。

### 核心技术栈
- **核心框架**: Next.js 15+ (App Router) + React 19
- **语言**: TypeScript 5.7+ (Strict Mode)
- **样式与动画**: Tailwind CSS 4, Framer Motion, GSAP, Radix UI
- **后端与 API**: oRPC (强类型 RPC 框架), Better Auth (身份认证)
- **数据库与缓存**: PostgreSQL, Drizzle ORM, Upstash Redis
- **内容管理**: Content Collections (MDX 解析与管理)
- **工程化**: pnpm (Catalogs 依赖管理), Vitest (单元测试), Playwright (E2E 测试), ESLint (基于 Antfu 配置)

---

## 2. 目录结构与架构设计

项目采用了清晰的分层与扁平化设计结构：

```text
eonova.me/
├── data/               # 内容数据源 (MDX, JSON)
│   ├── notes/          # 随笔内容
│   ├── posts/          # 博客文章
│   ├── projects/       # 项目展示数据
│   └── pages/          # 静态页面协议等
├── src/                # 应用程序源代码
│   ├── app/            # Next.js App Router 路由体系
│   │   ├── (page)/     # 前端页面路由组 (包含主页、归档、友链、留言板等)
│   │   │   ├── (account)/ # 用户中心与设置
│   │   │   └── (admin)/   # 管理员后台面板 (Dashboard)
│   │   ├── api/        # 原生 API 路由 (如 Webhook、图片代理)
│   │   ├── og/         # Open Graph 动态图片生成
│   │   └── rpc/        # oRPC API 入口
│   ├── components/     # React 组件层 (高度模块化)
│   │   ├── base/       # 基础原子组件 (Button, Input 等，基于 cva 封装)
│   │   ├── layouts/    # 全局布局组件 (Header, Footer, Sidebar)
│   │   ├── modules/    # 业务模块组件 (评论区、邮件模板、播放器等)
│   │   ├── pages/      # 页面级专属组件 (拆分复杂页面的逻辑)
│   │   └── shared/     # 跨页面复用的公共组件
│   ├── db/             # 数据库层
│   │   └── schemas/    # Drizzle ORM 数据表结构定义
│   ├── hooks/          # 自定义 React Hooks & React Query Hooks
│   ├── lib/            # 核心库与第三方集成封装 (如 Redis, S3)
│   ├── orpc/           # 强类型 API 路由定义 (Routers)
│   └── utils/          # 工具函数集合
└── content.config.ts   # Content Collections 配置，处理 MDX
```

---

## 3. 主要模块职责 (Main Modules)

### 3.1 内容渲染模块 (Content & MDX)
- **职责**: 将 Markdown/MDX 文件转换为具有丰富交互的页面。
- **核心文件**:
  - `content.config.ts`: 定义了 `posts`, `notes`, `projects` 的数据 Schema 和解析流程，自动提取 frontmatter 并生成目录 (TOC) 与 slug。
  - `src/components/modules/mdx/`: 提供了一套用于渲染 MDX 的自定义 React 组件（如自定义的代码高亮、提示框、链接卡片等）。

### 3.2 强类型 API 模块 (oRPC)
- **职责**: 提供前后端类型安全的 API 通信，取代传统的 RESTful API 拼接。
- **架构**:
  - 定义在 `src/orpc/routers/` 目录下，按业务领域划分为多个子路由（如 `auth.router.ts`, `comment.router.ts`, `post.router.ts`）。
  - 在前端通过 `@orpc/tanstack-query` 结合 React Query 实现状态同步和数据获取。

### 3.3 交互与用户系统 (Auth & Comments)
- **职责**: 处理用户登录注册、权限校验、评论、点赞与留言板交互。
- **实现细节**:
  - **Auth**: 基于 `Better Auth`，支持 OAuth 登录（如 GitHub）。数据模型定义在 `src/db/schemas/auth.ts`。
  - **评论区**: 高度封装的 `src/components/modules/comment-section`，支持嵌套回复、Markdown 语法、表情包（Emoji Mart）。

### 3.4 后台管理面板 (Admin Dashboard)
- **职责**: 供网站拥有者管理内容和系统状态。
- **路由**: 位于 `src/app/(page)/(admin)`。
- **功能**: 包括数据统计 (Dashboard)、相册管理 (Album)、评论审核 (Comments)、友链管理 (Friends)、用户管理 (Users)。

### 3.5 邮件与通知系统 (Email System)
- **职责**: 触发事务性邮件（如评论通知、回复提醒）。
- **技术**: 使用 `Resend` 配合 `React Email` 构建。
- **模板位置**: `src/components/modules/email/templates/`。

---

## 4. 关键文件与函数说明

### `content.config.ts` 中的 `transform` 函数
该函数是内容解析的核心中间件，它会在编译 MDX 前进行预处理：
1. 计算路径并生成安全的路由别名 (`slug`)。
2. 处理中文标题的哈希映射以防 URL 乱码。
3. 调用 `compileMDX` 并注入 Remark/Rehype 插件（处理代码高亮和数学公式）。

### oRPC Procedure 声明
oRPC 使用建造者模式定义路由，支持鉴权拦截器：
```typescript
// 示例模式
export const createComment = protectedProcedure
  .input(commentSchema)
  .output(commentResponseSchema)
  .handler(async ({ input, context }) => {
    // 处理插入逻辑，受保护的路由自动校验 context.user
  })
```

### UI 变体管理器 (cva)
基础组件（如 `src/components/base/button.tsx`）全面使用 `class-variance-authority` (cva) 管理样式：
- 通过定义 `variants` 和 `defaultVariants`，允许父组件通过传入类型安全属性（如 `variant="outline"`, `size="sm"`）轻松组合 Tailwind 类。

---

## 5. 依赖关系与外部服务

| 服务/平台 | 用途描述 | 关联包 / 模块 |
| :--- | :--- | :--- |
| **PostgreSQL** | 核心关系型数据库 | `drizzle-orm`, `postgres` |
| **Upstash Redis** | 缓存、请求限流 (Rate Limiting) | `@upstash/redis`, `@upstash/ratelimit` |
| **Resend** | 触发式邮件发送 | `resend`, `@react-email/components` |
| **S3 兼容存储** | 图片与附件存储 (支持 R2/Upyun/AWS) | `@aws-sdk/client-s3` |
| **Better Auth** | 用户认证系统 | `better-auth` |
| **PostHog** | 用户行为分析与页面统计 | `posthog-js`, `posthog-node` |
| **第三方 API** | 获取外部数据 | `Spotify API`, `WakaTime`, `GitHub API`, `NeoDB` |

---

## 6. 项目运行方式 (Getting Started)

### 环境准备
确保已安装 **Node.js >= 22** 和 **pnpm**。

### 1. 安装依赖
```bash
pnpm install
```

### 2. 配置环境变量
复制根目录下的 `.env.example` 到 `.env.local` 并填充相关服务密钥：
- `DATABASE_URL` (PostgreSQL 连接串)
- `BETTER_AUTH_SECRET` 及 OAuth 凭证 (GitHub)
- `UPSTASH_REDIS_REST_URL` & `TOKEN`
- S3 存储桶相关配置

### 3. 数据库初始化
同步 Schema 并插入基础数据：
```bash
pnpm db:generate   # 生成迁移文件
pnpm db:migrate    # 执行迁移应用到数据库
pnpm db:seed       # (可选) 写入初始种子数据
```

### 4. 启动开发服务器
```bash
pnpm dev
```
网站将在 `http://localhost:3000` 运行。

### 5. 其他常用命令
- `pnpm db:studio`: 打开 Drizzle Studio 可视化管理数据库。
- `pnpm build`: 执行生产环境构建。
- `pnpm lint`: 运行代码检查 (ESLint)。
- `pnpm test:unit`: 运行 Vitest 单元测试。
- `pnpm test:e2e`: 运行 Playwright 端到端测试。
