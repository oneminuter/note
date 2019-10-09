# twemproxy 安装

## 编译安装
```shell
git clone https://github.com/twitter/twemproxy.git

cd twemproxy

sudo yum install -y autoconf automake libtool

autoreconf -fvi

./configure --prefix=/opt/twemproxy

make
```

## 启动
```shell
/opt/twemproxy/sbin/nutcracker -c /opt/twemproxy/conf/nutcracker.yml -p /opt/twemproxy/twemproxy.pid -o /opt/twemproxy/twemproxy.log -d
```