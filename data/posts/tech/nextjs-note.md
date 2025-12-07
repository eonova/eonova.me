---
title: Nextjs 学习笔记
date: '2025-05-21T08:34:10.022Z'
modifiedTime: '2025-05-21T08:34:10.026Z'
intro: 'Next.js 概念介绍：文件系统路由、核心渲染策略概览、项目结构和约定。'
categories: ['tech']
tags: ['nextjs']
cover: 'https://www.0xkishan.com/_next/image?url=%2Fblogs%2Fnextjs%2Fhero.png&w=3840&q=75'
---

## 核心概念

### 文件系统路由

Next.js 使用基于文件系统的路由，这意味着：

- `pages` 目录下的文件会自动成为路由
- 支持动态路由（如 `[id].js` 或 `[...slug].js`）
- 支持嵌套路由（通过目录结构）

在 Next.js 13+ 的 App Router 中，路由定义在 `app` 目录中，通过文件夹结构和
`page.tsx` 文件来定义路由。

- `app/page.tsx` -> `/` (根路由)
- `app/dashboard/page.tsx` -> `/dashboard`
- `app/products/[id]/page.tsx` -> `/products/:id` (动态路由)
- `app/blog/[...slug]/page.tsx` -> `/blog/:slug*` (Catch-all 路由)

### 渲染策略概览

Next.js 提供了灵活的页面渲染方式，您可以根据内容特性和性能需求选择最合适的策略。这些策略决定了页面的 HTML 是何时以及在哪里生成的。

- **静态生成 (Static Generation -
  SSG)**：在构建项目时生成页面的 HTML。适用于内容不经常变化且对加载速度要求极高的页面（如博客、营销页面）。构建完成后，生成的静态文件可以直接通过 CDN 分发，提供极快的访问速度。

- **服务端渲染 (Server-Side Rendering -
  SSR)**：在用户请求页面时，服务器实时生成页面的 HTML 并发送给浏览器。适用于需要展示实时数据或个性化内容的页面（如用户仪表盘、电商购物车）。虽然每次请求都需要服务器处理，但首个字节加载时间（TTFB）通常优于客户端渲染。

- **增量静态再生成 (Incremental Static Regeneration -
  ISR)**：SSG 的一个增强模式。允许您在应用构建后，在流量到来时按需或定时地重新生成部分静态页面。这结合了 SSG 的高性能和 SSR 的数据新鲜度，无需完全重建整个网站。

- **客户端渲染 (Client-Side Rendering -
  CSR)**：页面初始加载时只发送一个最小化的 HTML 骨架和 JavaScript 文件到浏览器，数据获取和页面内容的渲染主要在浏览器端通过 JavaScript 执行。适用于用户登录后的私有页面或高度动态的应用部分，但可能会影响首屏加载性能和 SEO。

**总结**：理解这些渲染策略是优化 Next.js 应用性能的关键。您可以根据不同页面的需求，在同一个应用中混合使用这些策略。

## 项目结构和约定

良好的项目结构有助于团队协作和长期维护。Next.js 项目通常遵循一套标准的目录结构和文件命名约定。

以下是一些常见的目录和文件及其推荐用途（涵盖 Pages Router 和 App Router）：

- **`app/` (App Router)**：

  - **用途**：Next.js
    13+ 引入的新的路由和渲染模型。在该目录下通过文件夹结构定义路由，并使用
    `page.tsx` 或 `route.ts`
    文件创建页面或 API 路由。支持布局 (`layout.tsx`)、加载状态 (`loading.tsx`)、错误处理 (`error.tsx`) 等文件约定。
  - **示例**：
    - `app/page.tsx`: 网站首页。
    - `app/dashboard/layout.tsx`: 仪表盘页面的布局。
    - `app/products/[id]/page.tsx`: 单个产品详情页。
    - `app/api/users/route.ts`: 用户 API 端点。

