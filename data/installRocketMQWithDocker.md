# docker 搭建 RocketMQ

[TOC]

## 使用 docker-compose 搭建

### docker-compose.yml 配置文件
```yml
version: "3"
services:
  namesrv:
    image: rocketmqinc/rocketmq
    container_name: rmq-namesrv
    ports:
      - 9876:9876
    volumes:
      - /opt/rocketmq/rmqnamesrv/logs:/root/logs/rocketmqlogs
    command: sh mqnamesrv
  broker:
    image: rocketmqinc/rocketmq
    container_name: rmq-broker
    ports:
      - 10909:10909
      - 10911:10911
      - 10912:10912
    volumes:
      - /opt/rocketmq/rmqbroker/logs:/root/logs/rocketmqlogs
      - /opt/rocketmq/rmqbroker/conf/broker.conf:/opt/rocketmq-4.4.0/conf/broker.conf
    command: sh mqbroker -c ../conf/broker.conf
    environment:
      - JAVA_HOME=/usr/lib/jvm/jre
  console:
    image: styletang/rocketmq-console-ng
    container_name: rmq-console
    ports:
      - 9090:8080
    environment:
      - JAVA_OPTS= -Dlogging.level.root=info  -Drocketmq.namesrv.addr=192.168.4.55:9876;192.168.4.56:9876;192.168.4.57:9876
      - Dcom.rocketmq.sendMessageWithVIPChannel=false
```
注：里面的相关 ip 192.168.4.* 为我本地 ip , 实际部署，需改为服务器的 ip

### broker.conf 配置文件
```
namesrvAddr=192.168.4.55:9876;192.168.4.56:9876;192.168.4.57:9876
brokerIP1=192.168.4.55
brokerClusterName = DefaultCluster
brokerName = broker-a
brokerId = 0
deleteWhen = 04
fileReservedTime = 48
brokerRole = ASYNC_MASTER
```
注：配置文件路径需放在 docker-compose.yml 中 broker 配置文件路劲下
这里的 ip 需要更换为自己服务器的 ip, brokerIP1 最好设置，要不然 docker 自动获取为 172.2.xx.xx 会导致程序不能访问


## 构建镜像
```
docker-compose -f docker-compose.yml up -d
```

## 访问控制台
```
http://127.0.0.1:8080
```