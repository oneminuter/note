# ocker-compose 在 3 个节点上搭建 elasticsearch + kibana 本机集群

[TOC]

延续上一篇，在本机上大家 elasticsearch + kibana 集群，本篇在 3 个节点上实践搭建

## 环境
- os: ubuntu
- docker (20.10.11)
- docker-compose (v2.3.3 此时的最新版)
- nodeIp: 192.168.13.65、192.168.13.64、192.168.13.63

## 安装
分别在（192.168.13.65、192.168.13.64、192.168.13.63）上创建文件夹 elasticsearch  
进入文件夹，创建 `.env` 文件
```
# Password for the 'elastic' user (at least 6 characters)
ELASTIC_PASSWORD=abcdef

# Password for the 'kibana_system' user (at least 6 characters)
KIBANA_PASSWORD=abcdef

# Version of Elastic products
STACK_VERSION=8.1.0

# Set the cluster name
CLUSTER_NAME=docker-elastic-cluster

# Set to 'basic' or 'trial' to automatically start the 30-day trial
LICENSE=basic
#LICENSE=trial

# Port to expose Elasticsearch HTTP API to the host
ES_PORT=9200
#ES_PORT=127.0.0.1:9200

# Port to expose Kibana to the host
KIBANA_PORT=5601
#KIBANA_PORT=80

# Increase or decrease based on the available host memory (in bytes)
MEM_LIMIT=1073741824

# Project namespace (defaults to the current folder name if not set)
#COMPOSE_PROJECT_NAME=myproject
```

