# git只同步指定分支下指定文件的更新

**原理：利用 git checkout -- [file] , 用本地仓库文件覆盖工作区文件**

```shell
git fetch [remote]
git checkout [remote/branch] -- [file]
```