# docker 使用阿里云加速

[TOC]

推荐安装1.10.0以上版本的Docker客户端

## Linux 上配置镜像加速器
针对Docker客户端版本大于 1.10.0 的用户
通过修改`daemon`配置文件 `/etc/docker/daemon.json` 来使用加速器
```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://pcesedw2.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## Mac 上配置镜像加速
针对安装了Docker Toolbox的用户，您可以参考以下配置步骤：
创建一台安装有Docker环境的Linux虚拟机，指定机器名称为default，同时配置Docker加速器地址。
```
docker-machine create --engine-registry-mirror=https://pcesedw2.mirror.aliyuncs.com -d virtualbox default
```

查看机器的环境配置，并配置到本地，并通过Docker客户端访问Docker服务。
```
docker-machine env default
eval "$(docker-machine env default)"
docker info
```

针对安装了Docker for Mac的用户，您可以参考以下配置步骤：
右键点击桌面顶栏的 docker 图标，选择 `Preferences` ，在 `Daemon` 标签（Docker 17.03 之前版本为 Advanced 标签）下的 `Registry mirrors` 列表中将

`https://pcesedw2.mirror.aliyuncs.com` 加到"registry-mirrors"的数组里，点击 Apply & Restart按钮，等待Docker重启并应用配置的镜像加速器。
