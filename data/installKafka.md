# kafka 安装

[TOC]

## 下载
[官网](http://kafka.apache.org/downloads)
下载 .tgz 包到服务器

## 安装
kafka需要 java 运行环境，所以需要先装好 jdk
让后解压下载的 .tgz 到任意目录

### 安装 zookeeper

配置 config/zookeeper.properties
```shell
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/data/zk/data/zookeeper  //数据附录
dataLogDir=/data/zk/data/logs    //日志目录
clientPort=2181                  //zookeeper 端口
maxClientCnxns=60
autopurge.snapRetainCount=3
autopurge.purgeInterval=1
 
server.1=zk01:2888:3888
server.2=zk02:2888:3888
server.3=zk03:2888:3888
```

其中最后 3 行配置 server.id=host:port:port: 表示了不同的 zookeeper 服务器的自身标识，作为集群的一部分，每一台服务器应该知道其他服务器的信息
这一样配置中，zoo1代表第一台服务器的IP地址。第一个端口号（port）是从follower连接到leader机器的端口，第二个端口是用来进行leader选举时所用的端口。
所以，在集群配置过程中有三个非常重要的端口：clientPort：2181、port:2888、port:3888

在服务器的 data(dataDir 参数所指定的目录)下创建一个文件名为 myid 的文件，这个文件的内容只有一行，指定的是自身的 id 值。比如，服务器“1”应该在myid文件中写入“1”。这个id必须在集群环境中服务器标识中是唯一的，且大小在1～255之间。

在启动服务之前，还需要分别在zookeeper创建myid，方式如下:
```shell
echo 1 >  /data/zk/data/zookeeper/myid
```

### 启动 zookeeper
```shell
bin/zookeeper-server-start.sh config/zookeeper.properties
```



### 配置 kafka
修改配置 config/server.properties 
```shell
broker.id=0 //需要修改为唯一标识
delete.topic.enable=true
listeners=PLAINTEXT://192.168.15.131:9092
num.network.threads=3
num.io.threads=8
socket.send.buffer.bytes=102400
socket.receive.buffer.bytes=102400
socket.request.max.bytes=104857600
log.dirs=/data/kafka/data // 日志地址
num.partitions=1
num.recovery.threads.per.data.dir=1
offsets.topic.replication.factor=1
transaction.state.log.replication.factor=1
transaction.state.log.min.isr=1
log.flush.interval.messages=10000
log.flush.interval.ms=1000
log.retention.hours=168
log.retention.bytes=1073741824
log.segment.bytes=1073741824
log.retention.check.interval.ms=300000
zookeeper.connect=192.168.15.131:2181,192.168.15.132:2181,192.168.15.133:2181 //需要修改为 zookeeper 地址
zookeeper.connection.timeout.ms=6000
group.initial.rebalance.delay.ms=0
```

### 启动服务
```shell
kafka-server-start.sh config/server.properties
```



## 验证服务

### 创建 topic
```shell
bin/kafka-topics.sh \
--create --zookeeper 192.168.15.131:2181,192.168.15.132:2181,192.168.15.133:2181 \
--replication-factor 1 \
--partitions 1 \
--topic test
```
--replication-factor 2：副本集数量，不能大于 broker 节点数量
--partition 4：分区数


### 查看 topic 列表
```shell
bin/kafka-topics.sh --list \
--zookeeper 192.168.15.131:2181,192.168.15.132:2181,192.168.15.133:2181
```

### 创建消费者
```shell
bin/kafka-console-consumer.sh \
--bootstrap-server localhost:9092 \
--topic test \
--from-beginning
```

### 创建生产者
```shell
bin/kafka-console-producer.sh \
--broker-list localhost:9092 \
--topic test
```

### 生产者列表
```shell
bin/kafka-console-producer.sh \
--broker-list localhost:9092 \
--topic test
```

### 查询集群描述
```shell
bin/kafka-topics.sh --describe --zookeeper 
```

### 显示某个消费组的消费详情（仅支持offset存储在zookeeper上的）
```shell
bin/kafka-run-class.sh kafka.tools.ConsumerOffsetChecker \
--zookeeper localhost:2181 \
--group test
```

### 显示某个消费组的消费详情（支持0.9版本+）
```shell
bin/kafka-consumer-groups.sh \
--new-consumer \
--bootstrap-server localhost:9092 \
--describe \
--group test-consumer-group
```

### 查看数据堆积
```shell
bin/kafka-consumer-groups.sh \
--bootstrap-server 172.17.147.13:9092 \
--group dna-data-p200-r3-1-consumer-1 \
--describe
```
可以看到订阅的 topic，负责的 partition，消费进度 offset, 积压的消息LAG。

### 查看消费组/消费者
```shell
bin/kafka-consumer-groups.sh \
--new-consumer \
--bootstrap-server localhost:9092,localhost:9093 \
--list
```

### 新生产者（支持0.9版本+）
```shell
bin/kafka-console-producer.sh \
--broker-list localhost:9092 \
--topic test \
--producer.config config/producer.properties
```

### 新消费者（支持0.9版本+）
```shell
bin/kafka-console-consumer.sh \
--bootstrap-server localhost:9092 \
--topic test \
--new-consumer \
--from-beginning \
--consumer.config config/consumer.properties
```

### 高级点的用法
```shell
bin/kafka-simple-consumer-shell.sh \
--brist localhost:9092 \
--topic test \
--partition 0 \
--offset 1234  \
--max-messages 10
```

### 平衡 leader
```shell
bin/kafka-preferred-replica-election.sh \
--zookeeper zk_host:port/chroot
```