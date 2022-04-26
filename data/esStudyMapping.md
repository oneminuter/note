# es 学习笔记-mappings

[TOC]

## 查看映射
```
GET /${index_name}/_mapping
```

已创建映射字段，一旦创建之后，就不能修改，因为修改会导致历史数据索引失效
但是能增加新的映射字段

## 基本数据类型

### keyword
是不进行切分的字符串类型，在搜索时，对该类型的查询字符串不进行切分后的部分的匹配, 完整匹配

### text
可进行切分的字符串类型

### 数值类型
long、integer、short、byte、double、float、half_float、scaled_float、unsigned_long

### 布尔类型
boolean: true 或 false

### 日期类型
date: ES 中存储的日期是标准的 UTC 格式
日期类型的默认格式: strict_date_optional_time || epoch_millis
*strict_date_optional_time*: 严格时间类型；
```
yyyy-MM-dd
yyyyMMdd
yyyyMMddHHmmss
yyyy-MM-ddTHH:mm:ss
yyyy-MM-ddTHH:mm:ss.SSS
yyyy-MM-ddTHH:mm:ss.SSSZ
```
*epoch_millis*: 的含义是从 1970 年 1 月 1 日 0 点到现在的毫秒数

日期类型默认不支持：
```
yyyy-MM-dd HH:mm:ss
``` 
如果需要使用这种格式，可以在创建 mappings 时设置自定义格式

```
PUT /hotel
{
	"mappings": {
		"properties": {
			"create_time": {
				"type": "date",
				"format": "yyyy-mm-dd HH:mm:ss" // 指定日期格式
			}
		}
	}
}
```