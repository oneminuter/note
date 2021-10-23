# cnpm 安装

## node 安装或升级
从[官网下载](https://nodejs.org/zh-cn/)

## 升级 npm
```
npm install -g npm
```

## 安装 cnpm，设置镜像源
设置 [淘宝镜像源](https://npmmirror.com/)
```
npm install -g cnpm --registry=https://registry.npmmirror.com
```

或者你直接通过添加 npm 参数 alias 一个新命令
```
alias cnpm="npm --registry=https://registry.npmmirror.com \
--cache=$HOME/.npm/.cache/cnpm \
--disturl=https://npmmirror.com/dist \
--userconfig=$HOME/.cnpmrc"
```

或者
```
echo '\n#alias for cnpm\nalias cnpm="npm --registry=https://registry.npmmirror.com \
  --cache=$HOME/.npm/.cache/cnpm \
  --disturl=https://npmmirror.com/dist \
  --userconfig=$HOME/.cnpmrc"' >> ~/.zshrc && source ~/.zshrc
```