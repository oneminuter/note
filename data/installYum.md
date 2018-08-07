# Centos 安装yum

## [下载:http://yum.baseurl.org/download](http://yum.baseurl.org/download)

以 3.4 为例
## 解压
```shell
tar -zxvf yum-3.4.3.tar.gz
```

## 安装
```shell
cd yum-3.4.3
yummain.py install yum
```

如果报缺少配置文件  
Config Error: Error accessing file for config file:///etc/  
则在 **/etc** 下创建 **yum.conf**，然后再次运行 **yummain.py install yum**

## 更新系统
```shell
yum check-update  
yum update  
yum clean all 
```