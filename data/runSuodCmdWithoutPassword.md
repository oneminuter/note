# 让 Linux 系统执行 sudo 时不用输密码

[TOC]

## 编辑 /etc/sudoers
打开终端，先以 root 身份登录, 然后执行
```
visudo
```

在打开的文件中，找到下面这一行
```
root	ALL=(ALL) 	ALL
```

## 为用户添加 root 权限
并紧帖其下面，添上自己，如我的用户名是： xiaolin，则添上 ：
```
root	ALL=(ALL) 	ALL
xiaolin	ALL=(ALL) 	ALL
```

这步的作用是让用户能使用 sudo 命令，要让执行时不需要输入密码，再找到下面这一句
```
#%wheel  ALL=(ALL)         NOPASSWD: ALL
```

## 去掉 wheel 命令权限前的注释
去掉前面的 `#` 注释，变成这样
```
%wheel  ALL=(ALL)         NOPASSWD: ALL
```
`注意: % 前面不要留空格`

然后保存退出

## 将用户加入到 `wheel` 组中
```
gpasswd -a YourUserName wheel
```
`YourUserName` 是要添加的用户名，这里我的就替换为`xiaolin`

`gpasswd` 工作组文件/etc/group和/etc/gshadow的管理工具
