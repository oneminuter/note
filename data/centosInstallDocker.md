# centos 安装 docker

Docker 要求 CentOS 系统的内核版本高于 3.10

uname -r 命令查看你当前的内核版本
```shell
uname -r
```


确保 yum 包更新到最新
```shell
yum update
```

卸载旧版本(如果安装过旧版本的话)
```shell
yum remove docker  docker-common docker-selinux docker-engine
```

安装需要的软件包， yum-util 提供yum-config-manager功能，另外两个是devicemapper驱动依赖的

```shell
yum install -y yum-utils device-mapper-persistent-data lvm2
```

设置yum源
```shell
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

可以查看所有仓库中所有docker版本，并选择特定版本安装
```shell
yum list docker-ce --showduplicates | sort -r
```

安装docker
```shell
yum install docker-ce
```
由于repo中默认只开启stable仓库，故这里安装的是最新稳定版

启动并加入开机启动
```shell
systemctl start docker
systemctl enable docker
```

验证安装是否成功
```shell
docker version
```