# git stash 存储

[TOC]

## 存储当前的变更
```shell
git stash
```

## 显示存储列表
```shell
git stash list
```

## 应用最近的存储
```shell
git stash apply
```
`apply` 选项只尝试应用储藏的工作 —— 储藏的内容仍然在栈上  
对文件的变更被重新应用，但是被暂存的文件没有重新被暂存，git stash apply 命令时带上一个 --index 的选项来告诉命令重新应用被暂存的变更

## 删除存储
```shell
git stash drop [stash-name]

如
git stash drop stash@{0}
```

## 应用并删除存储
```shell
git stash pop
```

## 取消储藏
```shell
<!-- 没有指定存储，会选择最近的存储 -->
git stash show -p | git apply -R

git stash show -p stash@{0} | git apply -R
```
在某些情况下，你可能想应用储藏的修改，在进行了一些其他的修改后，又要取消之前所应用储藏的修改，通过取消该储藏的补丁达到

## 从储藏中创建分支
```shell
git stash branch [branch-name]
```
此操作成功，将会丢弃存储