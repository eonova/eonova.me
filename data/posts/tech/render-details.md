---
title: 前端渲染技术全解析
date: '2025-05-24T08:34:10.022Z'
modifiedTime: '2025-05-24T08:34:10.026Z'
summary: '深入解析前端渲染模式：SSR、SSG、ISR 与 CSR 的原理、优缺点及适用场景。'
categories: ['tech']
cover: 'https://media.licdn.com/dms/image/v2/D5612AQGIshAZ7H_dlQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1721339586044?e=2147483647&v=beta&t=LZ4_GuqwJxISmTGoYXu7FNv1nIBFC_QRXCjWXmBz-cE'
intro: '深入解析前端渲染模式：SSR、SSG、ISR 与 CSR 的原理、优缺点及适用场景。'
---

## 前言

本篇我们讲解 Next.js 项目所涉及到的
**CSR、SSR、SSG、ISR、RSC、SPA、Streaming、Navigation**
等名词概念，帮助大家正确理解 Next.js。

## SPA

我们先从大家最熟悉的 SPA 开始说起。引用
[MDN 对 SPA 的介绍](https://developer.mozilla.org/zh-CN/docs/Glossary/SPA)：

> SPA（单页应用，Single-page
> application）是只加载一个单独网页的 Web 应用的实现。当需要显示不同的内容时，它通过 JavaScript
> API（例如 XMLHttpRequest 和 Fetch）更新主体内容。
>
> SPA 让用户在访问网站时无需加载新的页面，从而获得性能提升和动态的体验，但也会相应地丧失诸如 SEO（搜索引擎优化）的优势，同时需要更多精力维护状态、实现导航以及做一些有意义的性能监控。

## Navigation

SPA 是怎么实现的呢？这就要说到 Navigation。中文译为“导航”，也就是从一个 URL 跳转到另外一个 URL。

Next.js 官网里的 Navigation 基本都是指客户端导航，也就是 JavaScript 拦截链接跳转，然后 fetch 获取目标路由的地址，并同时更新路由。实现一个简易的客户端导航：

```markdown
let currentPathname = window.location.pathname;

async function navigate(pathname) { currentPathname = pathname;
// 获取导航页面的 HTML const response = await fetch(pathname); const html =
await response.text();

if (pathname === currentPathname) { // 获取其中的 body 标签内容 const res =
/<body(.\*?)>/.exec(html); const bodyStartIndex = res.index + res[0].length
const bodyEndIndex = html.lastIndexOf("</body>"); const bodyHTML =
html.slice(bodyStartIndex, bodyEndIndex); // 简单粗暴的直接替换 HTML
document.body.innerHTML = bodyHTML; } }

window.addEventListener("click", (e) => { // 忽略非 <a> 标签点击事件 if
(e.target.tagName !== "A") { return; } // 忽略 "open in a new tab". if
(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
// 忽略外部链接 const href = e.target.getAttribute("href"); if
(!href.startsWith("/")) { return; }
// 组件浏览器重新加载页面 e.preventDefault();
// 但是 URL 还是要更新 window.history.pushState(null, null, href);
// 调用我们自己的导航逻辑 navigate(href); }, true);

window.addEventListener("popstate", () => {
// 处理浏览器前进后退事件 navigate(window.location.pathname); });
```

在这段代码中，我们监听了所有元素的 click 事件，如果是 `<a>`
标签，就会阻止默认动作（跳转刷新页面），然后使用 fetch 获取目标路由数据，获取后我们简单粗暴的替换了
`<body>`里的内容。由此实现了客户端导航。

这样的实现虽然简单粗暴，却能体现出客户端导航的大致实现思路。

## CSR

CSR，英文全称“Client-side
Rendering”，中文译为“客户端渲染”。顾名思义，渲染工作主要在客户端执行。

像我们传统使用 React 的方式，就是客户端渲染。浏览器会先下载一个非常小的 HTML 文件和所需的 JavaScript 文件。在 JavaScript 中执行发送请求、获取数据、更新 DOM 和渲染页面等操作。

CSR 主要有 2 个问题：

1.  性能问题，因为在客户端渲染，受制于客户端环境比如网速、设备性能，而且在下载、解析、执行 JavaScript以及请求数据没有返回前，页面不会完全呈现。
2.  SEO 问题，不过现在的爬虫已经普遍能够支持 CSR 渲染的页面，只不过支持程度不同

## SSR

SSR，英文全称“Server-side
Rendering”，中文译为“服务端渲染”。顾名思义，渲染工作主要在服务端执行。

比如打开一篇博客文章页面，没有必要每次都让客户端请求，万一客户端网速不好呢，那干脆由服务端直接请求接口、获取数据，然后渲染成静态的 HTML 文件返回给用户。

虽然同样是发送请求，但通常服务端的环境（网络环境、设备性能）要好于客户端，所以最终的渲染速度（首屏加载时间）也会更快。

虽然总体速度是更快的，但因为 CSR 响应时只用返回一个很小的 HTML，SSR 响应还要请求接口，渲染 HTML，所以其响应时间会更长，对应到性能指标 TTFB
(Time To First
Byte)，SSR 更长。所以实际开发的时候，也不能把所有接口都堆到 SSR 中获取，这样反而显得速度慢了。

此外 SSR 可以有效的解决 SEO 的问题。

## SSG

SSG，英文全称“Static Site Generation”，中文翻译“静态站点生成”。

SSG 会在构建阶段，就将页面编译为静态的 HTML 文件。

比如打开一篇博客文章页面，既然所有人看到的内容都是一样的，没有必要在用户请求页面的时候，服务端再请求接口。干脆先获取数据，提前编译成 HTML 文件，等用户访问的时候，直接返回 HTML 文件。这样速度会更快。再配上 CDN 缓存，速度就更快了。

## ISR

ISR，英文全称“Incremental Static Regeneration”，中文翻译“增量静态再生”。

还是打开一篇博客文章页面，博客的主体内容也许是不变的，但像比如点赞、收藏这些数据总是在变化的吧。使用 SSG 编译成 HTML 文件后，这些数据就无法准确获取了，那你可能就退而求其次改为 SSR 或者 CSR 了。

考虑到这种情况，Next.js 提出了 ISR。当用户访问了这个页面，第一次依然是老的 HTML 内容，但是 Next.js 同时静态编译成新的 HTML 文件，当你第二次访问或者其他用户访问的时候，就会变成新的 HTML 内容了。

## Streaming SSR

传统的 SSR，虽然解决了 SEO 等问题，但还有很多问题。

首先，SSR 需要在服务端完全渲染完毕后才能传给客户端。其次，为了保持服务端组件树和客户端组件树一致，所有的组件代码都要打包到客户端 bundle 中。最后，一旦开始水合，整个过程是阻塞的，必须全部完成水合后，用户才能开始操作。

为了缓解这个问题，就出现了 Streaming
SSR，也就是大家常说的流式渲染。Next.js 实现 Streaming 借助的是 HTTP 的分块传输编码机制，数据将以一系列分块的形式进行发送。

> 分块传输编码（Chunked transfer
> encoding）是超文本传输协议（HTTP）中的一种数据传输机制，允许 HTTP由网页服务器发送给客户端应用（ 通常是网页浏览器）的数据可以分成多个部分。分块传输编码只在 HTTP 协议1.1版本（HTTP/1.1）中提供。

简单的来说就是，服务端不断向浏览器传输内容，浏览器边接收边渲染。

React 用的是 Suspense 组件来实现的，Suspense 的巧妙之处就在于它在渲染的时候先用一个占位符替代，等数据获取完毕的时候，在流式传输给 HTML，用脚本替换之前的占位符，从而实现渐进式渲染内容。

这个实现很好，在我看来，解决了 2 个问题：

一个是组件并不一定非要在服务端渲染完毕再传输给客户端组件，可以边渲染边传输，体验更好。第二个是选择性水合，页面分多个部分进行水合，甚至可以根据用户操作提高水合的优先级。

但问题并没有完全解决，客户端该下载的代码并没有少，所有的组件都需要水合，哪怕它只是需要静态渲染并不涉及客户端操作，也要水合一遍，这就浪费了性能。目前的终极解决方案就是 RSC。

## RSC

RSC，英文全称“React Server Component”，中文翻译“服务端组件”。

我们之前讲的 SSR、CSR、SSG、ISR 概念都是页面级别的，页面整体需要是一种渲染类型。但是让我们重新审视一下我们想要渲染的页面。

比如一个博客文章页面，它有纯静态的部分，比如文章内容，也有需要与用户进行交互的部分，比如博客点赞、收藏等功能。

让我们以组件的角度来重新定义这些组件。将纯静态的部分定义为服务端组件。为什么叫服务端组件呢？因为在服务端渲染速度更快又对 SEO 友好，而且渲染出的内容就是 HTML +
CSS，这不正好适合纯静态内容吗？

然后把需要与用户交互的部分定义为客户端组件，因为需要用客户端交互，所以一定要用到浏览器 DOM 事件，这就需要在渲染后，在客户端进行水合（添加事件处理程序的过程）。

两种组件的处理截然不同，所以要做区分。于是约定客户端组件添加一个
`use client`指令表明是客户端组件。

现在一个页面拆分成了多个服务端组件和客户端组件，那么你就很难将这个页面渲染定义为 SSR 或 CSR，所以在 Next.js
13 推出 App
Router 后，官方文档也弱化了 SSR、CSR 这些概念，不再提及这些名词。如果你非要往 SSR 或 CSR 这种概念上套，那你可以简单的理解为，服务端组件 SSR，客户端组件 CSR。

现在代码上已经拆分了组件，可是怎么渲染页面呢？

服务端组件很好处理，就在服务端渲染成 HTML +
CSS，客户端组件也需要先走一遍 SSR，毕竟客户端组件默认也会返回一点内容，所以也走一遍 SSR，但是客户端组件还要留个记号，表明是客户端组件（有人把这个过程称为“挖洞”）。服务端组件依赖的库和代码不需要打包，留在服务端渲染使用就可。客户端组件依赖的代码需要打包发送到客户端，然后在客户端进行主要的水合和渲染工作。

简单来说就是对所有组件都走一遍 SSR，标记出其中的客户端组件，然后输出 HTML +
CSS，同时将客户端组件依赖的代码打包成 JS ，HTML 和 JS 都发送到客户端后，JS 运行，然后对客户端组件进行水合，添加上各种交互事件，由此实现了整个页面的初始渲染工作。

我觉得 RSC 它主要解决了 2 个问题：

第一个是 bundle
size，将组件拆分为客户端组件和服务端组件后，服务端组件在服务端渲染即可，客户端只需要最后的渲染结果，所以服务端组件的依赖项不需要打包到客户端 bundle 中，这就减少了客户端 JS 的大小。

第二个是局部渲染和水合，传统的 SSR 实现中，所有的组件代码都要下载到客户端以进行水合，但是在 RSC 中，因为明确进行了组件区分，所以可以做到只有客户端组件进行水合。

而在后续导航的时候，与传统 CSR 在客户端获取数据进行渲染不同，RSC 将组件的渲染放在了服务端，如果直接获取目标路由的 HTML 替换当前的 HTML，将会破坏当前的页面状态，所以采取了一种自定义的格式成为 RSC
Payload，它包含服务端组件的渲染结果、客户端组件的占位位置和引用文件、从服务端组件传给客户端组件的数据等信息，然后根据 RSC
Payload，客户端可以进行局部渲染和更新，由此实现了状态的保持。

## 总结

RSC 与 SSR、Streaming 这些技术其实并不冲突，在 Next.js 中其实是结合这些技术的一个综合实现。比如所有组件，无论客户端组件还是服务端组件都会在服务端进行渲染，Streaming 流式传输 HTML。后续导航的时候，RSC
Payload 也针对流进行了优化，同样实现了 Streaming。RSC 和 SSR 相辅相成，共同提升了应用的性能。
