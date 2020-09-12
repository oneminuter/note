# nginx 负载均衡策略配置

## 轮询
```
upstream web-server {
    server 192.168.1.100;
    server 192.168.1.101;
}
```

## 权重
```
upstream web-server {
    server 192.168.1.100 weight=1;
    server 192.168.1.101 weight=2;
}
```

## IP哈希值
```
upstream web-server {
    ip_hash;
    server 192.168.1.100 weight=1;
    server 192.168.1.101 weight=2;
}
```

## 最少连接数目
```
upstream web-server {
    least_conn;
    server 192.168.1.100 weight=1;
    server 192.168.1.101 weight=2;
}
```

## 最短响应时间
```
upstream web-server {
    server 192.168.1.100 weight=1;
    server 192.168.1.101 weight=2;
    fair;  
}
```