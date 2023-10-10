# react 项目编译不输出源映射文件(.map)

本地创建一个 `.env` 文件，文件内容为
```
GENERATE_SOURCEMAP=%GENERATE_SOURCEMAP%
```

编译时设置环境变量；如：
```
export GENERATE_SOURCEMAP=false && yarn build --prod
```