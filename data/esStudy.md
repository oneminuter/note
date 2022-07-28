# es 知识总结

[TOC]

## Elasticsearch简介
Lucene基础之上的分布式准实时搜索引擎
REST风格的API接口
聚合功能
X-Pack进行用户验证
ELK“全家桶”

## 基本概念
1.索引
2.文档
3.字段
4.映射：建立索引时需要定义文档的数据结构，这种结构叫作映射
5.分片：ES的每个索引设置为5个分片。
6.DSL：（Domain Specific Language，领域特定语言）采用JSON进行表达

## 和关系型数据库的对比
1.索引方式：倒排索引
2.事务支持：ES是不支持事务的，使用乐观锁 + 文档版本号

## 节点职责
master节点: 负责维护整个集群的相关工作，管理集群的变更，如创建/删除索引、节点健康状态监测、节点上/下线等,一个集群中只有一个节点可以成为master节点
数据节点: 负责索引数据的保存工作
协调节点:客户端可以向ES集群的节点发起请求，这个节点叫作协调节点
![协调节点1](https://res.weread.qq.com/wrepub/epub_41517156_5)

为了降低集群的负载，可以设置某些节点作为单独的协调节点。在节点的配置文件中设置node.master和node.data配置项为false
![协调节点2](https://res.weread.qq.com/wrepub/epub_41517156_6)



## 主分片和副分片
![主分片和副分片1](https://res.weread.qq.com/wrepub/epub_41517156_4)
![主分片和副分片2](https://res.weread.qq.com/wrepub/epub_41517156_7)
![主分片和副分片3](https://res.weread.qq.com/wrepub/epub_41517156_8)

那么ES又是如何提升服务的高并发性能的呢？  
当客户端对某个索引的请求被分发到ES的协调节点时，协调节点会将请求进行转发，转发的对象是包含这个索引的所有分片的部分节点。协调节点中有一份分片-节点路由表，该表主要存放分片和节点的对应关系。协调节点采用轮询算法，选取该索引的主/副分片所在的节点进行请求转发。一个索引的主分片设定后就不能再修改，如果想继续提升索引的并发性能，则可以增加索引的副分片个数，此时协调节点会将这些副分片加入轮询算法中

## 路由计算
协调节点根据数据获取分片ID的计算公式如下：
```
shard=hash（routing）% number_of_primary_shards
```
routing代表每条文档提交时的参数，该值是可变的，用户可以自定义，在默认情况下使用的是文档的_id值
number_of_primary_shards是索引中主分片的个数


## 文档读写过程
ES写文档的过程：
![文档读写过程1](https://res.weread.qq.com/wrepub/epub_41517156_9)
ES读文档的过程：
![文档读写过程2](https://res.weread.qq.com/wrepub/epub_41517156_10)

## 创建索引
```
curl -H "Content-Type: application/json" -XPUT  http://127.0.0.1:9200/hotel  -d 
{ 
    "mappings":{ 
        "properties":{           //指定字段名称及其数据类型 
            "title":{ 
                "type":"text"    //title字段为text类型 
            }, 
            "city":{ 
               "type":"keyword"   //city字段为keyword类型 
            }, 
            "price":{ 
                "type":"double"   //price字段为double类型 
            } 
        } 
    } 
}
```
同上
```
PUT /hotel 
{ 
    "mappings":{ 
        "properties":{           //指定字段名称及其数据类型 
            "title":{ 
                "type":"text"    //title字段为text类型 
            }, 
            "city":{ 
               "type":"keyword"   //city字段为keyword类型 
            }, 
            "price":{ 
                "type":"double"   //price字段为double类型 
            } 
        } 
    } 
}
```
创建索引，设置分片
```
PUT /hotel 
{  
    "settings" : { 
        "number_of_shards" : 15,    //指定主分片个数 
        "number_of_replicas" : 2    //指定副分片个数 
    }, 
    "mappings":{ 
        "properties":{ 
            … 
        } 
    } 
}
```

## 删除索引
```
DELETE /${index_name}
```

## 关闭索引
```
POST /hotel/_close
```

## 打开索引
```
POST /hotel/_open 
```

## 查看索引
```
GET /hotel 
```

## 写入文档
```
POST /hotel/_doc/001 
{ 
	"title":"好再来酒店", 
	"city":"青岛", 
	"price":578.23 
}
```

## 查看文档
```
GET /hotel/_doc/001 
```

## 根据一般字段搜索文档
语法：
```
GET /${index_name}/_search 
{ 
 "query": {                          //查询内容 
    … 
  } 
}

```
根据价格搜索文档 
```
GET /hotel/_search 
{ 
  "query": { 
    "term": { 
      "price": {                                   
        "value": 578.23 
      } 
    } 
  } 
}
```

## 根据文本字段搜索文档
根据title字段搜索 
```
GET /hotel/_search 
{ 
  "query": { 
   "match": {                                    
      "title": "再来" 
    } 
  } 
}
```

## 索引别名
![索引别名1](https://res.weread.qq.com/wrepub/epub_41517156_24)

### 创建 3 个索引
```
PUT /january_log
{ 
    "mappings":{ 
        "properties":{ 
            "uid":{
                "type":"keyword" 
            }, 
            "hotel_id":{
                "type":"keyword" 
            }, 
            "check_in_date":{
                "type":"keyword" 
            } 
        } 
    } 
}
```

### 写入的文档数据
```
POST /january_log/_doc/001 
{                                     
  "uid":"001", 
  "hotel_id":"92772", 
  "check_in_date":"2021-01-05" 
}

POST /february_log/_doc/001 
{
  "uid":"001", 
  "hotel_id":"33224", 
  "check_in_date":"2021-02-23" 
}

POST /march_log/_doc/001 
{                               
  "uid":"001", 
  "hotel_id":"92772", 
  "check_in_date":"2021-03-28" 
}
```

### 创建别名
```
POST /_aliases 
{ 
  "actions": [ 
    { 
      "add": {   //为索引january_log建立别名last_three_month 
        "index": "january_log", 
        "alias": "last_three_month" 
      } 
    }, 
    { 
      "add": {   //为索引february_log建立别名last_three_month 
        "index": "february_log", 
        "alias": "last_three_month" 
      } 
    }, 
    { 
      "add": {   //为索引march_log建立别名last_three_month 
        "index": "march_log", 
        "alias": "last_three_month" 
      } 
    } 
  ] 
}
```

### 使用别名搜索
```
GET /last_three_month/_search 
{ 
  "query": { 
    "term": {
      "uid": "001" 
    } 
  } 
}
```

### 借助别名进行索引替代
![借助别名进行索引替代](https://res.weread.qq.com/wrepub/epub_41517156_25)

## 映射操作
### 查看映射
```
GET /${index_name}/_mapping  
```

### 基本的数据类型
keyword
text
数值类型: long、integer、short、byte、double、float、half_float、scaled_float 和 unsigned_long
布尔类型
布尔类型(date)
数组类型
```
# 写入字符串数组数据 
POST /hotel/_doc/001 
{
  "title":"好再来酒店", 
  "city":"青岛", 
  "price":578.23, 
  "tag":["有车位","免费WIFI"]
}

# 使用term搜索数组类型的数据 
GET /hotel/_search 
{ 
  "query": { 
   "term": {
      "tag": { 
        "value": "有车位" 
      } 
    } 
  } 
}
```
地理类型
```
PUT /hotel 
{ 
  "mappings": { 
    "properties": { 
      "title": { 
        "type": "text" 
      }, 
      "city": { 
        "type": "keyword" 
      }, 
      "price": { 
        "type": "double" 
      }, 
      "create_time": { 
        "type": "date" 
      }, 
      "location": {                 //定义字段location，类型为geo_point 
        "type": "geo_point" 
      } 
    } 
  } 
}  

POST /hotel/_doc/001 
{ 
  "title": "文雅酒店", 
  "city": "北京", 
  "price": 556, 
  "create_time": "2021-01-15", 
 "location": {                      //写入geo_point类型数据，lat为纬度，lon为经度 
    "lat": 40.012134, 
    "lon": 116.497553 
  } 
}  
```
