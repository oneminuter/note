# go get 拉取自定义内网代码

```shell
git config --global url."ssh://git@git.myself.com/".insteadOf "http://git.myself.com/"
go get -insecure git.myself.com/module
```