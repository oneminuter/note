# 解决小程序使用扩展组件找不到问题"

按照微信小程序[官方步骤](https://developers.weixin.qq.com/miniprogram/dev/extended/component-plus/)，使用小程序的扩展组件，会发现小程序报组件找不到错误

解决步骤：

## 配置 project.config.json 文件
```
"setting": {
	"packNpmManually": true,
    "packNpmRelationList": [
      {
        "packageJsonPath": "./package.json",
        "miniprogramNpmDistDir": "./miniprogram/"
      }
    ]
}
```

在 project.config.json 配置文件中修改 setting 下面的如上配置就好了

参考：[vant-weapp 快速上手](https://vant-contrib.gitee.io/vant-weapp/#/quickstart)