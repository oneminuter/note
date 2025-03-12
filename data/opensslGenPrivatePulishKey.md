# openssl生成密钥对

[TOC]

背景信息：
在使用 aws cloudfront 加速 S3 存储对象时，如果 S3 对象时私有对象，但是需要生成签名 url, 生成过程需要使用到密钥对


## 命令使用 OpenSSL 
生成长度为 2048 位的 RSA 密钥对，并将其保存到名为 private_key.pem 的文件中
```shell
openssl genrsa -out private_key.pem 2048
```

## 从名为 private_key.pem 的文件中提取公有密钥
```shell
openssl rsa -pubout -in private_key.pem -out public_key.pem
```


参考
[aws CloudFront 文档-创建密钥对](https://docs.aws.amazon.com/zh_cn/AmazonCloudFront/latest/DeveloperGuide/AmazonCloudFront_DevGuide.pdf)