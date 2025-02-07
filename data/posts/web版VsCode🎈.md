---
title: web版VsCode🎈
id: 78631d58-0e65-4ed2-8903-15988c15930e
date: 2023-12-23 19:49:38
auther: leostar
cover: 
excerpt: 可以在任何电脑上随时打开自己的IDE，听起来就挺好玩的，不过安全问题还有待考察 Code Server 效果图如下： 使用的code-server coder/code-server VS Code in the browser (github.com) 使用docker compose部署 运行
permalink: /archives/KDjGxP2i
categories:
tags: 
---

可以在任何电脑上随时打开自己的IDE，听起来就挺好玩的，不过安全问题还有待考察
## Code Server
效果图如下：
![image.png](https://img.leostar.top/study/20231223192707.png)
使用的code-server
[coder/code-server: VS Code in the browser (github.com)](https://github.com/coder/code-server)

## 使用docker compose部署
### 运行和挂载
先编写一个`docker-compose.yml`文件，编写内容如下：
```yml
version: '3'
services:
  code-server:
    container_name: code-server
    image: linuxserver/code-server:4.20.0
    ports:
      - 40031:8843
    volumes:
      - /usr/local/node/nodejs18:/home/vscode/nodejs18/
      - /data/vscode/workspace:/home/vscode/workspace
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
      - DEFAULT_WORKSPACE=/home/coder/project
      - PASSWORD=123456
      - NODE_HOME=/data/vscode/nodejs18
    restart: always
    privileged: true
```
这里要注意`volumes`下的`node`环境`/usr/local/node/nodejs18`改成自己服务器的node环境地址，然后`PASSWORD=123456`改成自己的密码，接着在终端执行`docker-compose up -d`

### 配置容器内的环境变量
```bash
#进入容器
docker exec -it 容器id /bin/bash

#配置容器环境变量
vim /etc/profile
#然后把下面2句话放到文件中
export NODE_HOME=/home/vscode/nodejs18
export PATH=$NODE_HOME/bin:$PATH
#最后刷新一下配置文件
source /etc/profile

#确认是否安装完成
node -v
npm -v
```

## 配置网站
### 添加站点
输入域名（没有的话就随便填写，在域名管理中添加公网IP:端口号，记得开放防火墙）
![image.png](https://img.leostar.top/study/20231223193953.png)
### 添加反向代理
代理名称随便填写
目标url：http://127.0.0.1:40031（这里40031是前面docker-compose里面映射出来的端口）
![image.png](https://img.leostar.top/study/20231223194336.png)
## 测试

### 网站输入域名
![image.png](https://img.leostar.top/study/20231223194619.png)
密码是之前docker-compose.yml配置的PASSWORD
### 大功告成
![image.png](https://img.leostar.top/study/20231223194728.png)
