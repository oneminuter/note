# centos 7 安装mysql

## 配置YUM源

在MySQL官网中下载YUM源rpm安装包：[mysql官网](http://dev.mysql.com/downloads/repo/yum/)

### 下载mysql源安装包
```shell
wget http://dev.mysql.com/get/mysql57-community-release-xxx.noarch.rpm
```

### 安装mysql源
```shell
yum localinstall mysql57-community-release-xxx.noarch.rpm
```

检查mysql源是否安装成功
```shell
yum repolist enabled | grep "mysql.*-community.*"
```

可以修改vim /etc/yum.repos.d/mysql-community.repo源，改变默认安装的mysql版本。比如要安装5.6版本，将5.7源的enabled=1改成enabled=0。然后再将5.6源的enabled=0改成enabled=1即可

## 安装MySQL
```shell
yum install mysql-community-server
```

## 启动MySQL服务
```shell
systemctl start mysqld
```

查看MySQL的启动状态
```shell
systemctl status mysqld
```

## 开机启动
```shell
systemctl enable mysqld
systemctl daemon-reload
```

## 修改root本地登录密码

mysql安装完成之后，在/var/log/mysqld.log文件中给root生成了一个默认密码。通过下面的方式找到root默认密码，然后登录mysql进行修改：

```shell
grep 'temporary password' /var/log/mysqld.log
```

```shell
mysql -uroot -p

ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!'

或者

set password for 'root'@'localhost'=password('MyNewPass4!')
```

## 添加远程登录用户

默认只允许root帐户在本地登录，如果要在其它机器上连接mysql，必须修改root允许远程连接，或者添加一个允许远程连接的帐户，为了安全起见，我添加一个新的帐户

```shell
GRANT ALL PRIVILEGES ON *.* TO 'yangxin'@'%' IDENTIFIED BY 'oneminuter@123!' WITH GRANT OPTION;
```

## 配置默认编码为utf8

修改/etc/my.cnf配置文件，在[mysqld]下添加编码配置

```shell
[mysqld]
character_set_server=utf8
init_connect='SET NAMES utf8'
```

重新启动mysql服务