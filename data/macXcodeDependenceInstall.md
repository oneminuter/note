# xcode 依赖软件安装

在执行有些命令时，比如 `make`，报错:
```shell
xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun
```

## 解决办法
终端运行：
```shell
xcode-select --install
```
回车后，系统弹出下载xcode组件，点击确认，下载完成后即可。