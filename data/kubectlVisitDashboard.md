# k8s 访问 Dashboard

如果只是自己安装测试，使用的证书时自己生成的，用 chrome 浏览器访问不了，会报 `Your connection is not private`

## 第一种方式
通过本地 kubectl proxy 方式访问
前提：本地 kubectl 已配置好可以访问远端 k8s 集群
在终端敲入命令
```
kubectl proxy
```

在浏览器访问
```
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

## 创建 dashboard rbac
```
apiVersion: v1
kind: ServiceAccount
metadata:
    name: admin-user
    namespace: kubernetes-dashboard

---

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
    name: admin-user
roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: ClusterRole
    name: cluster-admin
subjects:
    - kind: ServiceAccount
      name: admin-user
      namespace: kubernetes-dashboard
```

## 查看登录 token
```
kubectl -n kube-system describe $(kubectl -n kube-system get secret -o name | grep namespace) | grep token

或

kubectl -n kubernetes-dashboard get secret $(kubectl -n kubernetes-dashboard get sa/admin-user -o jsonpath="{.secrets[0].name}") -o go-template="{{.data.token | base64decode}}"
```


## 第二种方式
安装 dashboard 时，暴露 service 的 type 修改为 NodePort
查看 Dashboard 暴露端口
```
root@master Desktop % kubectl -n kubernetes-dashboard get service kubernetes-dashboard
NAME                   TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)         AGE
kubernetes-dashboard   NodePort   10.1.106.193   <none>        443:31563/TCP   3h59m
```
其中 31563 即为service 暴露的外网端口，可在集群外访问


使用 Firefox 访问
```
https://<master-ip>:<node-port>
```
即可访问

这种方式，如果安装使用的自主生成的证书，使用 chrome 不能访问，如果要支持，需要申请共用信任证书