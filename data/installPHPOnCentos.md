# centos 7 搭建nginx + php环境

假定您已经从源代码成功构建 Nginx，并且其二进制文件和配置文件都位于 /usr/local/nginx

## 获取并解压 PHP 源代码 [下载](http://php.net/downloads.php)
```shell
tar zxf php-x.x.x
```

## 配置并构建 PHP

在此步骤您可以使用很多选项自定义 PHP，例如启用某些扩展等。 运行 ./configure --help 命令来获得完整的可用选项清单。 在本示例中，我们仅进行包含 PHP-FPM 和 MySQL 支持的简单配置。
```shell
cd ../php-x.x.x
./configure  --enable-fpm --with-fpm-user=xiaolin --with-fpm-acl --enable-debug --enable-dba --enable-exif --enable-ftp --enable-embedded-mysqli --enable-sockets --enable-sysvmsg --enable-sysvsem --enable-sysvshm --enable-zend-test --enable-zip --enable-mysqlnd --without-pear
make
sudo make install
```

完整**./configure**
```shell
--enable-re2c-cgoto
--enable-fpm
--with-fpm-user=xiaolin
--with-fpm-acl
--with-litespeed
--enable-phpdbg
--enable-phpdbg-webhelper
--enable-phpdbg-debug
--enable-gcov
--enable-debug
--enable-sigchild
--enable-dmalloc
--enable-dtrace
--enable-fd-setsize
--with-system-ciphers
--with-pcre-jit
--enable-bcmath
--enable-calendar
--enable-dba
--enable-exif
--enable-ftp
--enable-gd-jis-conv
--enable-intl
--enable-mbstring
--enable-embedded-mysqli
--enable-pcntl
--enable-shmop
--enable-soap
--enable-sockets
--enable-sysvmsg
--enable-sysvsem
--enable-sysvshm
--enable-wddx
--enable-zend-test
--enable-zip
--enable-mysqlnd
--without-pear
--enable-maintainer-zts
--with-tsrm-pth=pth-config
--with-tsrm-st
--with-tsrm-pthreads
--with-gnu-ld
--with-pic
```


如果在 **./configure --enable-fpm --with-mysql**这步报 **configure: error: libxml2 not found. Please check your libxml2 installation.**， 执行下面命令安装 **libxml2-dev**
```shell
yum install libxml2-devel
```

## 创建配置文件，并将其复制到正确的位置
```shell
cp php.ini-development /usr/local/php/php.ini
cp /usr/local/etc/php-fpm.conf.default /usr/local/etc/php-fpm.conf
cp sapi/fpm/php-fpm /usr/local/bin
```

需要着重提醒的是，如果文件不存在，则阻止 Nginx 将请求发送到后端的 PHP-FPM 模块， 以避免遭受恶意脚本注入的攻击。

将 php.ini 文件中的配置项 cgi.fix_pathinfo 设置为 0

打开 php.ini
```shell
vim /usr/local/php/php.ini
```

定位到 cgi.fix_pathinfo= 并将其修改为如下所示

```shell
cgi.fix_pathinfo=0
```

在启动服务之前，需要修改 php-fpm.conf 配置文件，确保 php-fpm 模块使用 www-data 用户和 www-data 用户组的身份运行。
```shell
vim /usr/local/etc/php-fpm.conf
```

找到以下内容并修改：
```shell
; Unix user/group of processes
; Note: The user is mandatory. If the group is not set, the default user's group
;       will be used.
user = www-data
group = www-data
```

然后启动 php-fpm 服务：
```shell
/usr/local/bin/php-fpm
```

## 配置 Nginx 使其支持 PHP 应用

修改默认的 location 块，使其支持 .php 文件：

```shell
location / {
    root   html;
    index  index.php index.html index.htm;
}
```

下一步配置来保证对于 .php 文件的请求将被传送到后端的 PHP-FPM 模块， 取消默认的 PHP 配置块的注释，并修改为下面的内容：

```shell
location ~* \.php$ {
    fastcgi_index   index.php;
    fastcgi_pass    127.0.0.1:9000;
    include         fastcgi_params;
    fastcgi_param   SCRIPT_FILENAME    $document_root$fastcgi_script_name;
    fastcgi_param   SCRIPT_NAME        $fastcgi_script_name;
}
```

## 重启 Nginx
```shell
sudo /usr/local/nginx/sbin/nginx -s stop
sudo /usr/local/nginx/sbin/nginx
```


## 创建测试文件。
```shell
rm /usr/local/nginx/html/index.html
echo "<?php phpinfo(); ?>" >> /usr/local/nginx/html/index.php
```

打开浏览器，访问 http:\/\/localhost，将会显示 phpinfo() 

更多可用的选项， 请在对应的源代码目录执行 ./configure --help 来查阅更多配置选项
