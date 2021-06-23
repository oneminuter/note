# androd 手机里运行 go 程序

[TOC]

## 下载 adb
[adb 下载](http://adbdownload.com/)

下载 adb 之后，解压，里面有个 adb 的可执行文件

手机需要打开开发者选项，并开启 USB 调试

## 简单的 go 程序
```
package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	engine := gin.New()
	engine.Any("hello", func(c *gin.Context) {
		c.String(http.StatusOK, time.Now().Format("2006-01-02 15:04:05 reply world"))
	})
	engine.Run(":8080")
}
```

## 编译 go 程序
```
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o android-go main.go
```

这里的 GOARCH 我用的是小米手机测试
查看 android 的系统架构，可使用
```
./adb shell
getprop ro.product.cpu.abi
```


## 将 go 程序 copy 到 android 手机内
```
./adb push android-go /data/local/tmp/
```

## adb 连上 android 执行 shell，运行 go 程序
```
./adb shell 
cd /data/local/tmp
./android-go
```

这时可以在手机浏览器上输入：localhost:8080/hello 查看返回