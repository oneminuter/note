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