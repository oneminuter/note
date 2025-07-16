# mysql 数据导入导出

[TOC]

## 导出源数据库
```
mysqldump --host=[数据库地址] --port=3306 -u [用户名] -p [源数据库名] > dump.sql
```

## 复制一个库到新库

### 创建目标数据库
```
mysql --host=[数据库地址] --port=3306 -u [用户名] -p -e "CREATE DATABASE [新数据库名]"
```

### 导入到新数据库
```
mysql --host=[数据库地址] --port=3306 -u [用户名] -p [新数据库名] < dump.sql
```

## 纯 SQL 方式将一个库的数据复制到另外一个库

### 创建新数据库
先连接到数据库
```
CREATE DATABASE [new_database];
```

### 复制表结构和数据
```
USE [new_database];
CREATE TABLE [table1] LIKE [old_database.table1];
INSERT INTO [table1] SELECT * FROM [old_database.table1];
```
