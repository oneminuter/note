# conda 命令使用

[TOC]

## 创建新环境（默认Python版本）
```
conda create -n myenv
```

## 创建指定Python版本的环境
```
conda create -n myenv python=3.11
```

## 创建环境并安装指定包
```
conda create -n myenv python=3.11 numpy pandas matplotlib
```

## 激活环境
```
conda activate myenv
```

## 退出环境
```
conda deactivate
```

## 查看所有环境
```
conda env list
# 或
conda info --envs
```

## 删除环境
```
conda remove -n myenv --all
```

## 克隆现有环境
```
conda create -n newenv --clone oldenv
```