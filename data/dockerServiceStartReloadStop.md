# docker 常规操作

[TOC]

## 启动 docker 服务
```
systemctl start docker
```

## 守护进程重启
```
sudo systemctl daemon-reload
```

## 重启docker服务
```
systemctl restart  docker
```

## 关闭 docker
```
systemctl stop docker
```

## 守护进程重启
```
sudo systemctl daemon-reload
```

### service 方式做上面的操作
```
service docker start
service docker restart
service docker stop
```