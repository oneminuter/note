# mongo 常用命令

[TOC]

## 连接 mongo 
```shell
./bin/mongo --host [host] --port 37017 --username [user] --password [password]
```

## 查看当前的操作
```
db.currentOp()
```

## kill 操作
```
db.killOp(opid)
```

## 查看当前链接
```
db.serverStatus().connections;
```

## 备份数据库
```
./mongodump --host [host] --port [port] --authenticationDatabase admin -u [user] -p [password] -d [db_name] -c [collection] -o [dist_dir]
```

## 还原数据
```
./mongorestore -h 127.0.0.1:27017 --db [db_name] --collection [collection] [bsonfile]
```