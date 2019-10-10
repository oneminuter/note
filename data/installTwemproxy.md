# twemproxy 安装

## 编译安装
```shell
git clone https://github.com/twitter/twemproxy.git

cd twemproxy

sudo yum install -y autoconf automake libtool

autoreconf -fvi

./configure --prefix=/opt/twemproxy

make
```

## 配置文件
可以拷贝源码下的 `conf/nutcracker.yml` 来修改
```
alpha:
  listen: 0.0.0.0:22121
  hash: fnv1a_64
  distribution: ketama
  auto_eject_hosts: true
  redis: true
  redis_auth: 'abcdefghijklmnopqrstuvwxyz123456'
  server_retry_timeout: 2000
  server_failure_limit: 1
  servers:
   - 192.168.1.33:8888:1 server1
   - 192.168.1.34:8888:1 server2
   - 192.168.1.35:8888:1 server3
```

## 启动
```shell
/opt/twemproxy/sbin/nutcracker -c /opt/twemproxy/conf/nutcracker.yml -p /opt/twemproxy/twemproxy.pid -o /opt/twemproxy/twemproxy.log -d
```

## 命令参数详解
```
Options:
-h, –help                        : 查看帮助文档，显示命令选项
-V, –version                     : 查看nutcracker版本
-t, –test-conf                   : 测试配置脚本的正确性
-d, –daemonize                   : 以守护进程运行
-D, –describe-stats              : 打印状态描述
-v, –verbosity=N                 : 设置日志级别 (default: 5, min: 0, max: 11)
-o, –output=S                    : 设置日志输出路径，默认为标准错误输出 (default: stderr)
-c, –conf-file=S                 : 指定配置文件路径 (default: conf/nutcracker.yml)
-s, –stats-port=N                : 设置状态监控端口，默认22222 (default: 22222)
-a, –stats-addr=S                : 设置状态监控IP，默认0.0.0.0 (default: 0.0.0.0)
-i, –stats-interval=N            : 设置状态聚合间隔 (default: 30000 msec)
-p, –pid-file=S                  : 指定进程pid文件路径，默认关闭 (default: off)
-m, –mbuf-size=N                 : 设置mbuf块大小，以bytes单位 (default: 16384 bytes)
```

## 配置详解

### listen
twemproxy监听的端口。可以以ip:port或name:port的形式来书写

### hash
可以选择的key值的hash算法：
one_at_a_time
md5
crc16
crc32 (crc32 implementation compatible with libmemcached)
crc32a (correct crc32 implementation as per the spec)
fnv1_64
fnv1a_64
fnv1_32
fnv1a_32
hsieh
murmur
jenkins

默认是fnv1a_64

### hash_tag
hash_tag允许根据key的一个部分来计算key的hash值。hash_tag由两个字符组成，一个是hash_tag的开始，另外一个是hash_tag的结束，在hash_tag的开始和结束之间，是将用于计算key的hash值的部分，计算的结果会用于选择服务器

### distribution
存在ketama、modula和random3种可选的配置。其含义如下

ketama
ketama一致性hash算法，会根据服务器构造出一个hash ring，并为ring上的节点分配hash范围。ketama的优势在于单个节点添加、删除之后，会最大程度上保持整个群集中缓存的key值可以被重用

modula
modula非常简单，就是根据key值的hash值取模，根据取模的结果选择对应的服务器

random
random是无论key值的hash是什么，都随机的选择一个服务器作为key值操作的目标

### redis
是一个boolean值，用来识别到服务器的通讯协议是redis还是memcached。默认是false

### server_connections
每个server可以被打开的连接数。默认，每个服务器开一个连接。

### auto_eject_hosts
是一个boolean值，用于控制twemproxy是否应该根据server的连接状态重建群集。这个连接状态是由server_failure_limit阀值来控制。
默认是false

### server_retry_timeout
单位是毫秒，控制服务器连接的时间间隔，在auto_eject_host被设置为true的时候产生作用。默认是30000 毫秒

### server_failure_limit
控制连接服务器的次数，在auto_eject_host被设置为true的时候产生作用。默认是1

###servers
redis实例列表，一定要加别名，否则默认使用ip:port:weight来计算分片，如果宕机后更换机器，那么分片就不一样了，因此加了别名后，可以确保分片一定是准确的

### timeout
单位是毫秒，是连接到server的超时值。默认是永久等待

### backlog
监听TCP 的backlog（连接等待队列）的长度，默认是512