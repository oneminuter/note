# k8s 安装 kubeadm,kubectl,kubelet 使用阿里镜像

按照官方的命令安装 kubeadm,kubectl,kubelet 需要翻墙，一般很难下载
可以使用 aliyun 镜像进行安装

## 配置镜像源
```
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

## 安装
```
yum install -y kubelet kubeadm kubectl
```

## 将 SELinux 设置为 permissive 模式（相当于将其禁用）
```
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
```
通过运行命令 setenforce 0 和 sed ... 将 SELinux 设置为 permissive 模式可以有效的将其禁用。 这是允许容器访问主机文件系统所必须的，例如正常使用 pod 网络。 您必须这么做，直到 kubelet 做出升级支持 SELinux 为止

一些 RHEL/CentOS 7 的用户曾经遇到过问题：由于 iptables 被绕过而导致流量无法正确路由的问题。您应该确保 在 sysctl 配置中的 net.bridge.bridge-nf-call-iptables 被设置为 1
```
cat <<EOF >  /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
```
确保在此步骤之前已加载了 br_netfilter 模块。这可以通过运行 lsmod | grep br_netfilter 来完成。要显示加载它，请调用 modprobe br_netfilter。

kubelet 现在每隔几秒就会重启，因为它陷入了一个等待 kubeadm 指令的死循环

## 重启 kubelet
```
systemctl daemon-reload
systemctl restart kubelet
```