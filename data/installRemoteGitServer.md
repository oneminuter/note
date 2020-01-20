# 搭建 git 服务器

[TOC]

## 第一步，安装 `git`
```
sudo yum install -y git
```

## 第二步，创建一个 `git` 用户，用来运行 `git` 服务
```
sudo adduser git
```

## 第三步，创建证书登录
收集所有需要登录的用户的公钥，就是他们自己的`id_rsa.pub`文件，把所有公钥导入到`/home/git/.ssh/authorized_keys`文件里，一行一个

## 第四步，初始化Git仓库
先选定一个目录作为Git仓库，假定是/srv/sample.git，在/srv目录下输入命令：
```
sudo git init --bare sample.git
```
Git就会创建一个裸仓库，裸仓库没有工作区，因为服务器上的Git仓库纯粹是为了共享，所以不让用户直接登录到服务器上去改工作区，并且服务器上的Git仓库通常都以`.git`结尾。然后，把owner改为`git`：
```
sudo chown -R git:git sample.git
```

## 第五步，禁用shell登录
出于安全考虑，第二步创建的git用户不允许登录shell，这可以通过编辑/etc/passwd文件完成。找到类似下面的一行：
```
git:x:1001:1001:,,,:/home/git:/bin/bash
```
改为：
```
git:x:1001:1001:,,,:/home/git:/usr/bin/git-shell
```
这样，`git`用户可以正常通过ssh使用git，但无法登录shell，因为我们为`git`用户指定的`git-shell`每次一登录就自动退出。

## 第六步，克隆远程仓库
现在，可以通过git clone命令克隆远程仓库了，在各自的电脑上运行：
```
 git clone git@server:/srv/sample.git
```