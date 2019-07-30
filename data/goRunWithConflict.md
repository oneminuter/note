# go 运行时包冲突解决方案

编译的时候回报 `panic: /debug/requests is already registered ...`
意思是 /debug/requests 被注册多次，用 go依赖管理 -govendor 解决包冲突
一次执行下面命令

```shell
go get -u github.com/kardianos/govendor
govendor init
govendor add +external
```

然后就可以 `go build` 

注意 `govendor init` 必须在入口文件或目录下执行，表示编译时优先从当前的 `vendor` 目录下查找相依包