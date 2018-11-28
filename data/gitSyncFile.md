# git只同步某个分支下某个文件的更新

**原理：利用 git checkout -- [file] , 用户本地仓库文件覆盖工作区文件**

```shell
git fetch [remote]
git checkout [remote/branch] -- [file]
```