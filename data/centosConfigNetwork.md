# centos 网路配置相关

[TOC]

## 制作 centos7 U 盘镜像
之前用 UltraISO 制作，但是最进安装老报错，最后换了一个镜像制作工具就好了
[Fedora Media Writer](https://getfedora.org/zh_CN/workstation/download/)

## 启动网络
```
systemctl start NetworkManager
```

## 开机自启网络管理
```
chkconfig NetworkManager on
```

## 关闭开机自启网络管理
```
chkconfig NetworkManager off
```

## 重启 wifi
```
ifdown wlp2s0
ifup wlp2s0
```
`wlp2s0` 是 `/etc/sysconfig/network-scripts/ifcfg-` 的网络名/设备名

## 有线网卡配置
配置：/etc/sysconfig/network-scripts/ifcfg-eno1
```
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=dhcp
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=enp3s0
UUID=bfe58e70-daa2-459a-8dc0-ad33ad1b2675
DEVICE=enp3s0
ONBOOT=no
```

## 无线网卡 静态ip 
配置 `/etc/sysconfig/network-scripts/ifcfg-[wifi 名]`
```
ESSID=[wifi 名]
MODE=Managed
KEY_MGMT=WPA-PSK
MAC_ADDRESS_RANDOMIZATION=default
TYPE=Wireless
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=[wifi 名]
UUID=fbf1b041-3a53-4b1d-bc6d-a198c3dc1be0
ONBOOT=yes
IPADDR=192.168.1.29
PREFIX=24
GATEWAY=192.168.1.1
IPV6_PRIVACY=no
```

## 无线网密码
配置：/etc/sysconfig/network-scripts/keys-[wifi 名]
```
WPA_PSK=[wifi 密码]
```

## 无线网卡 动态ip 配合
```
ESSID=CMCC-WUM5
MODE=Managed
KEY_MGMT=WPA-PSK
SECURITYMODE=open
MAC_ADDRESS_RANDOMIZATION=default
TYPE=Wireless
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=dhcp
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=CMCC-WUM5
UUID=1c072bc4-c88d-429d-a61a-78724252e2c7
ONBOOT=yes
```

## 查看网卡 UUID
```
nmcli con show
```

## 查看 mac 地址
```
nmcli device show [interface]
```

## 启动 NetworkManager 管理
```
nmtui
```