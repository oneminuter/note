# go get 使用国内镜像

问题引出：有时候，当我们在使用go get下载如 golang.org 这样的依赖包时，可能会下载失败，因为需要翻墙

这时候可以采用 gopm 从国内镜像下载源码，gopm 现在的只是源代码，需要到对应的目录中去 go install

### 安装gopm
```shell
go get -u github.com/gpmgo/gopm
```

用 gopm get -g代替go get
不采用-g参数，会把依赖包下载.vendor目录下面； 
采用-g 参数，可以把依赖包下载到GOPATH目录中；
```shell
gopm get -g golang.org/x/net
```