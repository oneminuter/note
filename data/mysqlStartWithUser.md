# 启动 mysql 报错

## 报错信息
```
Please read "Security" section of the manual to find out how to run mysqld as root!
```

## 启动方式
```
mysqld --user=root --daemonize --explicit_defaults_for_timestamp
```

`--daemonize` 是放在后天执行


## 或者配置 my.cnf
配置my.cnf，加入 user=root 意思是使用用户名 root 运行 mysqld 服务器
```
[mysqld]
#
# Remove leading # and set to the amount of RAM for the most important data
# cache in MySQL. Start at 70% of total RAM for dedicated server, else 10%.
# innodb_buffer_pool_size = 128M
#
# Remove leading # to turn on a very important data integrity option: logging
# changes to the binary log between backups.
# log_bin
#
# Remove leading # to set options mainly useful for reporting servers.
# The server defaults are faster for transactions and fast SELECTs.
# Adjust sizes as needed, experiment to find the optimal values.
# join_buffer_size = 128M
# sort_buffer_size = 2M
# read_rnd_buffer_size = 2M
#default-character-set = utf8
#character-set-server = utf8
port=3406
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock

# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0

log-error=/var/log/sunpy.err
pid-file=/var/run/mysqld/mysqld.pid
user=mysql
```