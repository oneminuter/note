
## react 开发 chrome 插件改造

[TOC]

### 弹出配置
```
npm run eject
```
### 配置入口文件
为了让popup，background，content都拿打包对应的js文件文件，需要设置多入口，主要是修改entry字段
我们来对config/webpack.config.js作如下修改：
下面这行
```
entry: paths.appIndexJs,
output: {
    ....
```

改为
```
entry: {
      main: [
        isEnvDevelopment &&
        require.resolve('react-dev-utils/webpackHotDevClient'),
        paths.appIndexJs,
      ].filter(Boolean),
      content: './src/content/content.tsx',
      background: './src/background/background.tsx' // 如果有多个可以对应创建入口
    },
 output: {
    ...
```

### 固定build生成的文件名
```
 - 去掉文件hash值，删除[contenthash:8]，共4处。（当然你也可以写一些工具尝试在打包阶段动态修改manifest.json文件，这样这个步骤就不需要了）
 - 由于是多入口，需要将static/js/bundle.js修改为static/js/[name].bundle.js。
 - 将runtimeChunk设置为false，否则build后还会多生成runtime-background.js、runtime-content.js、runtime-main.js。
 - 注释掉splitChunks，取消分包，否则会生成类似1.chunk.js、2.chunk.js等文件。
```

### 设置popup不引入另外两个模块的js
设置index.html只引入main.js，否则popup页面会把background/index.js和content/index.js也引入

// 580行
```
new HtmlWebpackPlugin(
          Object.assign(
              {},
              {
                inject: true,
                // html只引入popup代码，chrome插件开发不能引入content和background的代码
                chunks: ['main'],
                template: paths.appHtml,
              },
              isEnvProduction
                  ? {
                    minify: {
                      removeComments: true,
                      collapseWhitespace: true,
                      removeRedundantAttributes: true,
                      useShortDoctype: true,
                      removeEmptyAttributes: true,
                      removeStyleLinkTypeAttributes: true,
                      keepClosingSlash: true,
                      minifyJS: true,
                      minifyCSS: true,
                      minifyURLs: true,
                    },
                  }
                  : undefined
          )
      ),
```

### 添加 styled 样式定义
```
yarn add styled-components
```
导入包
```
import styled from 'styled-components';

const Ctn = styled.div`
  xxx // 这里面写样式
`
```



### 引入Antd
注意：如果开发的是 content 插件脚本，是不支持 antd 组件
antd的引入方式和传统开发一样，这里还是贴一下代码，首先安装一下antd的库：
```
npm install antd --save
```

接着我们还需要补充antd的按需加载能力，这一部分官网也有介绍，首先安装babel-plugin-import：
```
npm install babel-plugin-import --save-dev
```

接着修改package.json:
```
"babel": {
    "presets": [
      "react-app"
    ],
    "plugins": [
      [
        "import",
        {
          "libraryName": "antd",
          "style": "css"
        }
      ]
    ]
  },
```