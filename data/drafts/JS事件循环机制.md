---
title: JS事件循环机制
id: 18c6db91-9e38-4a8e-962f-a30eff92dd2c
date: 2023-12-02 21:30:28
auther: eonova
cover:
excerpt: JS事件循环机制 JavaScript是单线程 为什么JavaScript不能有多个线程呢？ 答：作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点
permalink: /archives/yivPczPm
categories:
 - jsji-jin
tags:
 - jsji-chu
 - jsshi-jian
---

# JS事件循环机制

## JavaScript是单线程

**为什么JavaScript不能有多个线程呢？**

> 答：作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准；

所以，为了避免复杂性，从一诞生，JavaScript就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

## 浏览器执行线程

> 在解释事件循环之前首先先解释一下浏览器的执行线程：
> 浏览器是多进程的，浏览器每一个 tab 标签都代表一个独立的进程，其中浏览器渲染进程（浏览器内核）属于浏览器多进程中的一种，主要负责页面渲染，脚本执行，事件处理等
> 其包含的线程有：GUI 渲染线程（负责渲染页面，解析 HTML，CSS 构成 DOM 树）、JS 引擎线程、事件触发线程、定时器触发线程、http 请求线程等主要线程

## 关于执行中的线程

**主线程**：也就是 js 引擎执行的线程，这个线程只有一个，页面渲染、函数处理都在这个主线程上执行。
**工作线程**：也称幕后线程，这个线程可能存在于浏览器或JS引擎内，与主线程是分开的，处理文件读取、网络请求等异步事件。

**任务队列( Event Queue )**

> 所有的任务可以分为同步任务和异步任务，同步任务，顾名思义，就是立即执行的任务，同步任务一般会直接进入到主线程中执行；而异步任务，就是异步执行的任务，比如ajax网络请求，setTimeout 定时函数等都属于异步任务，异步任务会通过任务队列的机制(先进先出的机制)来进行协调。

**EventLoop执行流程：**

![image-20230701110718724](https://img.leostar.top/study/image-20230701110718724.png)

**同步和异步任务分别进入不同的执行环境，同步的进入主线程，即主执行栈，异步的进入任务队列。主线程内的任务执行完毕为空，会去任务队列读取对应的任务，推入主线程执行。 上述过程的不断重复就是我们说的 Event Loop (事件循环)。**

## 同步任务和异步任务

单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。

**举例**

```js
console.log('1')

setTimeout(() => {
  console.log('2')
}, 1000)

console.log('3')
```

**输出**

```text
	1
	3
	2
```

为了不影响主线程正常运行，就把那些耗时的时间（比如定时器，Ajax操作从网络读取数据等）任务挂起来，依次的放进一个任务队列中，等主线程的任务执行完毕后，再回过来去继续执行队列中的任务；

于是，任务就可以分成两种：

**同步任务：** 在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；

**异步任务：** 不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

其实上面的代码执行动图大致如下：

![在这里插入图片描述](https://img.leostar.top/study/cc12e7db5eda437facc1a881f1349b3d.gif)

## 宏任务和微任务

>任务可以分为同步任务和异步任务，而异步任务又可以分为宏任务和微任务

![](https://img.leostar.top/study/image-20230701121459452.png)

**浏览器中常用的宏任务和微任务：**

| 名称   | 事件                                                         |
| ------ | ------------------------------------------------------------ |
| 宏任务 | script( 整体代码)、setTimeout、setInterval、I/O、UI 交互事件、setImmediate(Node.js 环境) |
| 微任务 | Promise、MutaionObserver、process.nextTick(Node.js 环境)     |

那么异步任务既然分为宏任务和微任务，则队列肯定也分为宏任务队列和微任务队列啦；

当宏任务和微任务都处于 任务队列（Task Queue） 中时，微任务的优先级大于宏任务，即先将微任务执行完，再执行宏任务；

**举例**

```js
console.log('1')

setTimeout(() => {
  console.log('2')
}, 1000)

new Promise((resolve, reject) => {
  console.log('3')
  resolve()
})
  .then((res) => {
    console.log('4')
  })

console.log('5')
```

**输出**

```text
1，3，5，4，2
```

其实上面得代码执行动图大致如下：

![在这里插入图片描述](https://img.leostar.top/study/743f2f498ecb43b2bc7db0d3da8751e5.gif)

**执行机制过程如下：**

**第一步：** 主线程执行同步任务的同时，把一些异步任务放入‘任务队列’（task queue）中，等待主线程的调用栈为空时，再依次从队列出去任务去执行；

**第二步：** 检测任务队列中的微队列是否为空，若不为空，则取出一个微任务入栈执行；然后继续执行第2步；如果微队列为空，则开始取出宏队列中的一个宏任务执行；

**第三步：** 执行完宏队列中的一个宏任务后，会继续检测微队列是否为空，如果有新插入的任务，这继续执行第二步；如果微队列为空，则继续执行宏队列中的下一个任务，然后再继续循环执行第三步；

## Event Loop执行过程

了解到宏任务与微任务过后，我们来看一下宏任务与微任务的执行顺序。

1. 代码开始执行，创建一个全局调用栈，`script`作为宏任务执行
2. 执行过程过同步任务立即执行，异步任务根据异步任务类型分别注册到微任务队列和宏任务队列
3. 同步任务执行完毕，查看微任务队列
   - 若存在微任务，将微任务队列全部执行(包括执行微任务过程中产生的新微任务)
   - 若无微任务，查看宏任务队列，执行第一个宏任务，宏任务执行完毕，查看微任务队列，重复上述操作，直至宏任务队列为空

**Event Loop的执行顺序图：**

<img src="https://img.leostar.top/study/v2-a38ad24f9109e1a4cb7b49cc1b90cafe_720w.webp" alt="img"  />

## 练习

```js
console.log('script start')

setTimeout(() => {
  console.log('timeout1')
}, 10)

new Promise((resolve) => {
  console.log('promise1')
  resolve()
  setTimeout(() => console.log('timeout2'), 10)
}).then(() => {
  console.log('then1')
})

console.log('script end')
```

**分析：**

首先，事件循环从宏任务 (macrotask) 队列开始，最初始，宏任务队列中，只有一个 scrip t(整体代码)任务；当遇到任务源 (task source) 时，则会先分发任务到对应的任务队列中去。所以，就和上面例子类似，首先遇到了console.log，输出 script start； 接着往下走，遇到 setTimeout 任务源，将其分发到任务队列中去，记为 timeout1； 接着遇到 promise，new promise 中的代码立即执行，输出 promise1, 然后执行 resolve ,遇到 setTimeout ,将其分发到任务队列中去，记为 timemout2, 将其 then 分发到微任务队列中去，记为 then1； 接着遇到 console.log 代码，直接输出 script end 接着检查微任务队列，发现有个 then1 微任务，执行，输出then1 再检查微任务队列，发现已经清空，则开始检查宏任务队列，执行 timeout1,输出 timeout1； 接着执行 timeout2，输出 timeout2 至此，所有的都队列都已清空，执行完毕。其输出的顺序依次是：script start, promise1, script end, then1, timeout1, timeout2。

**流程图：**

<img src="https://img.leostar.top/study/v2-a3ac02a230c49c9aa8c45af46eae2e1c_720w.webp" alt="img"  />

>参考文章：
>
>[【JS】深入理解事件循环,这一篇就够了!(必看) - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/87684858)
>
>[(187条消息) 深入理解Javascript中的event loop（事件循环）机制_前端探险家的博客-CSDN博客](https://blog.csdn.net/qq_44182284/article/details/121158680)
