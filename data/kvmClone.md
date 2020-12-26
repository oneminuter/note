# kvm 克隆

如果你想安装同样的系统，并且配置也相同，建议使用克隆

注：要克隆，需先停止正在运行的虚拟机
```
virt-clone \
 --original vm1 \
 --name vm1-clone \
 --file /vm-images/vm1-clone.img
```