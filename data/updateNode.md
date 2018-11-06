# 升级node版本

## 产看node版本，没安装的请先安装
```shell
node -v
```

## 清楚node缓存
```shell
sudo npm cache clean -f
```

## 安装node版本管理工具'n'
```shell
sudo npm install n -g
```

## 使用版本管理工具安装指定node或者升级到最新node版本
```shell
sudo n stable  （安装node最新版本）

sudo n 8.9.4 （安装node指定版本8.9.4）
```

# 若版本号未改变则还需配置node环境变量

## 查看通过n安装的node的位置
```shell
	which node (如：/usr/local/n/versions/node/6.12.3）

	vim /etc/profile
```

## 将node安装的路径（这里为：/usr/local/n/versions/node/8.9.4）添加到文件末尾
```shell
export NODE_HOME=/usr/local/n/versions/node/8.9.4

export PATH=$NODE_HOME/bin:$PATH
```

## wq退出保存文件，编译/etc/profile;
```shell
source /etc/profile
```

再次使用node -v查看node版本