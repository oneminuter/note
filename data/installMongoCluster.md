# mongo 集群搭建

[TOC]

单机搭建 mongodb 分布式集群(副本集 + 分片集群)

在同一个 vm 启动由两个分片组成的分布式集群，每个分片都是一个 PSS(Primary-Secondary-Secondary) 模式的数据副本集；
Config 副本集采用 PSS(Primary-Secondary-Secondary) 模式

## 一. 准备工作

### 1. 下载安装包

```shell
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-4.0.10.tgz
```

### 2. 部署目录

/opt/local/mongo-cluster

```shell
tar -xzvf mongodb-linux-x86_64-rhel70-3.6.3.tgz
mkdir -p  /opt/local/mongo-cluster
cp -r mongodb-linux-x86_64-4.0.10/bin  /opt/local/mongo-cluster
```

### 3. 创建配置文件

```shell
cd /opt/local/mongo-cluster
mkdir conf 
```

#### A. mongod 配置文件 mongo_node.conf
mongo_node.conf 作为mongod实例共享的配置文件，内容如下, yaml 格式

```shell
storage:
  engine: wiredTiger
  directoryPerDB: true
  journal:
    enabled: true
systemLog:
  destination: file
  logAppend: true
operationProfiling:
  slowOpThresholdMs: 10000
replication:
  oplogSizeMB: 10240
processManagement:
  fork: true
net:
  bindIp: 127.0.0.1
  port: 27018
security:
  authorization: "enabled"
```

#### B. mongos 配置文件 mongos.conf

```shell
systemLog:
  destination: file
  logAppend: true
processManagement:
  fork: true
net:
  bindIp: 0.0.0.0
 ```

### 4. 创建keyfile文件

```shell
cd /opt/local/mongo-cluster
mkdir keyfile
openssl rand -base64 756 > mongo.key
chmod 400 mongo.key
mv mongo.key keyfile
```

### 5. 创建节点目录

```shell
WORK_DIR=/opt/local/mongo-cluster
mkdir -p $WORK_DIR/nodes/config/n1/data
mkdir -p $WORK_DIR/nodes/config/n2/data
mkdir -p $WORK_DIR/nodes/config/n3/data

mkdir -p $WORK_DIR/nodes/shard1/n1/data
mkdir -p $WORK_DIR/nodes/shard1/n2/data
mkdir -p $WORK_DIR/nodes/shard1/n3/data

mkdir -p $WORK_DIR/nodes/shard2/n1/data
mkdir -p $WORK_DIR/nodes/shard2/n2/data
mkdir -p $WORK_DIR/nodes/shard2/n3/data

mkdir -p $WORK_DIR/nodes/mongos/n1
mkdir -p $WORK_DIR/nodes/mongos/n2
mkdir -p $WORK_DIR/nodes/mongos/n3
```

### 二、搭建集群

#### 1. Config 副本集

按以下脚本启动 3 个 Config 实例

```shell
WORK_DIR=/opt/local/mongo-cluster
KEYFILE=$WORK_DIR/keyfile/mongo.key
CONFFILE=$WORK_DIR/conf/mongo_node.conf
MONGOD=$WORK_DIR/bin/mongod

$MONGOD --port 26001 --configsvr --replSet configReplSet --keyFile $KEYFILE --dbpath $WORK_DIR/nodes/config/n1/data --pidfilepath $WORK_DIR/nodes/config/n1/db.pid --logpath $WORK_DIR/nodes/config/n1/db.log --config $CONFFILE

$MONGOD --port 26002 --configsvr --replSet configReplSet --keyFile $KEYFILE --dbpath $WORK_DIR/nodes/config/n2/data --pidfilepath $WORK_DIR/nodes/config/n2/db.pid --logpath $WORK_DIR/nodes/config/n2/db.log --config $CONFFILE

$MONGOD --port 26003 --configsvr --replSet configReplSet --keyFile $KEYFILE --dbpath $WORK_DIR/nodes/config/n3/data --pidfilepath $WORK_DIR/nodes/config/n3/db.pid --logpath $WORK_DIR/nodes/config/n3/db.log --config $CONFFILE
```

#### 2.连接其中一个 Config 进程，执行副本集初始化

