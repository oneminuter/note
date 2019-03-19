# git 查看文件修改历史

## 显示文件的每一行最后的修改
```shell
git blame [file]
```

## 显示某个文件的每个版本提交信息
```shell
git whatchanged [file]
```

## 显示每个版本的修改详情
```shell
git show 007e5c69d4ea413424b9e167a6309ecff94dcc89

git log -p 007e5c69d4ea413424b9e167a6309ecff94dcc89
```

## 显示某个版本的某个文件的修改情况
```shell
git show 007e5c69d4ea413424b9e167a6309ecff94dcc89 [file]
```

## 显示所有提交记录，每一条记录只显示一行
```shell
git log --pretty=oneline
```

## 显示某个文件有关的所有提交记录
```shell
git log --pretty=oneline [file]
```