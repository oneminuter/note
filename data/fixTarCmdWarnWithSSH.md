# 解决 ssh 远程服务器使用 tar warning 提醒报错


背景：  
当我们在本地 mac 上，使用 ssh 远程执行 tar 命令时，会报下面的错误：
```
$ ssh -o ConnectTimeout=120 [server] tar -zxf xxx.tar.gz

tar: Ignoring unknown extended header keyword 'LIBARCHIVE.xattr.com.apple.provenance'
```

## 解决方式
```
tar --no-xattrs -zxf xxx.tar.gz
```