```shell
./bin/mongo --port 26001 --host 127.0.0.1
> MongoDB shell version v4.0.10
> cfg={
    _id:"configReplSet", 
    configsvr: true,
    members:[
        {_id:0, host:'127.0.0.1:26001'},
        {_id:1, host:'127.0.0.1:26002'}, 
        {_id:2, host:'127.0.0.1:26003'}
    ]};
rs.initiate(cfg);
```
其中 `configsvr:true` 指明这是一个用于分片集群的 Config 副本集。


#### 3. 创建分片

按以下脚本启动 `Shard1` 的 3 个实例

```shell
WORK_DIR=/opt/local/mongo-cluster
KEYFILE=$WORK_DIR/keyfile/mongo.key
CONFFILE=$WORK_DIR/conf/mongo_node.conf
MONGOD=$WORK_DIR/bin/mongod

$MONGOD --port 27001 --shardsvr --replSet shard1 --keyFile $KEYFILE --dbpath $WORK_DIR/nodes/shard1/n1/data --pidfilepath $WORK_DIR/nodes/shard1/n1/db.pid --logpath $WORK_DIR/nodes/shard1/n1/db.log --config $CONFFILE

$MONGOD --port 27002 --shardsvr --replSet shard1 --keyFile $KEYFILE --dbpath $WORK_DIR/nodes/shard1/n2/data --pidfilepath $WORK_DIR/nodes/shard1/n2/db.pid --logpath $WORK_DIR/nodes/shard1/n2/db.log --config $CONFFILE

$MONGOD --port 27003 --shardsvr --replSet shard1 --keyFile $KEYFILE --dbpath $WORK_DIR/nodes/shard1/n3/data --pidfilepath $WORK_DIR/nodes/shard1/n3/db.pid --logpath $WORK_DIR/nodes/shard1/n3/db.log --config $CONFFILE
```

连接其中一个 Shard 进程，执行 `shard1` 副本集初始化

```shell
./bin/mongo --port 27001 --host 127.0.0.1
> MongoDB shell version v4.0.10
> cfg={
    _id:"shard1", 
    members:[
        {_id:0, host:'127.0.0.1:27001'},
        {_id:1, host:'127.0.0.1:27002'}, 
        {_id:2, host:'127.0.0.1:27003'}
    ]};
rs.initiate(cfg);
```

按以下脚本启动 Shard2 的 3 个实例

```shell
WORK_DIR=/opt/local/mongo-cluster
KEYFILE=$WORK_DIR/keyfile/mongo.key
CONFFILE=$WORK_DIR/conf/mongo_node.conf
MONGOD=$WORK_DIR/bin/mongod

$MONGOD --port 28001 --shardsvr --replSet shard2 --keyFile $KEYFILE --dbpath $WORK_DIR/nodes/shard2/n1/data --pidfilepath $WORK_DIR/nodes/shard2/n1/db.pid --logpath $WORK_DIR/nodes/shard2/n1/db.log --config $CONFFILE

$MONGOD --port 28002 --shardsvr --replSet shard2 --keyFile $KEYFILE --dbpath $WORK_DIR/nodes/shard2/n2/data --pidfilepath $WORK_DIR/nodes/shard2/n2/db.pid --logpath $WORK_DIR/nodes/shard2/n2/db.log --config $CONFFILE

$MONGOD --port 28003 --shardsvr --replSet shard2 --keyFile $KEYFILE --dbpath $WORK_DIR/nodes/shard2/n3/data --pidfilepath $WORK_DIR/nodes/shard2/n3/db.pid --logpath $WORK_DIR/nodes/shard2/n3/db.log --config $CONFFILE
```

连接其中一个 Shard 进程，执行 `shard2` 副本集初始化

```shell
./bin/mongo --port 28001 --host 127.0.0.1
> MongoDB shell version v4.0.10
> cfg={
    _id:"shard2", 
    members:[
        {_id:0, host:'127.0.0.1:28001'},
        {_id:1, host:'127.0.0.1:28002'}, 
        {_id:2, host:'127.0.0.1:28003'}
    ]};
rs.initiate(cfg);
```

#### 4. 启动 mongos 路由
执行以下脚本启动 3 个 mongos 进程

