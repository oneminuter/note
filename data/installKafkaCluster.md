# kafka 搭建集群

## 复制三分 zookeeper 节点配置
```shell
cp config/zookeeper.properties config/zookeeper.2181.properties
cp config/zookeeper.properties config/zookeeper.2182.properties
cp config/zookeeper.properties config/zookeeper.2183.properties
```

## 修改 zookeeper 配置
config/zookeeper.2181.properties
```shell
# the directory where the snapshot is stored.
dataDir=/tmp/zookeeper/2181
# the port at which the clients will connect
clientPort=2181
# disable the per-ip limit on the number of connections since this is a non-production config
maxClientCnxns=0
tickTime=2000
initLimit=10
syncLimit=5
server.1=localhost:12888:13888
server.2=localhost:22888:23888
server.3=localhost:32888:33888
```

config/zookeeper.2182.properties 修改clientPort=2182 dataDir=/tmp/zookeeper/2182 其他一致
config/zookeeper.2183.properties 修改clientPort=2183 dataDir=/tmp/zookeeper/2183 其他一致

主要是修改服务端口clientPort和数据目录dataDir，其他参数表征如下：
tickTime=2000为zk的基本时间单元，毫秒
initLimit=10Leader-Follower初始通信时限（tickTime*10)
syncLimit=5Leader-Follower同步通信时限（tickTime*5)
server.实例集群标识=实例地址:数据通信端口:选举通信端口

## 为 zookeeper 实例添加集群标识
```shell
echo 1 >> /tmp/zookeeper/2181/myid
echo 2 >> /tmp/zookeeper/2182/myid
echo 3 >> /tmp/zookeeper/2183/myid
```

## 启动 zookeeper 集群服务
```
bin/zookeeper-server-start.sh config/zookeeper.2181.properties
bin/zookeeper-server-start.sh config/zookeeper.2182.properties
bin/zookeeper-server-start.sh config/zookeeper.2183.properties
```

## 搭建 Kafka 集群
Kafka集群节点>=2时便可对外提供高可用服务

```shell
cp config/server.properties config/server.9092.properties
cp config/server.properties config/server.9093.properties
```

## 修改 kafka 配置
修改节点标识、服务端口、数据目录和zk集群节点列表 config/server.9092.properties
```shell
broker.id=1  # 保证唯一
...
listeners=PLAINTEXT://:9092 # 端口
...
log.dirs=/tmp/kafka-logs/1 # 日志目录
...
zookeeper.connect=localhost:2181,localhost:2182,localhost:2183 # zookeeper 链接地址
```

## 启动 kafka 集群
```shell
bin/kafka-server-start.sh config/server.9092.properties
bin/kafka-server-start.sh config/server.9093.properties
```

## 创建topic
```
bin/kafka-topics.sh --create \
--zookeeper localhost:2181,localhost:2182,localhost:2183 \
--replication-factor 2 \
--partition 4 \
--topic topic_1
```

## 查看topic列表
```shell
bin/kafka-topics.sh \
--zookeeper localhost:2181,localhost:2182,localhost:2183 --list
```

## 查看Topic详情
```shell
bin/kafka-topics.sh \
--zookeeper localhost:2181,localhost:2182,localhost:2183 \
--describe --topic topic_1
```

## 删除Topic
只是删除Topic在zk的元数据，日志数据仍需手动删除。
```shell
bin/kafka-topics.sh \
--zookeeper localhost:2181,localhost:2182,localhost:2183 \
--delete --topic topic_2
```
