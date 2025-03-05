# 通过自定义环境变量使打包后请求不同后端域名路径

[TOC]

**背景需求**
前端工程一般分 开发环境、测试环境、生产环境，当打不同环境包的时候，需自动请求对应的后端域名路径。

## 安装必要的包
```
yarn add env-cmd --dev
```

## 修改请求后端接口代码
```
... 其他代码不变

// 接口域名
const apiProdHost = "https://api.demo.com/xxx";		// 生产环境
const apiTestHost = "https://test-api.demo.com/xxx";  // 添加测试环境
const apiDevHost = "http://localhost:8080/xxx";			// 开发环境

let apiHost = apiProdHost;
const apiEnv = process.env.REACT_APP_API_ENV;

// 根据环境变量设置 apiHost
switch(apiEnv) {
    case 'dev':
        apiHost = apiDevHost;
        break;
    case 'test':
        apiHost = apiTestHost;
        break;
    case 'prod':
        apiHost = apiProdHost;
        break;
    default:
        apiHost = apiDevHost;
}

// ... 其他代码保持不变 ...
```
这里读取了环境变量 **REACT_APP_API_ENV**

## 修改 package.json
```
{
  "scripts": {
    "start": "node scripts/start.js",
    "build": "node scripts/build.js",
    "test": "node scripts/test.js",
    "build:dev": "REACT_APP_API_ENV=dev node scripts/build.js --prod",
    "build:test": "REACT_APP_API_ENV=test node scripts/build.js --prod",
    "build:prod": "REACT_APP_API_ENV=prod node scripts/build.js --prod"
  }
}
```
增加了下面三行，上面的三行可选择删除或者保留

此时通过 
 - yarn build:dev  命令打就是开发环境的包
 - yarn build:test  命令打就是测试环境的包
 - yarn build:prod  命令打就是生产环境的包

## 通过自动化脚本自动打包

### 创建 deploy.sh
```
#!/bin/bash

# 获取当前时间
curTime=$(date +"%Y%m%d%H%M%S")

# 打包目标环境, 默认prod
env=${1:-prod};

# build
yarn build:$env;

# 打包
cp -r build [dist_dir]
tar -czf ${curTime}-[dist_dir].tar.gz [dist_dir]
mv ${curTime}-[dist_dir].tar.gz ~/Desktop/
rm -rf [dist_dir]
```

### 创建 Makefile
```
build-dev:
	sh deploy.sh dev
build-test:
	sh deploy.sh test
build-prod:
	sh deploy.sh prod
```

此时通过
 - make build-dev  命令打就是开发环境的包
 - make build-test  命令打就是测试环境的包
 - make build-prod  命令打就是生产环境的包
