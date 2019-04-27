# 删除 centos 的旧内核

## 查看当前的内核
```
$ uname -a

Linux localhost.localdomain 3.10.0-862.3.2.el7.x86_64 #1 SMP Mon May 21 23:36:36 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux
```

其中 `3.10.0-862.3.2.el7.x86_64` 为当前使用的版本

## 列出所有内核版本
```
rpm -qa | grep kernel
```
以上命令会输出一下示例
```
kernel-3.10.0-862.3.2.el7.x86_64
kernel-headers-3.10.0-862.3.2.el7.x86_64
kernel-3.10.0-693.el7.x86_64
kernel-tools-3.10.0-862.3.2.el7.x86_64
kernel-tools-libs-3.10.0-862.3.2.el7.x86_64
```

## 删除旧版本
```
sudo yum remove kernel-3.10.0-693.el7.x86_64
```