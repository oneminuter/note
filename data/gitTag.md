# git tag 打标签

[TOC]

## 列显已有的标签
```shell
git tag

git tag -l 'v1.4.2.*'
```

## 新建标签，含附注的标签
```shell
git tag -a v1.4 -m 'my version 1.4'
```

## 查看相应标签的版本信息
```shell
git show v1.4
```

## 轻量级标签
-a，-s 或 -m 选项都不用，直接给出标签名字即可
```shell
git tag v1.4-lw
```

## 验证标签
```shell
git tag -v [tag-name]
```
（译注：取 verify 的首字母）的方式验证已经签署的标签。此命令会调用 GPG 来验证签名，所以你需要有签署者的公钥，存放在 keyring 中

## 后期加注标签
```shell
git tag -a v1.2 9fceb02
```

## 推送标签
```shell
 git push origin v1.5
```