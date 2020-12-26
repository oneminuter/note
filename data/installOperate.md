# kvm 常规操作


## 管理常用命令
```
virsh console xxx # 进入指定的虚拟机，进入的时候还需要按一下回车
virsh start xxx # 启动虚拟机
virsh shutdown xxx # 关闭虚拟机
virsh destroy xxx # 强制停止虚拟机
virsh undefine xxx # 彻底销毁虚拟机，会删除虚拟机配置文件，但不会删除虚拟磁盘
virsh autostart xxx # 设置宿主机开机时该虚拟机也开机
virsh autostart --disable xxx # 解除开机启动
virsh suspend xxx # 挂起虚拟机
virsh resume xxx # 恢复挂起的虚拟机
```