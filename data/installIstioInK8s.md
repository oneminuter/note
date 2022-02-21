# k8s 安装 istio

## 下载 istio
[github 下载](https://github.com/istio/istio/releases/)
下载之后，解压文件，这里以 istio-1.11.4 为例

进入文件夹，设置环境变量
```
export PATH=$PWD:$PATH
```

## 安装 istio
```
istioctl install --set profile=demo -y
```

## 设置 k8s 默认 namespace 设置 label
```
kubectl label namespace default istio-injection=enabled
```

---

## 安装测试例子 Bookinfo
https://raw.githubusercontent.com/istio/istio/release-1.11/samples/bookinfo/platform/kube/bookinfo.yaml

```
kubectl apply -f bookinfo.yaml
```

查看服务
```
kubectl get services
```

查看 pod
```
kubectl get pods
```
直到所有 pod 状态都为 running

验证
```
kubectl exec "$(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}')" -c ratings -- curl -sS productpage:9080/productpage | grep -o "<title>.*</title>"
```

目前 Bookinfo 只能在集群内部访问，如果需要外部访问，需要安装 ingress
https://raw.githubusercontent.com/istio/istio/release-1.11/samples/bookinfo/networking/bookinfo-gateway.yaml

```
kubectl apply -f bookinfo-gateway.yaml
```

## 查看 load balancer
```
kubectl get svc istio-ingressgateway -n istio-system
```

如果 `EXTERNAL-IP` 的值为 `<none> 或者 `<pending>`, 说明你的集群公网 ip 访问. 可以使用 `NodeId:Port` 方式访问

## 获取 NodeIp 和 PORT
```
export INGRESS_HOST=$(kubectl get po -l istio=ingressgateway -n istio-system -o jsonpath='{.items[0].status.hostIP}')

export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')
export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].nodePort}')

export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT

echo $GATEWAY_URL
```

浏览器访问：
```
http://$GATEWAY_URL/productpage
```
要查看跟踪数据，必须向服务发送请求。请求的数量取决于Istio的采样率。在安装Istio时设置此速率。默认采样率为1%。在第一个跟踪可见之前，需要发送至少100个请求。要向productpage服务发送100个请求
```
for i in $(seq 1 100); do curl -s -o /dev/null "http://192.168.13.63:30569/productpage"; done
```



