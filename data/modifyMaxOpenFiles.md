# 修改系统打开文件最大数

## 概述
在配置 ssdb 的时候，默认启动最大打开文件数为 500，系统的最大打开文件数为 65535，需要修改最大文件打开数为 20000

## 查看系统最大文件打开数
```shll
ulimit -a
```

## 修改系统最大打开文件数
```
sudo vim /etc/security/limits.conf

# 修改或加入下面两行
* soft nofile 200000
* hard nofile 200000
```
注：其中 * 可以改为 对应的用户名更好

这时，退出当前用户，再查看系统文件最大打开数已经变了

## ssdb 配置文件最大打开数
```
leveldb:
	max_open_files: 200000
```
在 leveldb 下配置 max_open_files ，再重启 ssdb

## 拓展

#### 系统全局文件大小也有相应办法调整

```
# 修改/etc/sysctl.conf
# 加入
fs.file-max = 1020000
```