```shell
WORK_DIR=/opt/local/mongo-cluster
KEYFILE=$WORK_DIR/keyfile/mongo.key
CONFFILE=$WORK_DIR/conf/mongos.conf
MONGOS=$WORK_DIR/bin/mongos

$MONGOS --port=25001 --configdb configReplSet/127.0.0.1:26001,127.0.0.1:26002,127.0.0.1:26003 --keyFile $KEYFILE --pidfilepath $WORK_DIR/nodes/mongos/n1/db.pid --logpath $WORK_DIR/nodes/mongos/n1/db.log --config $CONFFILE

$MONGOS --port 25002 --configdb configReplSet/127.0.0.1:26001,127.0.0.1:26002,127.0.0.1:26003 --keyFile $KEYFILE --pidfilepath $WORK_DIR/nodes/mongos/n2/db.pid --logpath $WORK_DIR/nodes/mongos/n2/db.log --config $CONFFILE

$MONGOS --port 25003 --configdb configReplSet/127.0.0.1:26001,127.0.0.1:26002,127.0.0.1:26003 --keyFile $KEYFILE --pidfilepath $WORK_DIR/nodes/mongos/n3/db.pid --logpath $WORK_DIR/nodes/mongos/n3/db.log --config $CONFFILE
```

接入其中一个 mongos 实例，执行添加分片操作：

```shell
./bin/mongo --port 25001 --host 127.0.0.1
mongos> MongoDB shell version v4.0.10
mongos> sh.addShard("shard1/127.0.0.1:27001")
{ "shardAdded" : "shard1", "ok" : 1 }
mongos> sh.addShard("shard2/127.0.0.1:27004")
{ "shardAdded" : "shard2", "ok" : 1 }
```

至此，分布式集群架构启动完毕

---

#### 5. 初始化用户

```shell
use admin
db.createUser({
    user:'admin',pwd:'Admin@01',
    roles:[
        {role:'clusterAdmin',db:'admin'},
        {role:'userAdminAnyDatabase',db:'admin'},
        {role:'dbAdminAnyDatabase',db:'admin'},
        {role:'readWriteAnyDatabase',db:'admin'}
]})
```
当前 admin 用户具有集群管理权限、所有数据库的操作权限。
需要注意的是，在第一次创建用户之后，localexception 不再有效，接下来的所有操作要求先通过鉴权。

```shell
use admin
db.auth('admin','Admin@01')
```

#### 6.检查集群状态

```shell
mongos> sh.status()
```
集群用户
分片集群中的访问都会通过 mongos 入口，而鉴权数据是存储在 config 副本集中的，即 config 实例中 system.users 数据库存储了集群用户及角色权限配置。mongos 与 shard 实例则通过内部鉴权 (keyfile机制) 完成，因此 shard 实例上可以通过添加本地用户以方便操作管理。在一个副本集上，只需要在 Primary 节点上添加用户及权限，相关数据会自动同步到 Secondary 节点。


### 数据操作
创建 appuser 用户、为数据库实例 appdb 启动分片。

```shell
use appdb
db.createUser({user:'appuser',pwd:'AppUser@01',roles:[{role:'dbOwner',db:'appdb'}]})
sh.enableSharding("appdb")
或
db.runCommand({ enablesharding:"appdb" });
```

创建集合 book，为其执行分片初始化。

```shell
use appdb
db.createCollection("book")
db.book.ensureIndex({createTime:1})
sh.shardCollection("appdb.book", {bookId:"hashed"}, false, { numInitialChunks: 4} )
或
db.runCommand({ shardcollection: "appdb.book", key: {'bookId':"hashed"} });
```

继续往 book 集合写入 10W 条记录，观察 chunks 的分布情况

```shell
use appdb
var cnt = 0;
for(var i=0; i<1000; i++){
    var dl = [];
    for(var j=0; j<100; j++){
        dl.push({
                "bookId" : "BBK-" + i + "-" + j,
                "type" : "Revision",
                "version" : "IricSoneVB0001",
                "title" : "oneminuter's Life",
                "subCount" : 10,
                "location" : "China CN GuiZhou PingTang District",
                "author" : {
                      "name" : "oneminuter",
                      "email" : "oneminuter@163.com",
                      "gender" : "male"
                },
                "createTime" : new Date()
            });
      }
      cnt += dl.length;
      db.book.insertMany(dl);
      print("insert ", cnt);
}
```

观察 chunks 的分布情况
```shell
db.book.getShardDistribution()
```

参考文章：https://www.cnblogs.com/littleatp/p/8563273.html  
参考的文章使用的是 `3.4.7` 版本，本文使用的是 `v4.0.10`， 配置文件有改动