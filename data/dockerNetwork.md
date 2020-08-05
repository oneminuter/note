# docker network 命令

## 创建 docker network
```
docker network create --subnet 192.168.38.0/24 --gateway 192.168.38.1 k8s_network
```

## centos docker 镜像使用 systemctl
1. 配置 privileged = true
	如果是 docker run 的方式，加上运行参数 --privileged
2. 启动镜像时执行 /sbin/init

例 docker-compose.yml 配置如下
```
version: "3"
services:
  node1:
    image: centos:latest
    container_name: node1
    privileged: true
    command: /sbin/init && ping 127.0.0.1
    volumes:
      - ./data/master:/srv
    links:
      - node2
      - node3
    networks:
      customer_default:
        ipv4_address: 192.168.38.11
  node2:
    image: centos:latest
    container_name: node2
    privileged: true
    command: /sbin/init && ping 127.0.0.1
    volumes:
      - ./data/node1:/srv
    links:
      - node3
    networks:
      customer_default:
        ipv4_address: 192.168.38.12
  node3:
    image: centos:latest
    container_name: node3
    privileged: true
    command: /sbin/init && ping 127.0.0.1
    volumes:
      - ./data/node2:/srv
    networks:
      customer_default:
        ipv4_address: 192.168.38.13
networks:
  customer_default:
    external:
      name: customer_network
```
