# mysql添加索引

## 添加PRIMARY KEY（主键索引）
```shell
ALTER TABLE `table_name` ADD PRIMARY KEY ( `column` ) 
```

## 添加UNIQUE(唯一索引) 
```shell
ALTER TABLE `table_name` ADD UNIQUE ( `column`) 
```

## 添加INDEX(普通索引)
```shell
ALTER TABLE `table_name` ADD INDEX index_name ( `column` ) 
```

## 添加FULLTEXT(全文索引) 
```
ALTER TABLE `table_name` ADD FULLTEXT ( `column`) 
```

## 添加多列索引
```shell
ALTER TABLE `table_name` ADD INDEX index_name ( `column1`, `column2`, `column3` )
```shell