在 `192.168.1.3` 创建 `docker-compose.yaml`
```
version: "3"

services:
  setup:
    image: docker.elastic.co/elasticsearch/elasticsearch:${STACK_VERSION}
    volumes:
      - ./certs:/usr/share/elasticsearch/config/certs
    user: "0"
    command: >
      bash -c '
        if [ x${ELASTIC_PASSWORD} == x ]; then
          echo "Set the ELASTIC_PASSWORD environment variable in the .env file";
          exit 1;
        elif [ x${KIBANA_PASSWORD} == x ]; then
          echo "Set the KIBANA_PASSWORD environment variable in the .env file";
          exit 1;
        fi;
        if [ ! -f certs/ca.zip ]; then
          echo "Creating CA";
          bin/elasticsearch-certutil ca --silent --pem -out config/certs/ca.zip;
          unzip config/certs/ca.zip -d config/certs;
        fi;
        if [ ! -f certs/certs.zip ]; then
          echo "Creating certs";
          echo -ne \
          "instances:\n"\
          "  - name: es01\n"\
          "    dns:\n"\
          "      - es01\n"\
          "      - 192.168.13.65\n"\
          "    ip:\n"\
          "      - 192.168.13.65\n"\
          "  - name: es02\n"\
          "    dns:\n"\
          "      - es02\n"\
          "      - 192.168.13.64\n"\
          "    ip:\n"\
          "      - 192.168.13.64\n"\
          "  - name: es03\n"\
          "    dns:\n"\
          "      - es03\n"\
          "      - 192.168.13.63\n"\
          "    ip:\n"\
          "      - 192.168.13.63\n"\
          > config/certs/instances.yml;
          bin/elasticsearch-certutil cert --silent --pem -out config/certs/certs.zip --in config/certs/instances.yml --ca-cert config/certs/ca/ca.crt --ca-key config/certs/ca/ca.key;
          unzip config/certs/certs.zip -d config/certs;
        fi;
        echo "Setting file permissions"
        chown -R root:root config/certs;
        find . -type d -exec chmod 750 \{\} \;;
        find . -type f -exec chmod 640 \{\} \;;
        echo "Waiting for Elasticsearch availability";
        until curl -s --cacert config/certs/ca/ca.crt https://es01:9200 | grep -q "missing authentication credentials"; do sleep 30; done;
        echo "Setting kibana_system password";
        until curl -s -X POST --cacert config/certs/ca/ca.crt -u elastic:${ELASTIC_PASSWORD} -H "Content-Type: application/json" https://es01:9200/_security/user/kibana_system/_password -d "{\"password\":\"${KIBANA_PASSWORD}\"}" | grep -q "^{}"; do sleep 10; done;
        echo "All done!";
      '
    healthcheck:
      test: ["CMD-SHELL", "[ -f config/certs/es01/es01.crt ]"]
      interval: 1s
      timeout: 5s
      retries: 120

  es01:
    depends_on:
      - setup
    image: docker.elastic.co/elasticsearch/elasticsearch:${STACK_VERSION}
    volumes:
      - ./certs:/usr/share/elasticsearch/config/certs
      - ./esdata01:/usr/share/elasticsearch/data
    ports:
      - ${ES_PORT}:9200
      - 9300:9300
    extra_hosts:
      - "es01:192.168.13.65"
      - "es02:192.168.13.64"
      - "es03:192.168.13.63"
    environment:
      - node.name=es01
      - network.publish_host=192.168.13.65
      - cluster.name=${CLUSTER_NAME}
      - cluster.initial_master_nodes=192.168.13.65,192.168.13.64,192.168.13.63
      - discovery.seed_hosts=192.168.13.64,192.168.13.63
      - ELASTIC_PASSWORD=${ELASTIC_PASSWORD}
      - bootstrap.memory_lock=true
      - xpack.security.enabled=true
      - xpack.security.http.ssl.enabled=true
      - xpack.security.http.ssl.key=certs/es01/es01.key
      - xpack.security.http.ssl.certificate=certs/es01/es01.crt
      - xpack.security.http.ssl.certificate_authorities=certs/ca/ca.crt
      - xpack.security.http.ssl.verification_mode=certificate
      - xpack.security.transport.ssl.enabled=true
      - xpack.security.transport.ssl.key=certs/es01/es01.key
      - xpack.security.transport.ssl.certificate=certs/es01/es01.crt
      - xpack.security.transport.ssl.certificate_authorities=certs/ca/ca.crt
      - xpack.security.transport.ssl.verification_mode=certificate
      - xpack.license.self_generated.type=${LICENSE}
    mem_limit: ${MEM_LIMIT}
    ulimits:
      memlock:
        soft: -1
        hard: -1
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "curl -s --cacert config/certs/ca/ca.crt https://localhost:9200 | grep -q 'missing authentication credentials'",
        ]
      interval: 10s
      timeout: 10s
      retries: 120

  kibana:
    depends_on:
      - es01
    image: docker.elastic.co/kibana/kibana:${STACK_VERSION}
    volumes:
      - ./certs:/usr/share/kibana/config/certs
      - ./kibanadata:/usr/share/kibana/data
    ports:
      - ${KIBANA_PORT}:5601
    environment:
      - SERVERNAME=kibana
      - ELASTICSEARCH_HOSTS=https://es01:9200
      - ELASTICSEARCH_USERNAME=kibana_system
      - ELASTICSEARCH_PASSWORD=${KIBANA_PASSWORD}
      - ELASTICSEARCH_SSL_CERTIFICATEAUTHORITIES=config/certs/ca/ca.crt
    mem_limit: ${MEM_LIMIT}
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "curl -s -I http://localhost:5601 | grep -q 'HTTP/1.1 302 Found'",
        ]
      interval: 10s
      timeout: 10s
      retries: 120
```

在 `192.168.1.4` 创建 `docker-compose.yaml`
```
version: "3"

services:
  es02:
    image: docker.elastic.co/elasticsearch/elasticsearch:${STACK_VERSION}
    ports:
      - 9300:9300
    volumes:
      - ./certs:/usr/share/elasticsearch/config/certs
      - ./esdata02:/usr/share/elasticsearch/data
    extra_hosts:
      - "es01:192.168.13.65"
      - "es02:192.168.13.64"
      - "es03:192.168.13.63"
    environment:
      - node.name=es02
      - network.publish_host=192.168.13.64
      - cluster.name=${CLUSTER_NAME}
      - cluster.initial_master_nodes=192.168.13.65,192.168.13.64,192.168.13.63
      - discovery.seed_hosts=192.168.13.65,192.168.13.63
      - bootstrap.memory_lock=true
      - xpack.security.enabled=true
      - xpack.security.http.ssl.enabled=true
      - xpack.security.http.ssl.key=certs/es02/es02.key
      - xpack.security.http.ssl.certificate=certs/es02/es02.crt
      - xpack.security.http.ssl.certificate_authorities=certs/ca/ca.crt
      - xpack.security.http.ssl.verification_mode=certificate
      - xpack.security.transport.ssl.enabled=true
      - xpack.security.transport.ssl.key=certs/es02/es02.key
      - xpack.security.transport.ssl.certificate=certs/es02/es02.crt
      - xpack.security.transport.ssl.certificate_authorities=certs/ca/ca.crt
      - xpack.security.transport.ssl.verification_mode=certificate
      - xpack.license.self_generated.type=${LICENSE}
    mem_limit: ${MEM_LIMIT}
    ulimits:
      memlock:
        soft: -1
        hard: -1
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "curl -s --cacert config/certs/ca/ca.crt https://localhost:9200 | grep -q 'missing authentication credentials'",
        ]
      interval: 10s
      timeout: 10s
      retries: 120
```

