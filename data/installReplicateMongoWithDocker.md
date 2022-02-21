# docker 搭建 mongo 复制集集群

[TOC]

## 准备配置文件
mongo 配置文件 config.yaml
```
security:
    keyFile: /data/configdb/authkey.pem
    authorization: enabled
replication:
    replSetName: rs_app_core_db
```

## 生成证书
使用 openssl 生成 mongo 的认证证书
```
openssl rand -base64 756 > authkey.pem
```

## docker-compose 文件
docker-compose.yaml
```
version: "3"
services:
  mongo:
    image: mongo:latest
    container_name: mongo
    ports:
      - 27017:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: test1234
    volumes:
      - ./data:/data/db
      - ./config.yaml:/data/configdb/config.yaml
      - ./authkey.pem:/data/configdb/authkey.pem
    command: mongod --auth --bind_ip_all --config /data/configdb/config.yaml
  mongo-express:
    image: mongo-express
    container_name: mongo-express
    restart: always
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: test1234
```

使用 `docker-compose up -d` 启动 MongoDB

## 初始化集群
使用 mongo 客户端链接 MongoDB (自行到 mongo 官网下载客户端）
```
> bin/mongo 127.0.0.1:27017
> use admin
> db.auth("root","test1234")
> rs.initiate()
```

## 其他命令

查看配置
```
rs.conf()
```

添加成员
```
rs.add("127.0.0.1:27018")
```