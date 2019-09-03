# linux 查看系统配置

## 查看系统版本
```shell
rpm -q centos-release
```

## 查看 cpu 配置
```shell
cat /proc/cpuinfo | grep name
```

## 查看 内存 配置
```shell
cat /proc/meminfo | head -4
```

## 查看磁盘分区使用情况
```shell
df -h
```

## 查看磁盘数量及大小
```shell
sudo fdisk -l
```

## 查看磁盘 io 占用
```shell
iostat -kdx 1
```

## 统计文件大小并排序
```shell
du -sh [file] | sort -h
```

## 网卡名字(厂家)等信息
```shell
dmesg | grep eth0
```

## 流量监控
```shell
sudo iftop
```