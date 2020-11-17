# k8s 错误集锦

## 安装时
1. 要求 cpu 核数大于 1
可以通过一下参数忽略
```
--ignore-preflight-errors=NumCPU
```

2. 错误解决
```
[ERROR FileContent--proc-sys-net-bridge-bridge-nf-call-iptables]: /proc/sys/net/bridge/bridge-nf-call-iptables contents are not set to 1
```
解决方式：
```
echo "1" >/proc/sys/net/bridge/bridge-nf-call-iptables
```

3. quay.io国内无法访问，解决Kubernetes应用flannel失败，报错Init:ImagePullBackOff
去 https://github.com/coreos/flannel/releases 官方仓库下载镜像
```
docker load < flanneld-v0.12.0-amd64.docker 
```