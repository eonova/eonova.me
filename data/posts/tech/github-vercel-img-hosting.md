---
title: 使用 Github 和 Vercel 搭建图床
date: '2025-05-29T00:00:00Z'
modifiedTime: '2025-05-29T00:00:00Z'
summary: 使用 Github 和 Vercel 搭建图床，本地 picgo 上传图片。
categories: ['tech']
cover: 'https://img.eonova.me/picgo/20250529195625450.png'
---

## 创建图床仓库

在 Github 上[创建一个新的仓库](https://github.com/new)。确保仓库是公开的，这样才能通过 URL 访问图片。

## 配置 Vercel

在 Vercel 上创建一个新的项目，连接到刚才创建的 `image-hosting`
仓库。Vercel 会自动检测到仓库中的代码并进行部署。

![](https://img.eonova.me/picgo/CleanShot%202025-05-29%20at%2019.17.56%402x.png)

### 配置 Domain

在 Vercel 的项目设置中，添加一个自定义域名，例如
`img.eonova.me`。确保这个域名已经解析到 Vercel 的服务器。

![](https://img.eonova.me/picgo/eonova-05-29-19-32-21%402x.png)

## 配置 picgo

在本地安装
[PicGo](https://picgo.github.io/PicGo-Doc/zh/), 并配置上传到 Vercel 的图床。

1. 打开 PicGo，进入设置界面。

![](https://img.eonova.me/picgo/eonova-05-29-19-33-30%402x.png)

在“图床”选项卡中，选择“Github”, 根据要求填写相应信息。

### 获取 GitHub Token

在 [GitHub](https://github.com/settings/tokens) 上生成一个新的 Personal Access
Token，确保勾选了 `repo` 权限。

![](https://img.eonova.me/picgo/CleanShot%202025-05-29%20at%2019.23.24%402x.png)

![](https://img.eonova.me/picgo/CleanShot%202025-05-29%20at%2019.25.03%402x.png)

填写完其他信息就完事了

## 测试一下

在 PicGo 中上传一张图片，确保图片能够成功上传到 Vercel 的图床，并且可以通过自定义域名访问。

![](https://img.eonova.me/picgo/eonova-05-29-19-39-33%402x.png)

上传完了后，可以到 Github 仓库中查看上传的图片。
