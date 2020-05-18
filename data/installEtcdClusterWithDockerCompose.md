# docker-compose 搭建 etcd 集群

单机上 docker 搭建 etcd 集群

## docker-compose.yml
```
version: '2'
services:
  etcd_1:
    image: bitnami/etcd:latest
    container_name: etcd_1
    environment:
      - ETCD_DATA_DIR=/etcd/data
      - ETCD_NAME=etcd_1
      - ETCD_INITIAL_ADVERTISE_PEER_URLS=http://${THIS_IP}:2380
      - ETCD_LISTEN_PEER_URLS=http://0.0.0.0:2380
      - ETCD_ADVERTISE_CLIENT_URLS=http://${THIS_IP}:2379
      - ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379
      - ETCD_INITIAL_CLUSTER=etcd_1=http://${THIS_IP}:2380,etcd_2=http://${THIS_IP}:3380,etcd_3=http://${THIS_IP}:4380
      - ETCD_INITIAL_CLUSTER_STATE=new
      - ETCD_INITIAL_CLUSTER_TOKEN=token-01
      - ETCD_AUTO_COMPACTION_RETENTION=1
      - ETCD_QUOTA_BACKEND_BYTES=8589934592
      - ALLOW_NONE_AUTHENTICATION=yes
      - ETCD_LOGGER=zap
    ports:
      - "2379:2379"
      - "2380:2380"
    volumes:
      - ./data/etcd_1:/etcd/data
  etcd_2:
    image: bitnami/etcd:latest
    container_name: etcd_2
    environment:
      - ETCD_DATA_DIR=/etcd/data
      - ETCD_NAME=etcd_2
      - ETCD_INITIAL_ADVERTISE_PEER_URLS=http://${THIS_IP}:3380
      - ETCD_LISTEN_PEER_URLS=http://0.0.0.0:3380
      - ETCD_ADVERTISE_CLIENT_URLS=http://${THIS_IP}:3379
      - ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:3379
      - ETCD_INITIAL_CLUSTER=etcd_1=http://${THIS_IP}:3380,etcd_2=http://${THIS_IP}:2380,etcd_3=http://${THIS_IP}:4380
      - ETCD_INITIAL_CLUSTER_STATE=new
      - ETCD_INITIAL_CLUSTER_TOKEN=token-01
      - ETCD_AUTO_COMPACTION_RETENTION=1
      - ETCD_QUOTA_BACKEND_BYTES=8589934592
      - ALLOW_NONE_AUTHENTICATION=yes
      - ETCD_LOGGER=zap
    ports:
      - "3379:3379"
      - "3380:3380"
    volumes:
      - ./data/etcd_2:/etcd/data
  etcd_3:
    image: bitnami/etcd:latest
    container_name: etcd_3
    environment:
      - ETCD_DATA_DIR=/etcd/data
      - ETCD_NAME=etcd_3
      - ETCD_INITIAL_ADVERTISE_PEER_URLS=http://${THIS_IP}:4380
      - ETCD_LISTEN_PEER_URLS=http://0.0.0.0:4380
      - ETCD_ADVERTISE_CLIENT_URLS=http://${THIS_IP}:4379
      - ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:4379
      - ETCD_INITIAL_CLUSTER=etcd_1=http://${THIS_IP}:4380,etcd_2=http://${THIS_IP}:3380,etcd_3=http://${THIS_IP}:2380
      - ETCD_INITIAL_CLUSTER_STATE=new
      - ETCD_INITIAL_CLUSTER_TOKEN=token-01
      - ETCD_AUTO_COMPACTION_RETENTION=1
      - ETCD_QUOTA_BACKEND_BYTES=8589934592
      - ALLOW_NONE_AUTHENTICATION=yes
      - ETCD_LOGGER=zap
    ports:
      - "4379:4379"
      - "4380:4380"
    volumes:
      - ./data/etcd_3:/etcd/data
```


## 启动

启动前设置 THIS_IP 变量
```
export THIS_IP=`ifconfig en0 | grep inet | grep netmask | awk '{print $2}'`

echo $THIS_IP

docker-compose down -v && rm -rf data && docker-compose up -d
```

注： 这个命令时是我 Mac 本地对应执行设置内网 ip, 然后重新构建 docker，线上 linux 需另外修改脚本



参数说明：
- data-dir：指定节点的数据存储目录，若不指定，则默认是当前目录。这些数据包括节点ID，集群ID，集群初始化配置，Snapshot文件，若未指定 –wal-dir，还会存储WAL文件
- wal-dir：指定节点的was文件存储目录，若指定了该参数，wal文件会和其他数据文件分开存储
- name：节点名称
- initial-advertise-peer-urls：告知集群其他节点的URL，tcp2380端口用于集群通信
- listen-peer-urls：监听URL，用于与其他节点通讯
- advertise-client-urls：告知客户端的URL, 也就是服务的URL，tcp2379端口用于监听客户端请求
- initial-cluster-token：集群的ID
- initial-cluster：集群中所有节点
- initial-cluster-state：集群状态，new为新创建集群，existing为已存在的集群etcd 默认存储大小限制是 2GB, 可以通过 --quota-backend-bytes 标记配置，最大支持 8GB

个人总结：带有 advertise 的，即为告诉其他节点的，配置为其他节点能访问的完整 url
注意点：ETCD_NAME 配置的值要和 ETCD_INITIAL_CLUSTER 里的对应，主要是暴露的端口