# create-react-app 创建项目提速

由于 create-react-app 默认使用的 npm 镜像包可能需要翻墙，导致创建项目卡住
可以通过设置 npm 镜像源之后，再使用 create-react-app 创建就好了

## 设置 npm 镜像源
```
npm config set registry https://registry.npm.taobao.org
```

## 查看 npm 配置
```
npm config get registry
```

## 创建项目
创建 Typescript React 项目
```
create-react-app my-app --template typescript
```