# centos 配置连接无线网络

## 配置文件路径
```shell
/etc/sysconfig/network-scripts
```

## 配置无线网卡
创建文件名以 `ifcfg-` 开头，后面跟 wifi 名字
如：ifcfg-CMCC-5G
配置文件内容：
```shell
HWADDR=DC:85:DE:45:77:25
ESSID=CMCC-5G
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
UUID=43521235-f75f-4adc-8b42-aac061b501cb
ONBOOT=yes
```

## 创建 wifi 密码文件
创建文件名以 `keys-` 开头，后面的名字和上面的 wifi 名字相同
如：keys-CMCC-5G
文件内容为 wifi 密码：
```
WPA_PSK=wifiPassword
```
--
扩充

## 配置有线网卡
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
