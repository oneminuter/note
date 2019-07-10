# ssdb 安装

```shell
wget --no-check-certificate https://github.com/ideawu/ssdb/archive/master.zip
unzip master
cd ssdb-master
make

# 将安装在 /usr/local/ssdb 目录下
sudo make install
```

如果你想安装 ssdb 在其它的目录, 不在 /usr/local 目录下, 可以这样

```shell
sudo make install PREFIX=/your/direcotry
```


## 启动和停止

```shell
# 启动主库, 此命令会阻塞住命令行
./ssdb-server ssdb.conf

# 或者启动为后台进程(不阻塞命令行)
./ssdb-server -d ssdb.conf

# 停止 ssdb-server
./ssdb-server ssdb.conf -s stop
# 对于旧版本
kill `cat ./var/ssdb.pid`

# 重启
./ssdb-server ssdb.conf -s restart
```

## 问题解决

1. 执行 `make` 的时候报：`ERROR! autoconf required! install autoconf first`

解决方法，先安装 `autoconf`

```shell
# centos
yum install -y autoconf

# ubuntu
sudo apt-get install -y autoconf
```