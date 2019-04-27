# Linux 实现用户间无密码切换

## 用户无密码切换到 root 用户

第一种方法：将用户添加 `root` 执行权限，并加入到 `wheel` 组中，需要放开 `/etc/sudoers` 中的 `#%wheel	ALL=(ALL)	NOPASSWD: ALL` 的注释，即去掉前面的 `#` 号

第二种方法，修改 `/etc/passwd` 文件中的对应用户，将中间的 `x` 去掉
如
```
admin:x:1002:1002::/home/admin:/bin/bash
```
改为
```
admin::1002:1002::/home/admin:/bin/bash
```
这种方法也可以实现普通用户间的无密码切换