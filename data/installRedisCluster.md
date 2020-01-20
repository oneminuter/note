# redis 搭建集群

[TOC]

先决条件是安装了 redis

## 配置文件
配置6个节点，把 redis.conf 复制 6 份，分别命名为 6379 ~ 6384 .conf, 每份文件对应改配置

```shell
port  7000                             //端口7000,7002,7003        
bind 本机ip                             //默认ip为127.0.0.1 需要改为其他节点机器可访问的ip
daemonize    yes                       //redis后台运行
pidfile  /var/run/redis_7000.pid       //pidfile文件对应7000,7001,7002
cluster-enabled  yes                   //开启集群  把注释#去掉
cluster-config-file  nodes_7000.conf   //集群的配置  配置文件首次启动自动生成 7000,7001,7002
cluster-node-timeout  15000            //请求超时  默认15秒，可自行设置
appendonly  yes                        //aof日志开启  有需要就开启，它会每次写操作都记录一条日志　
protected-mode no
```

## 分别启动 redis
```shell
bin/redis-server 6379.conf
bin/redis-server 6380.conf
bin/redis-server 6381.conf
bin/redis-server 6382.conf
bin/redis-server 6383.conf
bin/redis-server 6384.conf
```

## 创建 cluster
```shell
redis-cli --cluster create \
127.0.0.1:6379 \
127.0.0.1:6380 \
127.0.0.1:6381 \
127.0.0.1:6382 \
127.0.0.1:6383 \
127.0.0.1:6384 \
--cluster-replicas 1
```

## 集群验证
```shell
redis-cli -h 127.0.0.1 -c -p 6379  // 加参数 -C 可连接到集群
```


## 原理
redis cluster在设计的时候，就考虑到了去中心化，去中间件，也就是说，集群中的每个节点都是平等的关系，都是对等的，每个节点都保存各自的数据和整个集群的状态。每个节点都和其他所有节点连接，而且这些连接保持活跃，这样就保证了我们只需要连接集群中的任意一个节点，就可以获取到其他节点的数据。

Redis 集群没有并使用传统的一致性哈希来分配数据，而是采用另外一种叫做哈希槽 (hash slot)的方式来分配的。redis cluster 默认分配了 16384 个slot，当我们set一个key 时，会用CRC16算法来取模得到所属的slot，然后将这个key 分到哈希槽区间的节点上，具体算法就是：CRC16(key) % 16384。所以我们在测试的时候看到set 和 get 的时候，直接跳转到了7000端口的节点。

Redis 集群会把数据存在一个 master 节点，然后在这个 master 和其对应的salve 之间进行数据同步。当读取数据时，也根据一致性哈希算法到对应的 master 节点获取数据。只有当一个master 挂掉之后，才会启动一个对应的 salve 节点，充当 master 。

需要注意的是：`必须要3个或以上的主节点，否则在创建集群时会失败`，并且当存活的主节点数小于总节点数的一半时，整个集群就无法提供服务了


## 常见报错

### 启动集群报没有 ruby
执行命令安装
```shell
yum -y install ruby ruby-devel rubygems rpm-build
gem install redis
```

### [ERR] Not all 16384 slots are covered by nodes.
不是所有的slot都被节点覆盖到，官方的建议是使用fix修复
```shell
redis-cli --cluster fix
```
检查集群状态slots详细分配

```shell
redis-cli --cluster check host:port
```

### [ERR] Node 127.0.0.1:6379 is not empty. Either the node already knows other nodes (check with CLUSTER NODES) or contains some key in database 0.
redis服务实例上的数据不为空，因此逐个实例连接，执行flushdb，清空数据

### 主从实例分配不对，比如有4个主节点，导致两个主节点没slave
执行下面命令，检查集群状态
```shell
redis-cli --cluster info 127.0.0.1:6382
```
关闭所有服务实例  
找到对应的nodes-port.conf文件，删除  
重新执行创建 cluster 命令

### (error) CLUSTERDOWN Hash slot not served
没有分配槽，因为redis集群要分配16384个槽来储存数据，那么没有分配槽则报如上错误
Can I set the above configuration? (type 'yes' to accept): 
你需要输入yes,而并非缩写 y，因为玩linux的都习惯的会输入 y，但是这里不行，要全拼yes才可以。
就是这个错误引起的分配槽失败。
