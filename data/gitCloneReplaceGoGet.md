# git clone 替代 go get 不到的包

使用举例：
```shell
git clone https://github.com/grpc/grpc-go.git $GOPATH/src/google.golang.org/grpc
git clone https://github.com/golang/text.git $GOPATH/src/golang.org/x/text
git clone https://github.com/googleapis/googleapis.git $GOPATH/src/google.golang.org/genproto/googleapis
```

# 如果项目是 go mod 方式管理的包
```shell
go mod edit -replace=google.golang.org/grpc=github.com/grpc/grpc-go@latest
go mod tidy
go mod vendor
go build -mod=vendor
```