# kvm 常规操作


## 管理常用命令
```
virsh console xxx # 进入指定的虚拟机，进入的时候还需要按一下回车
virsh start xxx # 启动虚拟机
virsh shutdown xxx # 关闭虚拟机
virsh destroy xxx # 强制停止虚拟机
virsh reboot xxx # 重启虚拟机
virsh undefine xxx # 彻底销毁虚拟机，会删除虚拟机配置文件，但不会删除虚拟磁盘
virsh autostart xxx # 设置宿主机开机时该虚拟机也开机
virsh autostart --disable xxx # 解除开机启动
virsh suspend xxx # 挂起虚拟机
virsh resume xxx # 恢复挂起的虚拟机
```

## 虚拟机配置管理
```
# 编辑虚拟机配置文件（修改后需重启生效）
virsh edit <虚拟机名称>

# 导出虚拟机配置文件
virsh dumpxml <虚拟机名称> > vm-config.xml

# 从配置文件定义虚拟机
virsh define vm-config.xml

# 删除虚拟机（不删除磁盘文件）
virsh undefine <虚拟机名称>

# 删除虚拟机（包括磁盘文件）
virsh undefine --remove-all-storage <虚拟机名称>
```

## 虚拟机控制台与连接
```
# 进入虚拟机控制台（需虚拟机支持）
virsh console <虚拟机名称>

# 退出控制台：按 Ctrl + ]

# 查看虚拟机VNC端口
virsh vncdisplay <虚拟机名称>

# 查看SPICE连接信息
virsh domdisplay <虚拟机名称>
```

## 磁盘与存储管理
```
# 查看虚拟机磁盘信息
virsh domblklist <虚拟机名称>

# 附加磁盘到虚拟机
virsh attach-disk <虚拟机名称> <磁盘路径> <目标设备>

# 分离虚拟机磁盘
virsh detach-disk <虚拟机名称> <目标设备>

# 查看存储池列表
virsh pool-list --all

# 查看存储池详细信息
virsh pool-info <存储池名称>
```

## 网络管理
```
# 查看虚拟机网络接口
virsh domiflist <虚拟机名称>

# 查看网络列表
virsh net-list --all

# 查看网络详细信息
virsh net-info <网络名称>
```

## 性能监控
```
# 查看虚拟机CPU使用情况
virsh cpu-stats <虚拟机名称>

# 查看虚拟机内存使用情况
virsh dommemstat <虚拟机名称>

# 查看虚拟机块设备统计
virsh domblkstat <虚拟机名称> <设备名>
```

## 快照管理
```
# 创建快照
virsh snapshot-create-as <虚拟机名称> <快照名称>

# 查看快照列表
virsh snapshot-list <虚拟机名称>

# 恢复快照
virsh snapshot-revert <虚拟机名称> <快照名称>

# 删除快照
virsh snapshot-delete <虚拟机名称> <快照名称>
```

## 其他实用命令
```
# 查看KVM版本
virsh version

# 查看宿主机信息
virsh nodeinfo

# 查看虚拟化能力
virsh capabilities

# 查看帮助
virsh help
```

