---
title: CMD命令设置别名
id: 5bf2da6c-9500-4d6f-b3c9-0daf0e0f6076
date: 2023-12-02 19:19:52
auther: leostar
cover:
excerpt: CMD命令设置别名 新建一个bat文件 配置参考antfu/dotfiles My dotfiles (github.com) REM ---Node Package Manager---@echo offdoskey s=nr start $*doskey d=nr dev $*dos
permalink: /archives/pKkV1cEY
categories:
 - git
tags:
 - qi-ta
---

# CMD命令设置别名

## 新建一个bat文件

配置参考[antfu/dotfiles: My dotfiles (github.com)](https://github.com/antfu/dotfiles)

```bat
REM ---Node Package Manager---

@echo off
doskey s=nr start $*
doskey d=nr dev $*
doskey b=nr build $*
doskey bw=nr build --watch $*
doskey t=nr test $*
doskey tu=nr test -u $*
doskey tw=nr test --watch $*
doskey w=nr watch $*
doskey p=nr play $*
doskey c=nr typecheck $*
doskey lint=nr lint $*
doskey lintf=nr lint --fix $*
doskey release=nr release $*
doskey re=nr release $*

REM ---Git---

doskey grt=cd "$(git rev-parse --show-toplevel)" $*

doskey gs=git status $*
doskey gp=git push $*
doskey gpf=git push --force $*
doskey gpft=git push --follow-tags $*
doskey gpl=git pull --rebase $*
doskey gcl=git clone $*
doskey gst=git stash $*
doskey grm=git rm $*
doskey gmv=git mv $*

doskey main=git checkout main $*

doskey gco=git checkout $*
doskey gcob=git checkout -b $*

doskey gb=git branch $*
doskey gbd=git branch -d $*

doskey grb=git rebase $*
doskey grbom=git rebase origin/master $*
doskey grbc=git rebase --continue $*

doskey gl=git log $*
doskey glo=git log --oneline --graph $*

doskey grh=git reset HEAD $*
doskey grh1=git reset HEAD~1 $*

doskey ga=git add $*
doskey gA=git add -A $*

doskey gc=git commit $*
doskey gcm=git commit -m $*
doskey gca=git commit -a $*
doskey gcam=git add -A && git commit -m $*
doskey gfrb=git fetch origin && git rebase origin/maste $*r

doskey gxn=git clean -dn $*
doskey gx=git clean -df $*

doskey gsha=git rev-parse HEAD | pbcopy $*
```

## 修改注册表

win+r，键入regedit，进入地址：计算机\HKEY_CURRENT_USER\SOFTWARE\Microsoft\Command Processor，接着右键新建一个字符串值，双击编辑该值，随便起个名字（比如AutoRun），数值数据里填刚才新建的bat文件的路径（C:\Users\Meteor\cmd_alias.bat）

![image-20230922203607991](https://img.leostar.top/study/image-20230922203607991.png)

重启一下cmd命令行就成功了。
