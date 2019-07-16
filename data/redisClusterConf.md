# redis集群配置
```shell
port 6379
daemonize yes
pidfile /var/run/redis_6379.pid
cluster-enabled yes
cluster-config-file nodes_6379.conf
cluster-node-timeout 5000
appendonly yes
protected-mode no
```

# 如果是 docker 部署，需要加
```shell
cluster-announce-ip 0.0.0.0 //要宣布的IP地址。
cluster-announce-port 7000 //要宣布的数据端口。
cluster-announce-bus-port 17000 //要宣布的集群总线端口
```