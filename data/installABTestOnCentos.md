# centos 安装 appach ab 压力测试工具

Apache安装包中自带的压力测试工具 Apache Benchmark(简称ab) 简单易用。ab运行需要依赖apr-util包，若没有，需要先安装。Apache工具包可以使用命令yumdownloader来完成，yumdownloader是yum-utils包下面的，如果没有安装yum-utils，则需要先安装它

查看apr-util, yum-utils是否安装：
```
rpm -qa|grep apr-util

rpm -qa|grep yum-utils
```

若在命令执行后有结果列出，则说明已安装

否则用yum安装

```
sudo yum -y install apr-util

sudo yum -y install yum-utils
```

建个临时目录来保存下载的安装包，并按如下顺序执行目录

```
mkdir abtmp

cd abtmp

yumdownloader httpd-tools*

rpm2cpio httpd-tools-*.rpm |cpio -idmv

ll usr/bin/ab

-rwxr-xr-x 1 ytadmin ytadmin 50248 Oct 1622:49 usr/bin/ab

sudo cp usr/bin/ab /usr/bin

```

执行ab命令，应列出使用说明信息, 
删除下载的其他内容，可删除整个abtmp目录
至此，ab安装完成。