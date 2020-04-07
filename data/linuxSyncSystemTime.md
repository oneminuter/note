# linux 同步系统时间

```shell
ntpdate -u ntp.api.bz
```

只是强制性的将系统时间设置为ntp服务器时间。如果CPU Tick有问题，只是治标不治本。所以，一般配合cron命令，来进行定期同步设置
```
0 0 * * * /usr/sbin/ntpdate -u ntp.api.bz
```

如果让系统时间与硬件时钟同步，则用

```shell
hwclock --hctosys  （hc代表硬件时间，sys代表系统时间）

clock --systohc  系统时钟和硬件时钟同步
```

`hwclock或者clock命令。两者基本相同，只用一个就行，只不过clock命令除了支持x86硬件体系外，还支持Alpha硬件体系`

