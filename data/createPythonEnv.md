# python 创建虚拟环境

[TOC]

创建 python 虚拟环境可以使用两种方式，venv 和 conda
两者的区别：
 - venv是Python自带的模块，而conda是一个独立的软件包，可以管理多种语言的虚拟环境。
 - venv只能创建Python虚拟环境，而conda可以创建多种语言的虚拟环境，例如R、Julia等。
 - venv只能安装Python的包，而conda可以安装不同编程语言的包，例如C++等。
 - venv没有图形用户界面，是一个命令行工具，而conda有一个GUI，称为Anaconda Navigator。
 - venv可以通过Python的命令行工具创建和管理虚拟环境，而conda可以通过Anaconda命令行工具和GUI创建和管理虚拟环境。

## 创建venv虚拟环境
 ```
 python -m venv env
 ```
 其中，env是虚拟环境的名称，可以根据需要修改


### 激活虚拟环境
  - Windows系统：
  ```
  env\Scripts\activate
  ```

  - macOS或Linux系统：
  ```
  source env/bin/activate
  ```

### 退出虚拟环境
```
deactivate
```


## 创建conda虚拟环境
```
conda create --name env
```
其中，env是虚拟环境的名称，可以根据需要修改。还可以指定使用特定的Python版本、包和库

### 激活虚拟环境
```
conda activate env
```

### 退出虚拟环境
```
conda deactivate
```