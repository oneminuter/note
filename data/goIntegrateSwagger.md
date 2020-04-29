# go 集成 swagger

## 安装需要用到的包
```
go get -u github.com/swaggo/swag/cmd/swag
go get -u github.com/swaggo/gin-swagger
go get -u github.com/swaggo/gin-swagger/swaggerFiles

swag -v
```

## 接口代码支持swagger
在route生成的地方增加swagger的handler
```
router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
router.GET("/test", swagTest)
```

## 在 controller 上加注释
```
// @tags    分组
// @Summary 接口名
// @Description 接口描述
// @Accept   json
// @Produce  json
// @Param   reqParam  		  query    string     true      "上报 dna"
// @Success 200 {string} string ""
// @Failure 400 {string} string "参数错误"
// @Failure 500 {string} string "服务错误"
// @Router /test/ [get]
func swagTest(c *gin.Context) {
	//  业务逻辑
	c.String(200, "success")
}
```

## 生成 文档
```
swag init
```

之后会生成 docs 文件夹，该文件夹下包含 3 个文件
```
docs.go
swagger.json
swagger.yaml
```

## 在代码 main 主入口引入 docs/docs
```
_ "swaggerTest/docs"
```

其中 `swaggerTest` 为项目，根据实际情况改

## 访问
```
localhost:8080/docs/index.html
```
端口号根据实际情况修改