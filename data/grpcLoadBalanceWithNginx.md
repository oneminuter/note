# nginx 做 grpc 负载均衡

## 概述
grpc负载均衡有主要有进程内balance, 进程外balance, proxy 三种方式，本文叙述的是proxy方式，以前进程内的方式比较流行，靠etcd或者consul等服务发现来轮询，随机等方式实现负载均衡。

现在nginx 1.13过后正式支持grpc, 由于nginx稳定，高并发量，功能强大，更难能可贵的是部署方便，并且不像进程内balance那样不同的语言要写不同的实现，因此我非常推崇这种方式。


配置 nginx.conf
```
upstream lb {
    server 192.168.1.10:8081;
    server 192.168.1.10:8082;
    server 192.168.1.10:8083;
    keepalive 500; # nginx和rpc服务器群保持长连接的总数，设置可以提高效率，同时避免nginx到rpc服务器之间默认是短连接并发过后造成time_wait过多
}

server {
    listen    9090    http2;
    access_log  /var/log/nginx/host.access.log  main;
    http2_max_requests 10000; #这里默认是1000，并发量上来会报错，因此设置大一点
    grpc_socket_keepalive on; #这个东西nginx1.5过后支持

    location / {
        grpc_pass grpc://lb;
        error_page 502 = /error502grpc;
    }

    location = /error502grpc {
        internal;
        default_type application/grpc;
        add_header grpc-status 14;
        add_header grpc-message "Unavailable";
        return 204;
    }
}
```

nginx 可以使用 docker 安装, docker-compose.yml 安装如下
```
version: '2'
services:
  nginx:
#   image: nginx:latest
    image: nginx:1.17.10-alpine
    container_name: nginx
    volumes:
      - /opt/nginx/html:/usr/share/nginx/html
      - /opt/nginx/conf/nginx.conf:/etc/nginx/nginx.conf
      - /opt/nginx/conf/conf.d:/etc/nginx/conf.d
      - /opt/nginx/log:/var/log/nginx
    ports:
      - 90:80
      - 9090:9090  # 和上面 nginx.conf 配置的监听端口一致
    restart: always
```