- **`pages/` (Pages Router)**：

  - **用途**：Next.js 传统的基于文件系统的路由目录。该目录下导出一个 React 组件的
    `.js`, `.jsx`, `.ts`, 或 `.tsx` 文件都会自动成为应用的一个页面路由。
  - **示例**：
    - `pages/index.js`: 网站首页。
    - `pages/about.tsx`: 关于页面。
    - `pages/posts/[slug].js`: 动态博客文章页面。
  - **特殊文件**：
    - `pages/_app.js` /
      `_app.tsx`: 用于初始化所有页面，可以用来添加全局 CSS、Provider 等。
    - `pages/_document.js` /
      `_document.tsx`: 用于定制应用的 HTML 骨架 (`<html>`, `<body>` 等)。
    - `pages/404.tsx`: 自定义 404 错误页面。
    - `pages/500.tsx`: 自定义 500 错误页面。
    - `pages/api/`: 该目录下的文件被视为 API 路由，用于构建后端 API 端点。

- **`public/`**：

  - **用途**：存放静态资源，如图片 (`.jpg`,
    `.png`)、字体、`favicon.ico`、`manifest.json`。这些文件在构建后会被直接提供服务，可以通过根路径访问（例如
    `/favicon.ico`）。

- **`components/`**：

  - **用途**：存放可重用的 React 组件。建议根据功能或业务逻辑组织子目录。
  - **示例**：`components/Layout/`, `components/Button/`, `components/forms/`。

- **`lib/` 或 `utils/`**：

  - **用途**：存放通用工具函数、数据获取逻辑（不直接与页面或 API 路由耦合）、常量、类型定义等与 UI 或路由无关的辅助代码。
  - **示例**：`lib/api.ts` (数据获取函数), `utils/formatters.ts` (格式化函数)。

- **`styles/`**：

  - **用途**：存放应用全局样式文件 (`globals.css`) 或使用 CSS
    Modules 的组件样式文件。如果使用 Tailwind
    CSS，通常也会在这里导入 Tailwind 指令。

- **`hooks/`**：

  - **用途**：存放自定义 React Hooks，用于封装组件逻辑。

- **`types/`**：

  - **用途**：存放 TypeScript 的全局类型定义。

- **`next.config.js` / `next.config.mjs`**：

  - **用途**：Next.js 的核心配置文件，用于进行各种自定义设置，如环境变量、重写、重定向、图片优化配置、Webpack 配置等。

- **`package.json`**：
  - **用途**：项目的包管理文件，记录项目依赖、脚本命令、项目信息等。

遵循这些约定可以提高代码的可读性和可维护性，尤其是在团队协作时。

## 主要特性

### 数据获取

Next.js 提供了灵活的数据获取方式，支持在不同渲染策略下预取或请求数据。

- **`getStaticProps`
  (静态生成 SSG)**：在构建时运行，用于预取页面所需的静态数据。结合
  `getStaticPaths` 用于动态路由的静态生成。

```typescript
// pages/posts/[id].tsx

import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts'; // 假设这些函数已适配 TypeScript
import { GetStaticProps, GetStaticPaths } from 'next';

// 定义页面 props 的类型
type PostProps = {
  postData: { // 假设 postData 的结构
    id: string;
    title: string;
    date: string;
    contentHtml: string;
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  // params 也会有类型提示
  const postData = await getPostData(params?.id as string); // 确保 id 是 string 类型

  // 如果找不到数据，返回 notFound
  if (!postData) {
    return { notFound: true };
  }

  return {
    props: {
      postData,
    },
    // 可选：配置 ISR，每隔 60 秒重新验证
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds(); // 获取所有动态路由的可能路径
  return {
    paths, // paths 格式应为 [{ params: { id: '...' } }, ...]
    fallback: false, // fallback: false 表示 getStaticPaths 未返回的路径会渲染 404
    // fallback: 'blocking' 或 true 可用于处理未预渲染的路径
  };
};

export default function Post({ postData }: PostProps) {
  return (
    <Layout>
      <h1>{postData.title}</h1>
      <div>{postData.date}</div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  );
}
```

- **`getServerSideProps`
  (服务端渲染 SSR)**：在每次请求页面时在服务器端运行，用于获取需要实时更新的数据。

