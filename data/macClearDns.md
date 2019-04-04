# mac清理dns缓存

```shell
sudo dscacheutil -flushcache
```


根据Mac OS X操作系统的版本选择以下命令：

Mac OS X 12 (Sierra) and later:
```shell
sudo killall -HUP mDNSResponder
sudo killall mDNSResponderHelper
sudo dscacheutil -flushcache
```

Mac OS X 11 (El Capitan) and OS X 12 (Sierra):
```shell
sudo killall -HUP mDNSResponder
```

Mac OS X 10.10 (Yosemite), Versions 10.10.4+:
```shell
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```