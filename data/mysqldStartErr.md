# mysqld 启动数据库报错

报错信息
```
Fatal error: Please read "Security" section of the manual to find out how to run mysqld as root!
```

解决办法：
在命令后面加上 `--user root`
```
mysqld --user root
```