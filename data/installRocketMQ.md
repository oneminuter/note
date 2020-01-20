# 手动搭建 RocketMQ

[TOC]

## 安装 JDK
建议安装 jdk 1.8

## 下载 RocketMQ
访问 [RocketMQ官网](http://rocketmq.apache.org/dowloading/releases/) 下载

## 解压
```shell
unzip rocketmq-all-4.6.0-source-release.zip
cd rocketmq-all-4.6.0/
```


## 启动 NameServer
```shell
nohup sh bin/mqnamesrv &
```

确认 NameServer 启动
```shell
> tail -f ~/logs/rocketmqlogs/namesrv.log
  The Name Server boot success...
```

## 启动 Broker
```shell
nohup sh bin/mqbroker -n localhost:9876 -c conf/broker.conf &
```

确认 Broker 启动
```shell
> tail -f ~/logs/rocketmqlogs/broker.log 
  The broker[%s, 172.30.30.233:10911] boot success...
```

## 停止服务

### 停止 Broker
```shell
> sh bin/mqshutdown broker
The mqbroker(36695) is running...
Send shutdown request to mqbroker(36695) OK
```

### 停止 NamerServer
```shell
> sh bin/mqshutdown namesrv
The mqnamesrv(36664) is running...
Send shutdown request to mqnamesrv(36664) OK
```