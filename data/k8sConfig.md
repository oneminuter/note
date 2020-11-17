# k8s 配置 config

本地 kubectl 连接远程 k8s 集群

将远程 $HOME/.kube/config 拷贝到本地，可以放在本地 $HOME/.kube/config-demo
参照下面：

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
$HOME/.kube/config 拷贝到本地之后，修改其中的 server 地址为可访问的地址
```
server: https://192.168.1.26:6443
```


设置环境变量
```
export KUBECONFIG=$HOME/.kube/config-demo
kubectl config view --minify
```