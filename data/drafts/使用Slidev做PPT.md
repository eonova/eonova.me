---
title: 使用Slidev做PPT
id: b84a71f6-841f-4428-b956-7b966f4ddb17
date: 2023-11-21 13:47:10
auther: eonova
cover:
excerpt: 概念 官网：Slidev官网 Slidev (slide + dev, /slʌɪdɪv/) 是基于 Web 的幻灯片制作和演示工具。它旨在让开发者专注在 Markdown 中编写内容，同时拥有支持 HTML 和 Vue 组件的能力，并且能够呈现像素级完美的布局，还在你的演讲稿中内置了互动的演示样例
permalink: /archives/B8yii4rj
categories:
 - jsji-jin
 - hua-li-hu-shao
tags:
 - slidev
 - ppt
---

## 概念

![image.png](https://img.leostar.top/study/20231121133030.png)

官网：[Slidev官网](https://cn.sli.dev/)

>Slidev (slide + dev, `/slʌɪdɪv/`) 是基于 Web 的幻灯片制作和演示工具。它旨在让开发者专注在 Markdown 中编写内容，同时拥有支持 HTML 和 Vue 组件的能力，并且能够呈现像素级完美的布局，还在你的演讲稿中内置了互动的演示样例。
>它使用了功能丰富的 markdown 文件来生成精美的幻灯片，具有即时重载的体验。它还拥有很多内置的集成功能，如实时编码、导出 PDF、演讲录制等。由于 Slidev 是由 web 驱动的，因此你可以使用它进行任何操作 —— 具有无限的可能性。

## 使用

### 安装

```bash
pnpm create slidev
```

### 语法

#### 扉页及布局

通过将分隔符转换为扉页块 (front matter)，为每张幻灯片指定布局 (layout) 和其他元数据。每个扉页信息都以分隔符 `---` 开始，以另一个分隔符 `---` 结束。

```
---
layout: cover
---

# Slidev

This is the cover page.

---
layout: center
background: './images/background-1.png'
class: 'text-white'
---

# Page 2

This is a page with the layout `center` and a background image.

---

# Page 3

This is a default page without any additional metadata.
```

#### 代码块及高亮

**代码块**

````
```ts
console.log('Hello, World!')
```
````

**高亮**
如需针对特定行进行高亮展示，只需在 `{}` 内添加对应的行号。行号从 1 开始计算。

````
```ts {2,3}
function add(
  a: Ref<number> | number,
  b: Ref<number> | number
) {
  return computed(() => unref(a) + unref(b))
}
```
````

如果要在多个步骤中改变高亮，你可以用 `|` 分隔它们。比如：

````
```ts {2-3|5|all}
function add(
  a: Ref<number> | number,
  b: Ref<number> | number
) {
  return computed(() => unref(a) + unref(b))
}
```
````

#### 插槽

一些布局可以使用 [Vue 的具名插槽](https://v3.vuejs.org/guide/component-slots.html)。

例如，在 [`two-cols` 布局](https://github.com/slidevjs/slidev/blob/main/packages/client/layouts/two-cols.vue) 中，你可以采用左（`default` 插槽）右（`right` 插槽）两列的布局方式。

```
---
layout: two-cols
---

<template v-slot:default>

# Left

This shows on the left

</template>
<template v-slot:right>

# Right

This shows on the right

</template>
```

![image.png](https://img.leostar.top/study/20231121133814.png)

我们还为具名插槽提供了一个语法糖 `::name::`。下述示例与上述示例的工作原理完全相同。

```
---
layout: two-cols
---

# Left

This shows on the left

::right::

# Right

This shows on the right
```

你也可以明确的指定默认插槽，并按自定义顺序展示。

```
---
layout: two-cols
---

::right::

# Right

This shows on the right

::default::

# Left

This shows on the left
```

#### 备注

注释将展示在演讲者模式中

在 Markdown 中，每张幻灯片中的最后一个注释块将被视为备注。

```
---
layout: cover
---

# 第 1 页

This is the cover page.

<!-- 这是一条备注 -->

---

# 第 2 页

<!-- 这不是一条备注，因为它在幻灯片内容前 -->

The second page

<!--
这是另一条备注
-->
```

#### 多入口点

`slides.md` :

```
# Page 1

This is a normal page

---
src: ./subpage2.md
---

<!-- this page will be loaded from './subpage2.md' -->
Inline content will be ignored
```

`subpage2.md` :

```
# Page 2

This page is from another file
```

**合并 Frontmatter**
你可以为主入口点和外部 markdown 页面提供 frontmatter。如果其中有相同的 key，**主入口点的 key 拥有更高的优先级**。例如：

`slides.md` :

```
---
src: ./cover.md
background: https://sli.dev/bar.png
class: text-center
---
```

`cover.md` :

```
---
layout: cover
background: https://sli.dev/foo.png
---

# Cover

Cover Page
```

其效果最终与下述页面相同：

```
---
layout: cover
background: https://sli.dev/bar.png
class: text-center
---

# Cover

Cover Page
```

**页面复用**

有了多入口点的加持，对页面进行重用变得很容易。例如：

```
---
src: ./cover.md
---

---
src: ./intro.md
---

---
src: ./content.md
---

---
# reuse
src: ./content.md
---
```
