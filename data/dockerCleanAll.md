# 卸载 docker 所有磁盘挂载，删除所有镜像和容器

```
minikube stop; 
minikube delete
docker stop (docker ps -aq)
rm -r ~/.kube ~/.minikube
sudo rm /usr/local/bin/localkube /usr/local/bin/minikube
systemctl stop '*kubelet*.mount'
sudo rm -rf /etc/kubernetes/
docker system prune -af --volumes
```

注意：`docker system prune -af --volumes` 这个命令慎用，将会清除本机上所有 docker 镜像、容器、磁盘挂载、network