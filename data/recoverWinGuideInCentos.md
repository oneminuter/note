# centos 7 里恢复 window 引导

[TOC]

## 在CentOS7中需要配置/boot/grub2/grub.cfg

```shell
sudo vi /etc/grub.d/40_custom
```

打开文件后，按 **i** 进行编辑

```shell
#!/bin/sh
exec tail -n +3 $0
# This file provides an easy way to add custom menu entries. Simply type the 
# menu entries you want to add after this comment. Be careful not to change
# the  'exec tail' line above.
menuentry 'Windows 10'{
set root=(hd0,1)
chainloader +1
}
```

然后保存

## 执行
```shell
grub2-mkconfig -o /boot/grub2/grub.cfg
```

## 重启
```shell
reboot
```
