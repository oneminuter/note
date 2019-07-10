# centos 删掉 docker0 虚拟网卡

# 停止 docker 服务
```
service docker stop
```

# 用 ip 命令使 docker0 网卡 down 掉
```
ip link set dev docker0 down
```

# 删除网卡
```
brctl delbr docker0
```
