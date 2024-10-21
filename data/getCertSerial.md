# 命令查看证书序列号

场景：我们在接微信支付时，服务端需要商户证书序列号

## opensll 命令获取
```
openssl x509 -in apiclient_cert.pem -noout -serial
```

## 商户号和商户API证书
```
openssl x509 -in apiclient_cert.pem -noout -text | grep -o 'CN=[0-9]*'  | sed 's/CN=//'
```

附件：
[微信支付相关文档](https://pay.weixin.qq.com/docs/merchant/development/verify-signature-faq/merchant-serial-number-certificate-incorrect.html)