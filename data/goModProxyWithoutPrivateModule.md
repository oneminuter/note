# go mod 使用 GOPROXY 跳过私有 module

go mod 对某些私有 module 跳过 GOPROXY 代理

如果go版本大于等于1.13，则GOPRIVATE环境变量控制go命令认为哪些模块是私有的（不公开），不应使用代理或校验数据库

```
go env -w GOPROXY= 
# 设置环境变量允许绕过所选模块的代理
go env -w GOPRIVATE=*.corp.example.com
```