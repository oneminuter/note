# 本地 kubectl 访问远程 k8s 集群

## 初始化
在使用 kubeadm 初始化时，使用 --apiserver-cert-extra-sans=${外网 ip 或域名}，在生成证书时，签名 master 节点的外网 ip 或域名
例子：
```
kubeadm init --apiserver-advertise-address=172.17.128.171 --image-repository registry.aliyuncs.com/google_containers --kubernetes-version v1.18.0 --service-cidr=10.1.0.0/16 --pod-network-cidr=10.244.0.0/16 --apiserver-cert-extra-sans=${外网 ip} --ignore-preflight-errors=Swap
```

## 配置文件
将 /etc/kubernetes/admin.conf 文件内容拷到本地，可以放到 ${HOME}/.kube/config（可以设置其他文件名）中


##  环境变量
设置 KUBECONFIG 环境变量指向上面的配置文件
```
export KUBECONFIG=${HOME}/.kube/config
```

这是就可以用本地 kubectl 访问远端 k8s 集群了，检验
```
kubectl get node
```


## 扩展
关于配置文件管理，可以参看官方 [配置对多集群的访问](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)

如果是已搭建好的 k8s 集群加入外网访问
1. 更新证书，支持 kubectl 远程访问
```
kubeadm init phase certs apiserver --apiserver-advertise-address ${原来的advertise ip} --apiserver-cert-extra-sans ${master的外网ip}
```
2. 刷新 admin.conf
```
kubeadm alpha certs renew admin.conf
```
3.然后将 admin.conf 拷到本地
