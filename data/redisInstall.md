# centos 7 安装 redis

## 下载
[官网下载](https://redis.io/download)

以 redis-4.0.10.tar.gz 为例

## 解压
```shell
tar -zxvf redis-4.0.10.tar.gz
```

## 编译
```shell
cd redis-4.0.10
make && make install
```

如果系统没有c++编译，则需安装gcc
```shell
yum install -y gcc
```

## 启动 
```shell
cd src
./redis-server
```

制定配置文件
```shell
./redis-server ../redis.conf
```

这里的 redis.conf 文件在上层目录中，即 redis-4.0.10解压目录下

## 设置密码
修改 redis.conf 文件, 找到 requirepass 行，去掉前面的注释，并修改后面的密码为自己的密码

```shell
# requirepass foobared

改为:

requirepass YourPassword
```

## 链接
```shell
./redis-cli 
```

## 带密码链接
```shell
./redis-cli -a RedisPassword
```

## 链接远程redis
```shell
./redis-cli -h Host -p Port -a RedisPassword
```
