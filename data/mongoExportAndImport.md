# mongo 数据导出导入

[TOC]

## 下载工具
需要使用到工具 mongoexport 和 mongoimport
[工具下载地址](https://www.mongodb.com/try/download/database-tools)

## mongoexport 导出
```
./mongoexport --host=localhost --port=27017 --username=root --password=test1234 --authenticationDatabase=admin --db=live --collection=robot --type=json  --out=./live-robot.json
```

## mongoimport 导入
```
./mongoimport --host=localhost --port=27017 --username=root --password=test1234 --authenticationDatabase=admin --db=live --collection=robot --type=json  --file=./live-robot.json
```
`--drop` 参数是在导入前先删除对应表

mongoexport 和 mongoimport 需要指定表才能导入导出，并且不能导出索引
如果是要导入导出整个库，需要使用 mongodump 和 mongorestore

## mongodump 导出
```
./mongodump --host=localhost --port=27017 --username=root --password=test1234 --authenticationDatabase=admin --db=live --gzip --archive=./db.backup.gz
```
  - 1.这里使用 `--archive` 导出到单个文件，也可以使用 `--out=[<directory-path>]` 的形式导出到一个文件夹下，这样每个表都会有对应单独的 .bson 和 .metadata 文件，在使用 mongorestore 恢复的时候，就可以指定要恢复的表
  - 2.这里只指定 `--db` 没有指定 `--collection`，表示导出整个库，下面 mongorestore 同理

## mongorestore 导入
```
./mongorestore --host=localhost --port=27017 --username=root --password=test1234 --authenticationDatabase=admin --db=live --gzip --archive=./db.backup.gz
```
`--drop` 参数是在导入前先删除对应表