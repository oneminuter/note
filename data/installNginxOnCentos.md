# centos 安装 Nginx

## gcc 安装
```
yum install gcc-c++
```

## PCRE pcre-devel 安装
```
yum install -y pcre pcre-devel
```

## zlib 安装
```
yum install -y zlib zlib-devel
```

## OpenSSL 安装
```
yum install -y openssl openssl-devel
```

## 官网下载 nginx 安装包.tar.gz
[https://nginx.org/en/download.html]
```
wget https://nginx.org/download/nginx-1.14.0.tar.gz
```

## 解压 
```
tar -zxvf nginx-1.14.0.tar.gz
cd nginx-1.14.0
```

## 配置 & 编译安装
```
./configure
make
make install
```

## 启动、停止、重启 nginx
```
cd /usr/local/nginx/sbin/
./nginx 
./nginx -s stop
./nginx -s quit
./nginx -s reload
```
./nginx -s quit:此方式停止步骤是待nginx进程处理任务完毕进行停止。
./nginx -s stop:此方式相当于先查出nginx进程id再使用kill命令强制杀掉进程。