在 `192.168.1.5` 创建 `docker-compose.yaml`
```
version: "3"

services:
  es03:
    image: docker.elastic.co/elasticsearch/elasticsearch:${STACK_VERSION}
    volumes:
      - ./certs:/usr/share/elasticsearch/config/certs
      - ./esdata03:/usr/share/elasticsearch/data
    ports:
      - 9300:9300
    extra_hosts:
      - "es01:192.168.13.65"
      - "es02:192.168.13.64"
      - "es03:192.168.13.63"
    environment:
      - node.name=es03
      - network.publish_host=192.168.13.63
      - cluster.name=${CLUSTER_NAME}
      - cluster.initial_master_nodes=192.168.13.65,192.168.13.64,192.168.13.63
      - discovery.seed_hosts=192.168.13.65,192.168.13.64
      - bootstrap.memory_lock=true
      - xpack.security.enabled=true
      - xpack.security.http.ssl.enabled=true
      - xpack.security.http.ssl.key=certs/es03/es03.key
      - xpack.security.http.ssl.certificate=certs/es03/es03.crt
      - xpack.security.http.ssl.certificate_authorities=certs/ca/ca.crt
      - xpack.security.http.ssl.verification_mode=certificate
      - xpack.security.transport.ssl.enabled=true
      - xpack.security.transport.ssl.key=certs/es03/es03.key
      - xpack.security.transport.ssl.certificate=certs/es03/es03.crt
      - xpack.security.transport.ssl.certificate_authorities=certs/ca/ca.crt
      - xpack.security.transport.ssl.verification_mode=certificate
      - xpack.license.self_generated.type=${LICENSE}
    mem_limit: ${MEM_LIMIT}
    ulimits:
      memlock:
        soft: -1
        hard: -1
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "curl -s --cacert config/certs/ca/ca.crt https://localhost:9200 | grep -q 'missing authentication credentials'",
        ]
      interval: 10s
      timeout: 10s
      retries: 120
```

先在 node1 上执行 `docker-compose up -d`
因为 node1 包含生成 cert 证书文件，将生成的 certs 文件夹拷贝到另外两台 node 主机的对应的创建的 elasticsearch 文件夹下  
然后再分别再 node2、node3 主机上执行 `docker-compose up -d`


## 遇到问题

- 报错 max virtual memory areas vm.max_map_count [65530] is too low，xxx  

修改 node 主机的 `/etc/sysctl.con`，加入
```
vm.max_map_count=655360
```

然后执行
```
sysctl -p
```
再重新启动容器

---

- java.lang.IllegalStateException: failed to obtain node locks, tried [/usr/share/elasticsearch/data]; maybe these locations are not writable or multiple nodes were started on the same data path?  

可能生成的数据挂在目录（esdata01/02/03）权限不对，查看了下改目录所属的用户和组为 root，修改为当前用户
```
chown xiaolin:xiaolin -R esdata01
```
这里的用户 和 用户组，根据实际情况修改

---

- master not discovered yet, this node has not previously joined a bootstrapped cluster, and xxx
因为是用 docker 部署的，网络获取的 ip 是 docker 内部的 ip (172.30.0.3)，在 docker-compose.yaml 的 es 服务加如下配置就可以了
```
    environment:
      ...
      - network.publish_host=192.168.13.63 # 改为对应 node 的 ip
      ...
```