```typescript
// pages/dashboard.tsx

import { GetServerSideProps } from 'next';

// 定义页面 props 的类型
type DashboardProps = {
  data?: { value: string }; // 假设数据的结构
  error?: string;
};

export const getServerSideProps: GetServerSideProps<DashboardProps> = async (context) => {
  try {
    const res = await fetch(`https://api.example.com/realtime-data`); // 示例 API 地址

    if (!res.ok) {
      // 处理 HTTP 错误
      return { props: { error: `获取数据失败: ${res.status}` } };
    }

    const data = await res.json();

    if (!data) {
      return { notFound: true }; // 如果 API 返回空数据，返回 404
    }

    return {
      props: { data }, // 将数据作为 props 传递给页面组件
    };
  } catch (error: any) {
    console.error('getServerSideProps 出错:', error);
    return { props: { error: error.message || '服务器内部错误' } }; // 捕获其他错误
  }
};

function Dashboard({ data, error }: DashboardProps) {
  if (error) {
    return (
      <div>
        <h1>加载数据出错</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
     // This case should ideally be handled by notFound in getServerSideProps
     // but added as a fallback for robustness.
    return <div>加载中或无数据...</div>;
  }

  return (
    <div>
      <h1>用户仪表盘</h1>
      <p>加载的数据: {data.value}</p>
    </div>
  );
}

export default Dashboard;
```

- **客户端渲染 (CSR)**：在组件内部使用 `useEffect` 或数据请求库 (如 SWR, React
  Query) 在浏览器端获取数据。适用于需要用户交互后才加载数据或对 SEO 不敏感的页面部分。

```typescript
// components/ClientDataFetcher.tsx

import { useState, useEffect } from 'react';

type UserData = { name: string; email: string }; // 定义数据类型

function ClientDataFetcher() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/current-user'); // 示例 API 路由

        if (!res.ok) {
           throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data: UserData = await res.json();
        setUserData(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <p>加载数据中...</p>;
  if (error) return <p>加载数据出错: {error}</p>;
  if (!userData) return <p>无用户数据。</p>;

  return (
    <div>
      <h2>用户数据 (CSR)</h2>
      <p>姓名: {userData.name}</p>
      <p>邮箱: {userData.email}</p>
    </div>
  );
}

export default ClientDataFetcher;
```

\*App Router 中的数据获取方式 (如 `fetch` API 的扩展, React Server
Components) 请参考第一篇的渲染策略概览和相关文档。

### 图片优化

使用 `next/image`
组件是 Next.js 中优化图片资源的推荐方式。它提供了自动优化、懒加载和响应式图片等功能，显著提升页面加载性能。

- **自动优化**：Next.js 会根据用户设备和浏览器自动调整图片大小、格式（如转换为 WebP），并延迟加载屏幕外的图片。
- **响应式**：可以轻松处理不同屏幕尺寸下的图片。

```typescript
// components/OptimizedImage.tsx

import Image from 'next/image';
import profilePic from '../public/profile.jpg'; // 导入本地图片

function OptimizedImage() {
  return (
    <div>
      <h2>图片优化示例</h2>
      {/* 使用本地导入的图片 */}
      <Image
        src={profilePic}
        alt="本地图片示例"
        width={500} // 原始图片的宽度
        height={500} // 原始图片的高度
        placeholder="blur" // 加载时显示模糊效果 (对于本地图片自动支持)
      />

      {/* 使用远程图片 */}
      <Image
        src="https://via.placeholder.com/600/92c952" // 远程图片地址
        alt="远程图片示例"
        width={600}
        height={400}
        // 注意：使用远程图片需要在 next.config.js 中配置 allowed domains
      />
    </div>
  );
}

export default OptimizedImage;
```

**配置远程图片 (`next.config.js`)**：

如果您使用远程图片，必须在 `next.config.js`
中配置允许的图片源域名，以保障安全性。

```javascript
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com', 'your-image-domain.com'], // 添加您的图片域名
  },
}

