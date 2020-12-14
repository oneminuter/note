# minikube 操作

## 下载
```
https://github.com/kubernetes/minikube/releases/tag/v1.7.3
```

## 启动
使用阿里镜像服务进行加速
```
./minikube start --vm-driver=docker --image-mirror-country=cn --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers

```
如果没有指定 `--vm-driver`, 默认驱动为 `hyperkit`

如果之前已启动过，只需即可
```
minikube start
```

## 停止
```
minikube stop
```

## 删除
```
minikube delete
```

## dashboard
```
minikube dashboard
```