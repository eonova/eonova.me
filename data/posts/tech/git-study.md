---
title: Git入门
date: '2023-01-01T00:00:00Z'
modifiedTime: '2023-01-03T00:00:00Z'
intro: Git安装及配置
categories: ['tech']
tags: ['git']
cover: 'https://img.eonova.me/upload/51290772e02b0274af8e3b4a30356ffd.jpeg'
---

## Git安装及配置

Git 各平台安装包下载地址为：[http://git-scm.com/downloads](http://git-scm.com/downloads)

下载之后无脑下一步即可，安装完之后，桌面右键出现Git GUI、Git
bash选项，说明已安装:

![image.png](https://img.eonova.me/upload/20231202175419.png)

接着进行git环境配置

常用命令如下：

```bash
# 显示当前的Git配置
git config --list

# 编辑Git配置文件
git config -e [--global]

# 配置用户名("username"是自己的用户名
git config --global user.name "username"
# 配置邮箱("username@email.com"是注册账号时所用的邮箱
git config --global user.email "username@email.com"

# 设置大小写敏感（windows不区分大小写的解决办法）
git config core.ignorecase  falsebash
```

1. 我们先在GitHub或Gitee官网上注册一个账号，注册好后，桌面右键选择Git
   Bash，进行账号配置，命令如下：

   ```bash
   # 配置用户名("username"是自己的用户名
   git config --global user.name "username"
   # 配置邮箱("username@email.com"是注册账号时所用的邮箱
   git config --global user.email "username@email.com"
   ```

   执行完之后，可以用`git config --global --list`查看是否配置成功

2. 接着，我们需要生成SSH公钥，用于本地电脑和远程仓库Github/Gitee进行连接

   ```bash
   # 生成ssh
   ssh-keygen -t rsa

   # 命令执行后，连敲3次回车键
   ```

3. 执行完后到系统盘users目录(win: 'C:\Users\用户名\
   .ssh\'），查看生成的ssh文件：

![image.png](https://img.eonova.me/upload/20231202175432.png)

4. 将公钥（ id_rsa.pub），添加到Github或Gitee平台中，这里以Github为例：

   (1)Github登录成功后，点击个人账户>>Setting>>SSH and GPG Keys>>New SSH key；

   (2)将公钥（ id_rsa.pub）文件中的内容复制到key中，Title随便起，点击确定就配置完成啦。
   ![](https://img.eonova.me/upload/20231202175525.png) (3)回到git
   bash窗口，输入 `ssh -T git@github.com`，如下所示，说明配置成功！
   ![Uploading file...clh83](https://img.eonova.me/upload/20231202175702.png)

下面有几个问题：（1）为什么要配？配了才能实现push代码的时候不需要反复输入自己的github账号密码，更方便（2）每使用一台主机都要配？是的，每使用一台新主机进行git远程操作，想要实现无密，都需要配置。并不是说每个账号配一次就够了，而是每一台主机都需要配。（3）配了为啥就不用密码了？因为配置的时候是把当前主机的公钥放到了你的github账号下，相当于当前主机和你的账号做了一个关联，你在这台主机上已经登录了你的账号，此时此刻github认为是该账号主人在操作这台主机，在配置ssh后就信任该主机了。所以下次在使用git的时候即使没有登录github，也能直接从本地push代码到远程了。当然这里不要混淆了，你不能随意push你的代码到任何仓库，你只能push到你自己的仓库或者其他你有权限的仓库！

## 基本概念

Git是一个开源的分布式版本控制系统，分布式相比集中式的最大区别是Git没有“中央版本库”，每一位开发者都可以通过克隆（git
clone）远程代码库，在本地机器上初始化一个完整的代码版本，开发者可以把代码的修改提交到本地代码库，也可以把本地的代码库同步到远程的master代码库。常用的工作流程是：开发者通过git
pull/fetch命令把远程的代码库和本地的master代码库（主分支）进行合并，解决冲突之后，把本地代码库推送（git
push）到远程的master代码库。

![img](https://img.eonova.me/upload/v2-3bc9d5f2c49a713c776e69676d7d56c5_720w.webp)

- Remote：远程仓库
- Repository：本地仓库
- Index：暂存区
- Workspace：工作区

## Git的常用命令

```bash
git add <文件路径>   # 把指定的文件添加到暂存区中
git branch   # 列出本地的所有分支，当前所在分支以 "*" 标出
git checkout  # 切换到已存在的指定分支
git clone  # 默认在当前目录下创建和版本库名相同的文件夹并下载版本到该文件夹下
git commit  # 把暂存区中的文件提交到本地仓库，调用文本编辑器输入该次提交的描述信息
git init  # 初始化本地仓库，在当前目录下生成 .git 文件夹
git merge <分支名称>  # 把指定的分支合并到当前所在的分支下，并自动进行新的提交
git pull  # 从远程仓库获取最新版本。
git push  # 把本地仓库的分支推送到远程仓库的指定分支
git remote  # 列出已经存在的远程仓库
git status  # 查看本地仓库的状态
```

## Git基本操作

### 创建版本库

创建版本库有两种方式，一种是本地已经有项目，那么可以直接把项目文件夹变成一个git仓库，另一种是在gitee/github上创建好仓库，然后克隆到本地

```bash
git init   # 将本地文件夹变为一个git仓库
git clone <url>  #将远程仓库克隆到本地
```

### 提交和修改

```bash
git add <file> # 将单个文件从工作区添加到暂存区
git add . # 将所有文件添加到暂存区
git commit -m "messenge" # 将暂存区文件提交到本地仓库
git status # 查看工作区状态，显示有变更的文件。
git diff # 比较文件的不同，即暂存区和工作区的差异。
```

### 远程操作

```bash
git push origin master # 将本地的master分支推送到远程对应的分支
git pull  # 下载远程代码并合并，相当于git fetch + git pull
git fetch   # 从远程获取代码库，但不进行合并操作

git remote add origin <url> # 将远程仓库与本地仓库关联起来
git remote -v # 查看远程库信息
```

### 撤销与回退

撤销操作：当修改了暂存区的文件，但是还没有commit到本地仓库时，想要撤销之前的操作：

```bash
# 场景1：当你改乱了工作区某个文件的内容，但还没有add到暂存区
git checkout <file> # 撤销工作区的某个文件到和暂存区一样的状态

# 场景2：当乱改了工作区某个文件的内容，并且git add到了暂存区
git reset HEAD <file> # 第1步，将暂存区的文件修改撤销掉
git checkout <file> # 第2步，将工作区的文件修改撤销掉

# 场景3：乱改了很多文件，想回到最新一次提交时的状态
git reset --hard HEAD # 撤销工作区中所有未提交文件的修改内容
```

## Git分支管理

**Git的强大之处就体现在分支管理，主要有两个应用场景**

1. 多人协作：每个人都基于主分支创建一个自己的分支，在分支上进行开发，然后再不断将写好的代码合并到主分支
2. 自己修复bug/增加feature：创建一个bug分支或者feature分支，写好代码后合并到自己的分支然后删除bug/feature分支

```bash
git branch <name> # 创建分支
git checkout <name> # 切换到某个分支
git checkout -b <name> # 创建并切换到新分支，相当于同时执行了以上两个命令
git merge <name> # 合并某个分支到当前分支中，默认fast forward
git branch -a # 查看所有分支
git branch -d <name> # 删除分支
```

## Git多人协作

**多人协作在同一个分支上进行开发的工作模式：**

1. 首先，可以试图用`git push origin <branch-name>`推送自己的修改；
2. 如果推送失败，则因为远程分支比你的本地更新，需要先用`git pull`试图合并；
3. 如果合并有冲突，则解决冲突，并在本地提交；
4. 没有冲突或者解决掉冲突后，再用`git push origin <branch-name>`推送就能成功！
5. 如果`git pull`提示`no tracking information`，则说明本地分支和远程分支的链接关系没有创建，用命令`git branch --set-upstream-to <branch-name> origin/<branch-name>`。
