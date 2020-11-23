# docker 安装 elasticsearch 和 head 插件


## clone head 代码：
```
git clone git://github.com/mobz/elasticsearch-head.git
```

## 构建 elasticsearch-head docker 镜像
```
cd elasticsearch-head
docker build -f ./Dockerfile-alpine . -t elasticsearch-head
```

## 启动 container
docker-compose.yml 文件：
```
version: "3"
services:
  elasticsearch:
    image: elasticsearch:latest
    container_name: elasticsearch
    ports:
      - 9200:9200
      - 9300:9300
    volumes:
      - ./config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - ./data:/usr/share/elasticsearch/data
      - ./logs:/usr/share/elasticsearch/logs
    environment:
      - discovery.type=single-node
  elasticsearch-head:
    image: elasticsearch-head:latest
    container_name: elasticsearch-head
    ports:
      - 9100:9100
    volumes:
      - ./plugin/head/app.js:/usr/src/app/_site/app.js
```

## 解决 head 访问跨域问题
1. 修改 elasticsearch 配置文件 config/elasticsearch.yml，增加下面两行
```
http.cors.enabled: true
http.cors.allow-origin: "*"
```

2. 修改 head 文件下的 app.js 文件
```
this.base_uri = this.config.base_uri || this.prefs.get("app-base_uri") || "http://[es 服务的 ip]:9200"; // 修改此行
```

重启镜像即可，让后访问：http://localhost:9100