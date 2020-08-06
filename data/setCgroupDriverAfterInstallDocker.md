# docker 安装后设置 cgroup 驱动

前提是是安装好 docker

## 创建 /etc/docker 目录
```
mkdir /etc/docker
```

## 设置 daemon
```
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF
```

`native.cgroupdriver=systemd` 将 docker 的 cgroup 驱动设为 systemd，这样和 kubelet 使用的 cgroup 驱动一直，这样 k8s 对资源的管理更稳定

## 重启 docker
```
systemctl daemon-reload
systemctl restart docker
```

## 扩展

### 设置 kubelet cgroup 驱动
使用 docker 时，kubeadm 会自动为其检测 cgroup 驱动并在运行时对 `/var/lib/kubelet/kubeadm-flags.env` 文件进行配置

如果您使用不同的 CRI，您需要使用 cgroup-driver 值修改 /etc/default/kubelet 文件（对于 CentOS、RHEL、Fedora，修改 /etc/sysconfig/kubelet 文件），像这样：
```
KUBELET_EXTRA_ARGS=--cgroup-driver=<value>
```

需要重新启动 kubelet：
```
systemctl daemon-reload
systemctl restart kubelet
```