module.exports = nextConfig
```

### API 路由

API 路由允许您在 Next.js 项目内部创建无服务器的 API 端点。这些端点运行在服务器端，可以用于处理表单提交、数据库交互、调用第三方服务等。

- **创建**：在 `pages/api` 目录下创建文件 (例如
  `pages/api/hello.ts`)。导出一个 default 函数，该函数接收 `req`
  (NextApiRequest) 和 `res` (NextApiResponse) 对象。

```typescript
// pages/api/hello.ts

import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  text: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // 处理不同的 HTTP 方法
  if (req.method === 'GET') {
    res.status(200).json({ text: 'Hello from API Route' })
  } else if (req.method === 'POST') {
    const { name } = req.body // 假设 POST 请求体中有 name 字段
    res.status(200).json({ text: `Hello, ${name}!` })
  } else {
    // 处理不允许的 HTTP 方法
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
```

- **在客户端调用**：您可以使用标准的 `fetch`
  API 或 axios 等库从前端页面调用 API 路由。

```typescript
// pages/index.tsx (客户端调用示例)

import { useState } from 'react';

function HomePage() {
  const [message, setMessage] = useState('');

  const fetchHello = async () => {
    const res = await fetch('/api/hello');
    const data = await res.json();
    setMessage(data.text);
  };

  const postHello = async () => {
    const res = await fetch('/api/hello', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Next.js User' }),
    });
    const data = await res.json();
    setMessage(data.text);
  };

  return (
    <div>
      <h1>API 路由示例</h1>
      <button onClick={fetchHello}>Fetch GET /api/hello</button>
      <button onClick={postHello}>Fetch POST /api/hello</button>
      <p>消息: {message}</p>
    </div>
  );
}

export default HomePage;
```

\*App Router 中的 API 路由通过创建 `route.ts`
文件实现，请参考 Next.js 官方文档了解更多详情。

## 最佳实践

### 性能优化

- **代码分割 (`next/dynamic`)**：Next.js 默认会自动对 `pages` 或 `app`
  目录下的代码进行分割。对于非关键或在特定条件下才渲染的组件，可以使用
  `next/dynamic`
  进行动态导入，实现更细粒度的代码分割，减少初始加载的 JavaScript 体积。

```typescript
// components/HeavyComponent.tsx (一个假设的加载较慢的组件)

import { useEffect } from 'react';

function HeavyComponent() {
  useEffect(() => {
    console.log('HeavyComponent 已加载');
  }, []);
  return <div>我是一个动态加载的组件</div>;
}

export default HeavyComponent;
```

```typescript
// pages/some-page.tsx (使用 next/dynamic)

import dynamic from 'next/dynamic';

// 动态导入组件，可以在加载时显示 Loading 状态
const DynamicHeavyComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <p>加载 HeavyComponent...</p>,
});

function SomePage() {
  return (
    <div>
      <h1>动态导入示例</h1>
      <DynamicHeavyComponent />
    </div>
  );
}

export default SomePage;
```

- **客户端导航 (`next/link`)**：使用 `next/link`
  组件进行页面跳转可以实现客户端路由，避免页面完全刷新，提升用户体验和导航速度。Next.js 会在链接进入视口时自动预加载链接的资源。

```typescript
// components/NavLink.tsx

import Link from 'next/link';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    // 使用 <Link> 组件进行内部导航
    <Link href={href}>
      {/* 在 Next.js 13+ 中，<a> 标签不再需要包裹在 <Link> 内 */}
      {children}
    </Link>
  );
}

export default NavLink;
```

```typescript
// pages/index.tsx (使用 NavLink)

import NavLink from '../components/NavLink';

function HomePage() {
  return (
    <div>
      <h1>首页</h1>
      <p>欢迎来到 Next.js 学习笔记。</p>
      <NavLink href="/about">关于我们</NavLink> {/* 使用 NavLink 进行页面跳转 */}
    </div>
  );
}

export default HomePage;
```

- **图片优化**：如前所述，使用 `next/image` 是必不可少的性能优化手段。
- **合理使用渲染策略**：根据页面内容选择 SSG, SSR,
  ISR 或 CSR，最大限度地提升性能。
