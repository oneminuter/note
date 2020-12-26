# kvm 安装

[TOC]

## 查看是否支持虚拟化
```
grep -E 'svm|vmx' /proc/cpuinfo
yum install qemu-kvm libvirt libvirt-python libguestfs-tools virt-install
systemctl enable libvirtd && systemctl start libvirtd
```

## kvm 有线桥接网络
/etc/sysconfig/network-scripts/ifcfg-em1
```
BRIDGE=br0
```

桥接网络目前只支持有线网卡，无线网卡 wireless 不支持，虽然可用通过 dirty hack 的方式实现，但是很麻烦
配置 /etc/sysconfig/network-scripts/ifcfg-br0
```
DEVICE="br0"
# BOOTPROTO is up to you. If you prefer “static”, you will need to
# specify the IP address, netmask, gateway and DNS information.
BOOTPROTO="dhcp"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
ONBOOT="yes"
TYPE="Bridge"
DELAY="0"
```


##配置 ip 转发
```
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p /etc/sysctl.conf
systemctl restart NetworkManager
```

## SElinux
```
mkdir /vm-images
yum -y install policycoreutils-python
semanage fcontext --add -t virt_image_t '/vm-images(/.*)?'
semanage fcontext -l | grep virt_image_t
restorecon -R -v /vm-images
ls –aZ /vm-images
```

## 创建镜像命令
```
virt-install \
	--network bridge:virbr0 \
	--name k8s1 \
	--ram=2048 \
	--vcpu=2 \
	--os-type=linux \
	--disk path=/vm-images/k8s1.img,size=10 \
	--graphics none \
	--extra-args='console=tty0 console=ttyS0,115200n8 serial' \
	--debug \
	--location=/home/xiaolin/CentOS-7-x86_64-Minimal-2009.iso
```