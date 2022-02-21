# 调整 git 分页方法

问题背景：
新版本的 git, 执行 git branch 之后会进入 编辑等待状态
core.pager 指定 Git 运行诸如 log、diff 等所使用的分页器，你能设置成用 more 或者任何你喜欢的分页器（默认用的是less）， 
当然你也可以什么都不用，设置空字符串

通过一下命令修改 git 分页

```
git config --global core.pager ''
```

