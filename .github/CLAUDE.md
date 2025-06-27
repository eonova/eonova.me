# AI 助手指南 - eonova.me

本文档为 AI 助手提供了全面的指导,帮助理解 eonova.me 代码库的项目结构、约定和要求。

## 项目概述

eonova.me 是一个基于 Next.js 的个人博客项目,使用 TypeScript、React 和现代 Web 开发最佳实践构建。

## 项目结构

```
eonova-me/
├── src/                    # 源代码目录
│   ├── app/               # Next.js App Router 页面和布局
│   ├── components/        # React 组件
│   ├── lib/              # 核心工具和配置
│   ├── hooks/            # 自定义 React hooks
│   ├── store/            # 状态管理 (Zustand)
│   ├── styles/           # 全局样式
│   └── types/            # TypeScript 类型定义
├── public/                # 静态资源
├── content/               # 内容目录
│   ├── posts/            # 博客文章 (MDX)
│   └── projects/         # 项目展示
└── prisma/               # 数据库模型和迁移
```

## 技术栈

### 核心技术

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: PostgreSQL + Prisma
- **认证**: NextAuth.js
- **内容**: MDX + Contentlayer
- **测试**: Vitest
- **包管理**: pnpm

## 编码规范

### TypeScript 指南

- 使用箭头函数
- 常量使用 const 断言
- 避免在参数签名中直接解构 props
- 避免使用 interface 定义类型
- 避免使用 any 类型

### 文件命名规范

- **文件**: kebab-case (例如: `use-debounce.ts`, `blog-post.tsx`)
- **常量**: UPPER_SNAKE_CASE (例如: `API_ENDPOINTS`)

### 组件结构

```typescript
// 1. 类型定义
type ComponentProps = {
  // ...
}

// 2. 组件定义
const Component = (props: ComponentProps) => {
  const { className, ...rest } = props

  // 3. Hooks
  const [state, setState] = useState()

  // 4. 事件处理
  const handleClick = () => {
    // ...
  }

  // 5. 渲染
  return (
    <div className={className} {...rest}>
      {/* 内容 */}
    </div>
  )
}

// 6. 导出
export default Component
```

### 样式约定

- 使用 Tailwind CSS 工具类
- 使用 `cn()` 辅助函数处理条件类名
- 在 flex 容器中优先使用 `gap-*` 而不是 `space-*`
- 避免内联样式
- 遵循移动优先的响应式设计

```tsx
// ✅ 推荐
<div className={cn('flex items-center gap-4', isActive && 'bg-accent')}>

// ❌ 避免
<div style={{ display: 'flex', gap: '1rem' }}>
```

## 测试要求

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit
```

### 测试文件约定

- 单元测试: `*.test.ts` 或 `*.test.tsx`
- 测试工具: 位于 `src/tests/` 目录

### 编写测试

```typescript
// 单元测试示例
import { describe, it, expect } from 'vitest'

describe('ComponentName', () => {
  it('应该正确渲染', () => {
    // 测试实现
  })
})
```

## 数据库操作

### 模式修改

修改数据库模式时:

1. 编辑 `prisma/schema.prisma`
2. 生成迁移: `pnpm prisma migrate dev`
3. 更新类型: `pnpm prisma generate`

### 数据库命令

```bash
# 生成迁移
pnpm prisma migrate dev

# 应用迁移
pnpm prisma migrate deploy

# 打开 Prisma Studio
pnpm prisma studio
```

## 环境变量

### 设置

1. 复制 `.env.example` 到 `.env.local`
2. 填写必要的变量
3. 使用 `env` 工具进行类型安全的访问

### 功能开关

在 `.env.local` 中设置以下功能开关:

- `NEXT_PUBLIC_ENABLE_COMMENTS`: 启用评论
- `NEXT_PUBLIC_ENABLE_ANALYTICS`: 启用统计
- `NEXT_PUBLIC_ENABLE_SPOTIFY`: 启用 Spotify 集成

## Pull Request 指南

### PR 标题格式

遵循约定式提交:

```
feat(scope): 添加新功能
fix(scope): 修复问题
docs(scope): 更新文档
style(scope): 格式修改
refactor(scope): 代码改进
test(scope): 添加测试
chore(scope): 维护任务
```

### PR 检查清单

提交前:

1. ✅ 运行 `pnpm check`
2. ✅ 运行 `pnpm test`
3. ✅ 必要时更新文档
4. ✅ 为新功能添加测试
5. ✅ 确保无控制台错误
6. ✅ 测试移动端视图
7. ✅ 检查可访问性

## 开发命令

### 基本命令

```bash
# 安装依赖
pnpm install

# 开发
pnpm dev

# 构建
pnpm build

# 代码质量检查
pnpm lint
pnpm format
pnpm type-check
pnpm check

# 数据库
pnpm prisma studio

# 测试
pnpm test
```

## 常见模式

### 数据获取

```typescript
// 服务器组件
const ServerComponent = async () => {
  const data = await prisma.post.findMany()
  return <div>{/* 渲染数据 */}</div>
}

// 客户端组件
const ClientComponent = () => {
  const { data } = useSWR('/api/posts')
  return <div>{/* 渲染数据 */}</div>
}
```

### 错误处理

```typescript
// 使用错误边界处理 UI 错误
// 适当记录错误日志
```

### 性能优化

- 使用 Next.js Image 组件
- 实现适当的加载状态
- 使用 React.Suspense 进行代码分割
- 优化包大小

## 可访问性要求

- 所有交互元素必须支持键盘访问
- 使用语义化 HTML 元素
- 提供适当的 ARIA 标签
- 确保足够的颜色对比度
- 测试屏幕阅读器支持

## 安全考虑

- 验证所有用户输入
- 渲染前净化数据
- 实现 API 限流
- 不在客户端暴露敏感数据

## 部署

项目使用自动部署:

- main 分支部署到生产环境
- Pull Request 创建预览部署
- 环境变量在部署平台管理

## 获取帮助

- 创建新 issue 前检查现有 issue
- 提供问题复现步骤
- 包含相关错误信息和日志
- 引用具体文件和行号
