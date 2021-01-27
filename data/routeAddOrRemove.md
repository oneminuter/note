# 添加、删除路由

[TOC]

## linux 添加路由
```
route add -net 10.244.0.0/16 gw 192.168.1.1
```

## linux 删除路由
```
route del -net 10.244.0.0/16 netmask 255.255.255.0
```

## mac 添加路由
```
sudo route -n add 10.244.0.0/16 192.168.1.1
```

## mac 删除路由
```
sudo route delete 10.244/16
```

为保证系统/网络重启后，路由依然存在，需要写入静态配置文件 /etc/network/interfaces
```
up route add -net 10.244.0.0 netmask 255.255.0.0 gw 192.168.1.1 ens3  (⚠️：ens3 是网卡，以实际为准）
up route add -net 10.0.0.0 netmask 255.255.255.0 gw 192.168.1.1 ens3
```

## 扩展

查看路由表
```
netstat -nr
```

查看请求路由
```
traceroute [ip]
```