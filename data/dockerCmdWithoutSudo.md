# centos 上执行 docker 命令取出 sudo

由于 docker daemon 需要绑定到主机的 Unix socket 而不是普通的 TCP 端口，而 Unix socket 的属主为 root 用户，所以其他用户只有在命令前添加 sudo 选项才能执行相关操作，配置每次不需要 sudo 方法

## 1. 创建 docker 用户组
```shell
sudo groupadd docker
```

## 添加当前用户到docker组
```shell
sudo usermod -aG docker $USER
```

## 登出，重新登录shell