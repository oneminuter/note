# linux 创建用户
[TOC]

## 创建用户
```
useradd [username] -g [group] -m -s /bin/bash
```
- `-g` 指定用户组
- `-m` 是自动创建 home 家目录
- `-s` 指定 登录Shell

## 删除用户
```
userdel [username]
```