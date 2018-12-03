# git从指定分支复制文件到当前分支

原理：用本地仓库文件覆盖工作区文件是同一个原理，只是加了指定分支
```shell
git checkout branch file
或
git checkout branch -- file
```