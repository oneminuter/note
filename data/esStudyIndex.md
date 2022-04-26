# es 学习笔记-索引

[TOC]

## 创建索引
```
PUT /${index_name}
{
	"settings": {

	},
	"mappings": {

	}
}
```
其中 
*index_name* : 为创建的目标索引名
*settings* : 索引相关配置项
*mappings* : 数据组织结构

设置配置示例：
```
PUT /hotel
{
	"settings": {
		"number_of_shards": 15   // 置顶主分片个数
		"number_of_replicas": 2  // 置顶副分片个数
	},
	"mappings": {
		"properties": {

		}
	}
}
```
*主分片个数* : 默认是 1
副分片个数：默认是 1

## 删除索引
```
DELETE /${index_name}
```

## 关闭索引
```
POST /${index_name}/_close
```
使用场景：在某些场景下，某个索引暂时不使用（不能写入数据和搜索），但后期又可能重新使用，这个索引在某一段时间内属于冷数据或者归档数据，这是可以使用索引的归档功能，索引关闭时，只能使用 ES 的 API 或者监控工具查看索引的元数据


## 打开索引
```
POST /${index_name}/_open
```
和上面的关闭索引的反向操作

## 索引别名
```
POST /_aliases
{
	"actions": [
		{
			"add": {
				"index": "${index_name1}",
				"alias": "${alias_name}"
			}
		},
		{
			"add": {
				"index": "${index_name2}",
				"alias": "${alias_name}"
			}
		}
	]
}
```
这里将多个索引的别名设为同一个，就可以使用别名取查询多个索引
使用场景：比如日志是按月存储，01、02、03 月，分别在三个索引当中，但是现在某个查询需要再最近的 3 个月的日志中查询，那么就可以使用别名查询，请求会分别发送到 3 个索引上

默认情况下，当一个别名指向一个索引时，写入数据请求可以指向索引别名，但是当这个别名指向多个索引时，则写入数据的请求是不可以指定这个别名

还有种使用场景，索引扩容，索引在创建之后，其许多配置就不能修改了，比如主分片个数，那么就可以使用索引别名将索引平滑迁移到新的索引上
```
POST /_aliases
{
	"actions": [
		{
			"remove": {
				"index": "${index_name1}",
				"alias": "${alias_name}"
			}
		},
		{
			"add": {
				"index": "${index_name2}",
				"alias": "${alias_name}"
			}
		}
	]
}
```
删除旧索引的别名，同时设置新的索引为相同别名，实现平滑迁移，客户端任然使用别名搜索，不受影响