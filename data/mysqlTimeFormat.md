# Mysql 时间格式化

[TOC]

## 时间转字符串
```shell
SELECT  date_format(now(), "%Y-%m-%d %H:%i:%s %W");
```

## 时间转时间戳
```shell
SELECT unix_timestamp();
SELECT unix_timestamp(now());
```

## 字符串转时间戳
```shell
SELECT unix_timestamp("2018-07-24 14:59:27");
```

## 字符串转时间
```shell
SELECT str_to_date("2018-07-24 15:00:00", "%Y-%m-%d %H:%i:%s");
```

## 时间戳转时间
```shell
SELECT from_unixtime(1532415567);
```

## 时间戳转字符串
```shell
SELECT from_unixtime(1532415567, "%Y-%m-%d %H:%i:%s");
```