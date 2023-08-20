# gitConfig

[TOC]

一般 git 的全局配置文件位于 家目录下的 `.gitconfig` 文件中

## 配置用户和邮箱
```
git config --global user.name xxx
git config --global user.email xxx@.qq.com
```

## 配置私有仓库地址替换，ssh 转 https
```
git config --global url."git@gitlab.oneminuter.com:".insteadOf 'https://gitlab.oneminuter.com/'
```

## 设置新建仓库默认分支名
```
git config --global init.defaultBranch master
```


## 配置 git branch 不打开新的 screen
```
git config --global core.pager 'less --no-init --quit-if-one-screen'
```
这样就可以 `git branch` 不会分页，`git log` 会分页