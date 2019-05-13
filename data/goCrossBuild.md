# go 交叉编译

单条临时交叉编译
```shell
GOOS=linux GOARCH=amd64 go build hello.go
```

当前命令窗口生效，则设置环境变量
```shell
export GOOS=linux
export GOARCH=amd64
go build hello.go
```

## 参数解析
`GOOS`：目标操作系统  
`GOARCH`：目标操作系统的架构

| OS | ARCH |
| :---: | :---: |
| linux | 386 / amd64 / arm |
| darwin | 386 / amd64 |
| freebsd | 386 / amd64 |
| windows | 386 / amd64 |