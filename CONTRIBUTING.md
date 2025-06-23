# 贡献指南（Contributing to eonova.me）

欢迎来到 eonova.me 仓库！很高兴你有兴趣为我们的 Next.js 博客项目做出贡献。你的贡献将帮助我们的项目变得更好、更有用。以下是一些入门指南。

## 目录

- [问题反馈](#issues)
- [拉取请求](#pull-requests)
- [本地搭建](#setup)
- [功能开关（Flags）](#flags)
- [部署](#deployment)
- [规范化提交](#conventional-commits)
- [代码格式化](#code-formatting)

## 问题反馈

如果你遇到任何问题、有建议或想报告 bug，请随时[创建 issue](https://github.com/eonova/eonova.me/issues)。创建 issue 时，请包含清晰、描述性强的标题，并附上相关细节，这将帮助我们更有效地理解和解决问题。

## 拉取请求

我们欢迎通过拉取请求（Pull
Request）进行贡献！如果你正在修复 bug、开发新功能或做出改进，请按照以下步骤操作：

1. Fork 本仓库。
2. 创建一个有描述性的分支。
3. 按照[规范化提交](#conventional-commits)的要求提交你的更改。
4. 将更改推送到你 fork 的仓库。
5. 从你的分支向主仓库的 `main` 分支发起拉取请求。
6. 提交前请运行 `pnpm check`，确保没有问题。

## 本地搭建

本地搭建项目请按以下步骤操作：

1. Fork 本仓库。

2. 克隆仓库：

```bash
git clone <your-forked-repo-url>
cd eonova.me
```

3. 复制 `.env.example` 文件为 `.env.local`：

   大多数功能默认关闭，所以你不需要配置所有环境变量即可运行项目。如果你想使用某个特定功能，可以在
   `.env.local` 文件中设置所需的环境变量，并将[功能开关](#flags)设为 true。

```bash
cp .env.example .env.local
```

4. 填写 Better Auth 密钥：

```properties
# https://www.better-auth.com/docs/installation
BETTER_AUTH_SECRET=""
```

5. 安装依赖：

```bash
pnpm install
```

6. 使用 Docker（或你喜欢的方式）运行 PostgreSQL：

```bash
docker compose up -d
```

7. 运行数据库迁移：

```bash
pnpm db:migrate
```

8. 初始化数据库数据：

```bash
pnpm db:seed
```

9. 以开发模式运行应用：

```bash
pnpm dev # 运行所有服务（资源占用较高）
# 或
pnpm dev:web # 只运行 web 应用
# 或
pnpm dev:docs # 只运行文档应用
```

各服务的访问地址如下：

| 服务               | URL              |
| ------------------ | ---------------- |
| 应用（App）        | `localhost:3000` |
| React Email        | `localhost:3001` |
| 文档（Docs）       | `localhost:3002` |
| ESLint 配置检查    | `localhost:7777` |
| 数据库（Database） | `localhost:5432` |
| Redis              | `localhost:6379` |
| Redis serverless   | `localhost:8079` |

## 功能开关（Flags）

你可以在 `.env.local` 文件中设置以下开关以启用特定功能：

- `NEXT_PUBLIC_FLAG_COMMENT`：博客评论功能
- `NEXT_PUBLIC_FLAG_AUTH`：认证功能
- `NEXT_PUBLIC_FLAG_STATS`：仪表盘页面
- `NEXT_PUBLIC_FLAG_SPOTIFY`：Spotify 集成（正在播放）
- `NEXT_PUBLIC_FLAG_ANALYTICS`：Umami 分析
- `NEXT_PUBLIC_FLAG_GUESTBOOK_NOTIFICATION`：留言板 Discord 通知
- `NEXT_PUBLIC_FLAG_LIKE_BUTTON`：博客点赞按钮

## 规范化提交

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
规范，这有助于我们维护清晰有序的提交历史。你的提交信息应如下格式：

```
<type>(<scope>): <description>
```

例如：

- `feat(web): add new hero section`（新增首页大图）
- `fix(docs): correct header alignment`（修正文档页头部对齐）

## 代码格式化

在提交拉取请求前，请确保你的代码已正确格式化。你可以使用以下命令格式化代码：

- 自动修复 lint 问题：

```bash
pnpm lint:fix
```

- 检查所有内容：

```bash
pnpm check
```

请确保你的更改经过充分测试，并遵循最佳实践。感谢你为 eonova.me 做出的贡献！

---
