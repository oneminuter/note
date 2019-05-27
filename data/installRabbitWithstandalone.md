# rabbitMQ standalone 安装

以 3.7.15 为例

## 下载 rabbitMQ
```shell
wget rabbitmq-server-mac-standalone-3.7.15.tar.xz
```

## 解压
```shell
tar -xvf rabbitmq-server-mac-standalone-3.7.15.tar.xz
```

## 启动
进入到 `sbin` 目录
```shell
./rabbitmq-server
```
这样启动是属于前台运行，不能关闭该窗口，也不能 ctrl+z 放到后台运行  
如果需要运行到后台，需要加上 `-detached` 参数
```shell
./rabbitmq-server -detached
```

## 运行插件
通过 standalone 安装直接运行默认是没有启动 web 管理界面，需要手动启动
```shell
./rabbitmq-plugins enable rabbitmq_management
```

web 管理访问 `http://localhost:15672` 