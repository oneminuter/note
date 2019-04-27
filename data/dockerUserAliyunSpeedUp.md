# docker 使用阿里云加速

推荐安装1.10.0以上版本的Docker客户端

## 配置镜像加速器
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