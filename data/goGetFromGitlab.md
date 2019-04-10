# go get拉取内部gitlab包，并且是http

## 问题引出
- go get 一般拉取的 github 等公有仓库，但是当有的代码是内部业务代码，不方便公开，只能放在内部的 gitlab 上
- go get 内部是使用的是 git 拉取的代码，默认使用 https 方式，但是内网有时候又没有支持 https，怎么办？

## 配置 `~/.gitconfig` ,直接执行命令
```shell
git config --global url."ssh://git@myself.gitlab.com/".insteadOf "http://myself.gitlab.com/"
```
`myself.gitlab.com` 需替换为自己内网 gitlab 的访问域名，上面的操作是将 git 的请求转换为 http

## 拉取代码
```shell
go get -insecure myself.gitlab.com/linty/x
```

因为是 http 所以得加上 `-insecure` 参数


### 其他可能需要的辅助命令
```shell
git config --global http.extraheader "PRIVATE-TOKEN: jsYSRyWTmjtpHbx1ECL6"

git config --global url."git@myself.gitlab.com:linty/x.git".insteadOf "http://myself.gitlab.com/linty/x.git"
```