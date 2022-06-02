# 新服务器基本操作
[TOC]

## 添加用户
```
useradd -d 家目录 -m 用户名 -G 用户组
```

## 为用户添加可执行 sudo 命令
```
visudo
```
nano编辑器，使用 `crtl + o` 保存，然后再 `ctrl + x` 退出

## 查看终端使用的命令类型
```
echo $SHELL
```

## 将 sh 改为 base
```
sudo usermod --shell /bin/bash xxx
```

## 免密登录
将本地的 `.ssh/id_rsa.pub` 的内容放到服务器的家目录的 `.ssh/authorized_keys` 中

## 将用户强制踢下线
先用 w 查看当前登录的用户
```
root@hecs:~# w
 14:30:53 up 57 min,  3 users,  load average: 0.00, 0.00, 0.00
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
root     pts/0    120.244.xx.xx   14:00   27:07   0.03s  0.00s visudo
linty    pts/1    120.244.xx.xx   14:00   29:40   0.00s  0.00s -sh
root     pts/2    120.244.xx.xx   14:29    5.00s  0.02s  0.00s w
```

然后踢下线
```
pkill -kill -t pts/0
```

