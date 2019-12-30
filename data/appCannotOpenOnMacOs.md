# App 在macOS Catalina下提示已损坏无法打开解决办法

## 打开终端；
输入以下命令，回车；
```
sudo xattr -d com.apple.quarantine /Applications/xxxx.app
```
`注意：/Applications/xxxx.app `换成你的App路径（推荐直接将.app文件拖入终端中自动生成路径，以防空格等转义字符手动复制或输入出现错误）

重启App即可。