# 容器时区问题

利用docker发布服务，发现程序用获取的系统时间比正常时间晚了8个小时
进入容器 docker exec [CONTAINER] -it /bin/sh
查询时间 date -R
发现时区为0时区

## 解决方式
将 /etc/localtime 挂载进容器
docer-compose 配置文件示例：
```
version: "3"
services:
  my-server:
    image: my-server:latest
    container_name: my-server
    ports:
      - 9147:9147
    command: /go/src/build-app/my-server
    volumes:
      - /etc/localtime:/etc/localtime  # 增加这行
    restart: always
```