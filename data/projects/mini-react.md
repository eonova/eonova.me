---
name: 'mini-react'
description: 'monorepo实现一个简化版React'
homepage: 'https://mini-react.eonova.me/'
github: 'https://github.com/eonova/mini-react'
date: '2024-03-15T05:56:23.191Z'
techstack: ['Vite']
selected: false
---

# mini-react

monorepo实现一个简化版React

## Tasks State

### day 1 实现最简 mini-react

- [x] 实现一个最简单的react
- [x] jsx

### day 2 任务调度器 & fiber架构

- [x] 实现任务调度器
- [x] 实现fiber架构

### day 3 统一提交 & 实现 function component

- [x] 实现统一提交
- [x] 实现function component

### day 4 进军 vdom 的更新

- [x] 实现事件绑定
- [x] 实现更新Props

### day 5 击杀 update children

- [x] diff-更新children
- [x] diff-删除多余的老节点
- [x] 解决edge case的方式
- [x] 优化更新-减少不必要的计算

### day 6 搞定 useState

- [x] 实现 useState
- [x] 批量执行 action
- [x] 提前检测 减少不必要更新

### day 7 搞定 useEffect

- [x] 实现 useEffect
- [x] 实现 cleanup

## day 8 实现 todo-list

- [x] 实现 todo-list

## Directory structure

```text
├── .vscode               // vscode配置
├── packages              // mini-react
│   ├── react
│   └── react-dom
├── playground            // 测试项目
│   ├── public
│   ├── src
│   ├── index.html
│   └── package.json
├── .editorconfig         // IDE配置文件
├── .gitignore            // git忽略文件
├── LICENSE              // 许可证
├── README.md             // 项目说明文件
├── packages.json         // 项目配置文件
├── pnpm-lock.yaml        // pnpm依赖文件
└── pnpm-workspace.yaml   // pnpm monorepo配置文件
```
