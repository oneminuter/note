# 安装 docker 私有仓库

前提：机器上安装有 docker, 

## 拉取镜像
```
docker pull registry
``` 

## 启动镜像
```
docker run -d -p 5000:5000 --name registry registry
```

## 配置本地 daemon.json 
docker 访问仓库默认是使用 https, 自己搭建的仓库如果没有证书，访问需要配置 /etc/docker/daemon.json
```
{
	"insecure-registries":[
        "47.93.228.231:5000"
    ]
}
```

## 推送镜像到私有仓库
这里以仓库服务 ip 为： 192.168.1.200

### 先对镜像打 tag
```
docker tag ${docker-image-name:tag} 192.168.1.200:5000/${docker-image-name:tag}
```
这里的 ${docker-image-name:tag} 根据自己本地实际情况替换

### 推送镜像
```
docker push 192.168.1.200:5000/${docker-image-name:tag}
```

## 扩展
使用 docker-compose 搭建, docker-compose.yml 配置为
```
version: '3'
services:
  docker-registry:
    image: registry
    ports:
      - 5000:5000
    volumes:
      - ./data:/var/lib/registry
    restart: always
```

## 查看 docker registry 里有哪些镜像
```
curl -X GET https://[HOST]/v2/_catalog
```
其他配置扩展，如多节点、https 访问，请参考 [官方文档](https://docs.docker.com/registry/)