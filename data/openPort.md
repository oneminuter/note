# centos 7 firewall 开启端口

```shell
firewall-cmd --zone=public --add-port=80/tcp --permanent
```

## 含义
–zone #作用域

–add-port=80/tcp #添加端口，格式为：端口/通讯协议

–permanent #永久生效，没有此参数重启后失效

## 重启防火墙
```shell
systemctl restart firewalld.service
```

## 关闭端口
```shell
firewall-cmd --zone=public --remove-port=80/tcp --permanent
```

## 启动、 停止、 禁用 firewalld
```shell
systemctl start firewalld.service
systemctl stop firewalld.service
systemctl distable firewalld.service
```

## 显示状态
```shell
firewall-cmd --state
```

## 更新防火墙规则
```shell
firewall-cmd --reload
```

## 查看所有打开的端口
```shell
firewall-cmd --zone=dmz --list-ports
```
