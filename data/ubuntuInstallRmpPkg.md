# ubuntu 安装 rpm 包

Ubuntu的软件包格式为deb,而RPM格式的包则是Red Hat 相关系统所用的软件包。当我们看到一个想用的软件包时，如果他是RPM格式，而你的操作系统是Ubuntu，那岂不是很遗憾？其实，在Ubuntu系统中通过一定的方法也是可以很有效的安装RPM格式包的，下面来说下方法：

首先，我们要安装alien这一软件

```
sudo apt-get install alien
```
alien默认没有安装，所以首先要安装它


```
sudo alien xxxx.rpm
```
将rpm转换为deb,完成后会生成一个xxxx.deb


```
sudo dpkg -i xxxx.deb
```
这样xxxx软件就可以安装完成了


注意，用alien转换deb包并不能保证完全顺利安装，所以如果能找到deb包，还是用deb包为好