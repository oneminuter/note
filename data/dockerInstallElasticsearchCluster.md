# docker 安装 elasticsearch + kibana 集群

## docker-compose.yml
```
version: "3"
services:
  elastic_01:
    image: elasticsearch:7.9.3
    container_name: elastic_01
    ports:
      - 9200:9200
      - 9300:9300
    volumes:
      - ./config/elasticsearch1.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - ./data/node1:/usr/share/elasticsearch/data
      - ./logs/node1:/usr/share/elasticsearch/logs
    environment:
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
  elastic_02:
    image: elasticsearch:7.9.3
    container_name: elastic_02
    ports:
      - 9201:9200
      - 9301:9300
    volumes:
      - ./config/elasticsearch2.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - ./data/node2:/usr/share/elasticsearch/data
      - ./logs/node2:/usr/share/elasticsearch/logs
    environment:
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    depends_on:
      - elastic_01
  kibana:
    image: kibana:7.9.3
    container_name: kibana
    volumes:
      - ./config/kibana.yml:/usr/share/kibana/config/kibana.yml
    environment:
      - KIBANA_ELASTICSEARCH_URL=elasticsearch_01:9201
    ports:
      - 5601:5601
    depends_on:
      - elastic_01
```

## elasticsearch node1 的配置文件内容 `./config/elasticsearch1.yml`
```
cluster.name: es-itcast-cluster
node.name: node01
network.host: 0.0.0.0
http.port: 9200
discovery.seed_hosts: ["172.16.22.41:9300","172.16.22.41:9301"] 
cluster.initial_master_nodes: ["node01", "node02"]
http.cors.enabled: true
http.cors.allow-origin: "*"
```
备注：里面 172.16.22.41 需替换为自己本机的局域网 id

## elasticsearch node2 的配置文件内容 `./config/elasticsearch2.yml`
```
cluster.name: es-itcast-cluster
node.name: node02
network.host: 0.0.0.0
http.port: 9201
discovery.seed_hosts: ["172.16.22.41:9300", "172.16.22.41:9301"] 
cluster.initial_master_nodes: ["node01", "node02"]
http.cors.enabled: true
http.cors.allow-origin: "*"
```
备注：里面 172.16.22.41 需替换为自己本机的局域网 id


## kibana 配置文件内容：`./config/kibana.yml`
```
server.name: kibana
server.host: "0"
elasticsearch.hosts: [ "http://172.16.22.41:9200" ]
monitoring.ui.container.elasticsearch.enabled: true
```
备注：里面 172.16.22.41 需替换为自己本机的局域网 id

## 启动
```
docker-compose up -d
```

稍过一会，elasticesearch 启动完成之后，可访问：http://localhost:5601/ 访问 kibana